import { send } from "process";
import { catchAsync } from "../../helper/catchAsync";
import { UserService } from "../User/user.service";
import { AuthService } from "./auth.service";
import sendResponse from "../../helper/sendResponse";
import status from "http-status";
import { IAuth, IAuthUser } from "./auth.interface";
import config from "../../config";


const loginUser = catchAsync(async (req, res) => {
    const result = await AuthService.loginUserIntoDB(req.body as IAuth);
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    })

    sendResponse(res, {
        success: true,
        message: "User logged in successfully",
        statusCode: status.OK,
        data: {
            accessToken: result.accessToken,
        },
    })
});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return sendResponse(res, {
            success: false,
            message: "Refresh token not found",
            statusCode: status.UNAUTHORIZED,
        })
    }
    const result = await AuthService.refreshTokenIntoDB(refreshToken);
    res.cookie("refreshToken", result.accessToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    })

    sendResponse(res, {
        success: true,
        message: "Access token is retrieved succesfully!",
        statusCode: status.OK,
        data: {
            accessToken: result.accessToken,
        },
    })
})

const logoutUser = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return sendResponse(res, {
            success: false,
            message: "Refresh token not found",
            statusCode: status.UNAUTHORIZED,
        })
    }
    await AuthService.logoutUserFromDB();

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
        secure: false,
        httpOnly: true
    })
    sendResponse(res, {
        success: true,
        message: "User logged out successfully",
        statusCode: status.OK,
    })
})

const resetPassword = catchAsync(async (req, res) => {
    await AuthService.resetPasswordIntoDB(req.body, req.user as any);
    sendResponse(res, {
        success: true,
        message: "Password reset successfully",
        statusCode: status.OK
    })
})

const changePassword = catchAsync(async (req, res) => {
    const user = req.user as IAuth;
    const result = await AuthService.changePasswordIntoDB(req.body, user);
    sendResponse(res, {
        success: true,
        message: "Password changed successfully",
        statusCode: status.OK,
        data: result
    })
})

export const AuthController = {
    loginUser,
    refreshToken,
    logoutUser,
    resetPassword,
    changePassword
}