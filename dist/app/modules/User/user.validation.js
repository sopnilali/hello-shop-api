"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createUserValidation = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Name is required",
    }),
    email: zod_1.z.string({
        required_error: "Email is required",
    }).email("Invalid email address"),
    password: zod_1.z.string({
        required_error: "Password is required",
    }).min(6, "Password must be at least 6 characters long")
});
const updateUserValidationSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().optional(),
    profilePhoto: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    role: zod_1.z.enum([client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.SELLER]).optional(),
    status: zod_1.z.enum([client_1.UserStatus.ACTIVE, client_1.UserStatus.BLOCKED]).optional(),
});
exports.UserValidation = {
    createUserValidation,
    updateUserValidationSchema
};
