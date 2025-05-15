"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = require("../../helper/catchAsync");
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../helper/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const loginUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.loginUserIntoDB(req.body);
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User logged in successfully",
        statusCode: http_status_1.default.OK,
        data: {
            accessToken: result.accessToken,
        },
    });
}));
const refreshToken = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            message: "Refresh token not found",
            statusCode: http_status_1.default.UNAUTHORIZED,
        });
    }
    const result = yield auth_service_1.AuthService.refreshTokenIntoDB(refreshToken);
    res.cookie("refreshToken", result.accessToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Access token is retrieved succesfully!",
        statusCode: http_status_1.default.OK,
        data: {
            accessToken: result.accessToken,
        },
    });
}));
const logoutUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            message: "Refresh token not found",
            statusCode: http_status_1.default.UNAUTHORIZED,
        });
    }
    yield auth_service_1.AuthService.logoutUserFromDB();
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
        secure: false,
        httpOnly: true
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User logged out successfully",
        statusCode: http_status_1.default.OK,
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_service_1.AuthService.resetPasswordIntoDB(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Password reset successfully",
        statusCode: http_status_1.default.OK
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield auth_service_1.AuthService.changePasswordIntoDB(req.body, user);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Password changed successfully",
        statusCode: http_status_1.default.OK,
        data: result
    });
}));
exports.AuthController = {
    loginUser,
    refreshToken,
    logoutUser,
    resetPassword,
    changePassword
};
