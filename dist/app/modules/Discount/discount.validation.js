"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountValidation = void 0;
const zod_1 = require("zod");
const createDiscount = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
        value: zod_1.z.number().positive().max(100),
        startDate: zod_1.z.string().transform(str => new Date(str)),
        endDate: zod_1.z.string().transform(str => new Date(str)),
        status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']).optional()
    })
});
const updateDiscount = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.enum(['PERCENTAGE', 'FIXED_AMOUNT']).optional(),
        value: zod_1.z.number().positive().max(100).optional(),
        startDate: zod_1.z.string().transform(str => new Date(str)).optional(),
        endDate: zod_1.z.string().transform(str => new Date(str)).optional(),
        status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']).optional()
    })
});
exports.DiscountValidation = {
    createDiscount,
    updateDiscount
};
