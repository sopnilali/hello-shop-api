import { UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

const createUserValidation = z.object({
        name: z.string({
            required_error: "Name is required",
        }),
        email: z.string({
            required_error: "Email is required",
        }).email("Invalid email address"),
        password: z.string({
            required_error: "Password is required",
        }).min(6, "Password must be at least 6 characters long")

    })

const updateUserValidationSchema =  z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        password: z.string().optional(),
        phoneNumber: z.string().optional(),
        profilePhoto: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        role: z.enum([UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER]).optional(),
        status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED]).optional(),
    })

export const UserValidation = {
    createUserValidation,
    updateUserValidationSchema
}