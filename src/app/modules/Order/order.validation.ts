import { z } from 'zod';
import { PaymentMethod } from '@prisma/client';

const createOrder = z.object({
    body: z.object({
        address: z.string(),
        city: z.string(),
        phoneNumber: z.string(),
        paymentMethod: z.enum([
            PaymentMethod.BKASH,
            PaymentMethod.NAGAD,
            PaymentMethod.CASH_ON_DELIVERY,
            PaymentMethod.SSL_COMMERZ
        ]),
        transactionId: z.string().optional(),
        items: z.array(z.object({
            productId: z.string(),
            quantity: z.number().int().positive()
        })),
        total: z.number().positive(),
        couponCode: z.string().optional()
    })
});

const updateOrderStatus = z.object({
    body: z.object({
        status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    })
});

export const OrderValidation = {
    createOrder,
    updateOrderStatus
}; 