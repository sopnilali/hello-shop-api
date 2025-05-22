"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponValidation = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const createCoupon = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z.string().min(3).max(20),
        type: zod_1.z.enum([client_1.CouponType.PERCENTAGE, client_1.CouponType.FIXED_AMOUNT]),
        value: zod_1.z.number().positive(),
        minPurchase: zod_1.z.number().positive().optional(),
        maxDiscount: zod_1.z.number().positive().optional(),
        startDate: zod_1.z.string().transform(str => new Date(str)),
        endDate: zod_1.z.string().transform(str => new Date(str)),
        usageLimit: zod_1.z.number().int().positive().optional()
    }).refine(data => {
        if (data.type === client_1.CouponType.PERCENTAGE && data.value > 100) {
            return false;
        }
        return true;
    }, {
        message: "Percentage discount cannot exceed 100%"
    }).refine(data => {
        return data.startDate < data.endDate;
    }, {
        message: "Start date must be before end date"
    })
});
const updateCoupon = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z.string().min(3).max(20).optional(),
        type: zod_1.z.enum([client_1.CouponType.PERCENTAGE, client_1.CouponType.FIXED_AMOUNT]).optional(),
        value: zod_1.z.number().positive().optional(),
        minPurchase: zod_1.z.number().positive().optional(),
        maxDiscount: zod_1.z.number().positive().optional(),
        startDate: zod_1.z.string().transform(str => new Date(str)).optional(),
        endDate: zod_1.z.string().transform(str => new Date(str)).optional(),
        usageLimit: zod_1.z.number().int().positive().optional()
    }).refine(data => {
        if (data.type === client_1.CouponType.PERCENTAGE && data.value && data.value > 100) {
            return false;
        }
        return true;
    }, {
        message: "Percentage discount cannot exceed 100%"
    }).refine(data => {
        if (data.startDate && data.endDate) {
            return data.startDate < data.endDate;
        }
        return true;
    }, {
        message: "Start date must be before end date"
    })
});
const validateCoupon = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z.string(),
        totalAmount: zod_1.z.number().positive()
    })
});
exports.CouponValidation = {
    createCoupon,
    updateCoupon,
    validateCoupon
};
