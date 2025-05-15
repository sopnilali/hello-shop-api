import status from "http-status";
import AppError from "../errors/AppError";
import { catchAsync } from "../helper/catchAsync"
import { TokenUtils } from "../utils/token";
import config from "../config";
import { Secret } from "jsonwebtoken";
import { IAuthUser } from "../modules/Auth/auth.interface";

const auth = (...roles: string[])=> {
    return catchAsync(async (req, res, next) => {
        let token;
        token = req.headers.authorization;
        if (!token) {
            throw new AppError(status.UNAUTHORIZED, "You are not authorized to access this resource");
        }

        const decoded = TokenUtils.VerifyToken(token, config.jwt.jwt_access_secret as Secret) as IAuthUser;
        const role = decoded.role;
        if(roles.length && !roles.includes(role)) {
            throw new AppError(status.FORBIDDEN, "You do not have permission to access this resource");
        }
        req.user = decoded;
        next();
    })
}

export default auth;
