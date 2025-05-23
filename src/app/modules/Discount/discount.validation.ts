import { z } from 'zod';

const createDiscount = z.object({
    body: z.object({
        type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
        value: z.number().positive().max(100),
        startDate: z.string().transform(str => new Date(str)),
        endDate: z.string().transform(str => new Date(str)),
        status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']).optional()
    })
});

const updateDiscount = z.object({
    body: z.object({
        type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']).optional(),
        value: z.number().positive().max(100).optional(),
        startDate: z.string().transform(str => new Date(str)).optional(),
        endDate: z.string().transform(str => new Date(str)).optional(),
        status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']).optional()
    })
});

export const DiscountValidation = {
    createDiscount,
    updateDiscount
}; 