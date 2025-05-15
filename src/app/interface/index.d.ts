import { JwtPayload } from "jsonwebtoken";
import { ILoginResponse } from "../modules/Auth/auth.interface";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload | ILoginResponse;
        }
    }
} 