import { z } from "zod";
import { Conditions, ProductStatus } from "@prisma/client";

const createProductValidation = z.object({
    name: z.string({ required_error: "Name is required" }),
    description: z.string({ required_error: "Description is required" }),
    price: z.number({ required_error: "Price is required" }),
    weight: z.number({ required_error: "Weight is required" }).optional(),
    quantity: z.number({ required_error: "Quantity is required" }),
    categoryId: z.string({ required_error: "Category ID is required" }),
    brandId: z.string({ required_error: "Brand ID is required" }),
});

const updateProductValidation = z.object({
    name: z.string({ required_error: "Name is required" }).optional(),
    description: z.string({ required_error: "Description is required" }).optional(), 
    price: z.number({ required_error: "Price is required" }).optional(),
    weight: z.number({ required_error: "Weight is required" }).optional(),
    quantity: z.number({ required_error: "Quantity is required" }).optional(),
    images: z.array(z.string()).optional(),
    categoryId: z.string({ required_error: "Category ID is required" }).optional(),
    condition: z.nativeEnum(Conditions).optional(),
    brandId: z.string({ required_error: "Brand ID is required" }).optional(),
    status: z.nativeEnum(ProductStatus).optional(),
});

export const ProductValidation = {
    createProductValidation,
    updateProductValidation
};
