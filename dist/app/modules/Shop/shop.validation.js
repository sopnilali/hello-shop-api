"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopValidation = void 0;
const zod_1 = require("zod");
const createShop = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().min(10).max(500),
    logo: zod_1.z.string().url().optional()
});
const updateShop = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100).optional(),
    description: zod_1.z.string().min(10).max(500).optional(),
    logo: zod_1.z.string().url().optional()
});
exports.ShopValidation = {
    createShop,
    updateShop
};
