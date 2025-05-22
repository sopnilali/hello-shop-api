import { z } from 'zod';

const validatePayment = z.object({
    body: z.object({
        tran_id: z.string(),
        status: z.string(),
        val_id: z.string(),
        amount: z.string(),
        store_amount: z.string(),
        currency: z.string(),
        bank_tran_id: z.string().optional(),
        card_type: z.string().optional(),
        card_no: z.string().optional(),
        card_issuer: z.string().optional(),
        card_brand: z.string().optional(),
        card_issuer_country: z.string().optional(),
        card_issuer_country_code: z.string().optional(),
        currency_type: z.string().optional(),
        currency_amount: z.string().optional(),
        currency_rate: z.string().optional(),
        base_fair: z.string().optional(),
        value_a: z.string().optional(),
        value_b: z.string().optional(),
        value_c: z.string().optional(),
        value_d: z.string().optional(),
        risk_title: z.string().optional(),
        risk_level: z.string().optional(),
        APIConnect: z.string().optional(),
        validated_on: z.string().optional(),
        gw_version: z.string().optional()
    })
});

export const PaymentValidation = {
    validatePayment
}; 