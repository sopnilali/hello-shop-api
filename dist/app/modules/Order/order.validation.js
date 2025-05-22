"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const createOrder = zod_1.z.object({
    body: zod_1.z.object({
        address: zod_1.z.string(),
        city: zod_1.z.string(),
        phoneNumber: zod_1.z.string(),
        paymentMethod: zod_1.z.enum([
            client_1.PaymentMethod.BKASH,
            client_1.PaymentMethod.NAGAD,
            client_1.PaymentMethod.CASH_ON_DELIVERY,
            client_1.PaymentMethod.SSL_COMMERZ
        ]),
        transactionId: zod_1.z.string().optional(),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string(),
            quantity: zod_1.z.number().int().positive()
        })),
        total: zod_1.z.number().positive(),
        couponCode: zod_1.z.string().optional()
    })
});
const updateOrderStatus = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    })
});
exports.OrderValidation = {
    createOrder,
    updateOrderStatus
};
