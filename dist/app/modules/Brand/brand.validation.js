"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandValidation = void 0;
const zod_1 = require("zod");
const createBrandValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }),
    description: zod_1.z.string({ required_error: "Description is required" }),
    logo: zod_1.z.string({ required_error: "Logo is required" }).optional(),
});
const updateBrandValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }).optional(),
    description: zod_1.z.string({ required_error: "Description is required" }).optional(),
    logo: zod_1.z.string({ required_error: "Image is required" }).optional(),
});
exports.BrandValidation = {
    createBrandValidation,
    updateBrandValidation,
};
