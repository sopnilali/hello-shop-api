"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
const zod_1 = require("zod");
const validatePayment = zod_1.z.object({
    body: zod_1.z.object({
        tran_id: zod_1.z.string(),
        status: zod_1.z.string(),
        val_id: zod_1.z.string(),
        amount: zod_1.z.string(),
        store_amount: zod_1.z.string(),
        currency: zod_1.z.string(),
        bank_tran_id: zod_1.z.string().optional(),
        card_type: zod_1.z.string().optional(),
        card_no: zod_1.z.string().optional(),
        card_issuer: zod_1.z.string().optional(),
        card_brand: zod_1.z.string().optional(),
        card_issuer_country: zod_1.z.string().optional(),
        card_issuer_country_code: zod_1.z.string().optional(),
        currency_type: zod_1.z.string().optional(),
        currency_amount: zod_1.z.string().optional(),
        currency_rate: zod_1.z.string().optional(),
        base_fair: zod_1.z.string().optional(),
        value_a: zod_1.z.string().optional(),
        value_b: zod_1.z.string().optional(),
        value_c: zod_1.z.string().optional(),
        value_d: zod_1.z.string().optional(),
        risk_title: zod_1.z.string().optional(),
        risk_level: zod_1.z.string().optional(),
        APIConnect: zod_1.z.string().optional(),
        validated_on: zod_1.z.string().optional(),
        gw_version: zod_1.z.string().optional()
    })
});
exports.PaymentValidation = {
    validatePayment
};
