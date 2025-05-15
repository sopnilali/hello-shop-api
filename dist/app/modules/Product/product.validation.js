"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const createProductValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }),
    description: zod_1.z.string({ required_error: "Description is required" }),
    price: zod_1.z.number({ required_error: "Price is required" }),
    weight: zod_1.z.number({ required_error: "Weight is required" }).optional(),
    quantity: zod_1.z.number({ required_error: "Quantity is required" }),
    categoryId: zod_1.z.string({ required_error: "Category ID is required" }),
    brandId: zod_1.z.string({ required_error: "Brand ID is required" }),
});
const updateProductValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }).optional(),
    description: zod_1.z.string({ required_error: "Description is required" }).optional(),
    price: zod_1.z.number({ required_error: "Price is required" }).optional(),
    weight: zod_1.z.number({ required_error: "Weight is required" }).optional(),
    quantity: zod_1.z.number({ required_error: "Quantity is required" }).optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    categoryId: zod_1.z.string({ required_error: "Category ID is required" }).optional(),
    condition: zod_1.z.nativeEnum(client_1.Conditions).optional(),
    brandId: zod_1.z.string({ required_error: "Brand ID is required" }).optional(),
    status: zod_1.z.nativeEnum(client_1.ProductStatus).optional(),
});
exports.ProductValidation = {
    createProductValidation,
    updateProductValidation
};
