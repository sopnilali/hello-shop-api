import dotenv from 'dotenv'
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") })


export default {
    jwt: {
        jwt_access_secret: process.env.JWT_ACCESS_SECRET,
        jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,

        jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
        jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
        bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
        jwt_reset_password_secret: process.env.JWT_RESET_PASSWORD_SECRET,
        jwt_reset_password_expires_in: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    ssl: {
        store_name: process.env.STORE_NAME,
        store_id: process.env.STORE_ID,
        store_password: process.env.STORE_PASSWORD,
        payment_api: process.env.PAYMENT_API,
        validation_api: process.env.VALIDATION_API,
        success_url: process.env.SUCCESS_URL,
        failed_url: process.env.FAILED_URL,
        cancel_url: process.env.CANCEL_URL,
    },
    email: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD
    },
    saltRounds: process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10,
    node_env: process.env.NODE_ENV,

}
