"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
const createCategoryValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }),
    description: zod_1.z.string({ required_error: "Description is required" })
});
const updateCategoryValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }).optional(),
    description: zod_1.z.string({ required_error: "Description is required" }).optional()
});
exports.CategoryValidation = {
    createCategoryValidation,
    updateCategoryValidation
};
