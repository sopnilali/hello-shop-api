"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandValidation = void 0;
const zod_1 = require("zod");
const createBrandValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }),
    description: zod_1.z.string({ required_error: "Description is required" }),
    image: zod_1.z.string({ required_error: "Image is required" }).optional(),
});
const updateBrandValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }).optional(),
    description: zod_1.z.string({ required_error: "Description is required" }).optional(),
    image: zod_1.z.string({ required_error: "Image is required" }).optional(),
    status: zod_1.z.string({ required_error: "Status is required" }).optional(),
});
exports.BrandValidation = {
    createBrandValidation,
    updateBrandValidation,
};
