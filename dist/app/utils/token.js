"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const GenerateToken = (jwtPayload, secret, expiresIn) => {
    const options = { expiresIn };
    const token = jsonwebtoken_1.default.sign(jwtPayload, secret, options);
    return token;
};
const VerifyToken = (token, secret) => {
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    return decoded;
};
const DecodeToken = (token) => {
    const decoded = jsonwebtoken_1.default.decode(token);
    return decoded;
};
exports.TokenUtils = {
    GenerateToken,
    VerifyToken,
    DecodeToken
};
