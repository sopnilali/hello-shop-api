import { Secret, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { IAuthUser } from "../modules/Auth/auth.interface";


const GenerateToken = (jwtPayload: IAuthUser, secret: Secret, expiresIn: number | any) => {
    const options: SignOptions = {expiresIn}
    const token = jwt.sign(jwtPayload, secret, options);
    return token;

}

const VerifyToken = (token: string, secret: Secret) => {
    const decoded = jwt.verify(token, secret);
    return decoded;
}
const DecodeToken = (token: string) => {
    const decoded = jwt.decode(token);
    return decoded;
}

export const TokenUtils = {
    GenerateToken,
    VerifyToken,
    DecodeToken
}