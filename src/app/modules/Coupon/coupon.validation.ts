import { z } from 'zod';
import { CouponType } from '@prisma/client';

const createCoupon = z.object({
    body: z.object({
        code: z.string().min(3).max(20),
        type: z.enum([CouponType.PERCENTAGE, CouponType.FIXED_AMOUNT]),
        value: z.number().positive(),
        minPurchase: z.number().positive().optional(),
        maxDiscount: z.number().positive().optional(),
        startDate: z.string().transform(str => new Date(str)),
        endDate: z.string().transform(str => new Date(str)),
        usageLimit: z.number().int().positive().optional()
    }).refine(data => {
        if (data.type === CouponType.PERCENTAGE && data.value > 100) {
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

const updateCoupon = z.object({
    body: z.object({
        code: z.string().min(3).max(20).optional(),
        type: z.enum([CouponType.PERCENTAGE, CouponType.FIXED_AMOUNT]).optional(),
        value: z.number().positive().optional(),
        minPurchase: z.number().positive().optional(),
        maxDiscount: z.number().positive().optional(),
        startDate: z.string().transform(str => new Date(str)).optional(),
        endDate: z.string().transform(str => new Date(str)).optional(),
        usageLimit: z.number().int().positive().optional()
    }).refine(data => {
        if (data.type === CouponType.PERCENTAGE && data.value && data.value > 100) {
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

const validateCoupon = z.object({
    body: z.object({
        code: z.string(),
        totalAmount: z.number().positive()
    })
});

export const CouponValidation = {
    createCoupon,
    updateCoupon,
    validateCoupon
}; 