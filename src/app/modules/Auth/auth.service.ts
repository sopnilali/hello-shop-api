import { UserStatus } from "@prisma/client";
import config from "../../config";
import prisma from "../../utils/prisma";
import { TokenUtils } from "../../utils/token";
import { IAuth, IAuthUser, IChangePassword, IResetPassword } from "./auth.interface";
import * as bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import status from "http-status";

const loginUserIntoDB = async (payload: IAuth) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error("Password is incorrect");
    }

    const JWTAuthUsers: IAuthUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }

    const accessToken = TokenUtils.GenerateToken(JWTAuthUsers, config.jwt.jwt_access_secret as Secret, config.jwt.jwt_access_expires_in);
    const refreshToken = TokenUtils.GenerateToken(JWTAuthUsers, config.jwt.jwt_refresh_secret as Secret, config.jwt.jwt_refresh_expires_in);

    return {
        accessToken,
        refreshToken,
    }

}

const refreshTokenIntoDB = async (token: string) => {
    const decoded = TokenUtils.VerifyToken(token, config.jwt.jwt_refresh_secret as Secret);
    const user = await prisma.user.findUnique({
        where: {
            id: (decoded as IAuthUser).id
        }
    })
    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    const Ustatus = user.status === UserStatus.BLOCKED;
    if (Ustatus) {
        throw new AppError(status.BAD_REQUEST, "User is blocked");
    }
    
    const JWTAuthUsers: IAuthUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }

    const accessToken = TokenUtils.GenerateToken(JWTAuthUsers, config.jwt.jwt_refresh_secret as Secret, config.jwt.jwt_refresh_expires_in);
    return {
        accessToken
    }
}

const logoutUserFromDB = async ( ) => {
    return null;
}

const resetPasswordIntoDB = async (payload: IResetPassword, user : IAuth) => {
    const userinfo = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    })
    
    if (!userinfo) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, config.saltRounds);
    
    await prisma.user.update({
        where: {
            id: user.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })
    
    return null;
}

const changePasswordIntoDB = async (payload: IChangePassword, user : IAuth) => {
    const userinfo = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    })
    
    if (!userinfo) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    const isPasswordMatch = await bcrypt.compare(payload.newPassword, userinfo.password);
    
    if (isPasswordMatch) {
        throw new AppError(status.BAD_REQUEST, "New password cannot be same as old password");
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, config.saltRounds);
    
    await prisma.user.update({
        where: {
            id: userinfo.id
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })
    
    return null;
}


export const AuthService = {
    loginUserIntoDB,
    refreshTokenIntoDB,
    logoutUserFromDB,
    resetPasswordIntoDB,
    changePasswordIntoDB
}

