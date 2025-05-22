import { z } from 'zod';

const createShop = z.object({
    name: z.string().min(3).max(100),
    description: z.string().min(10).max(500),
    logo: z.string().url().optional()
});

const updateShop = z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().min(10).max(500).optional(),
    logo: z.string().url().optional()
})

export const ShopValidation = {
    createShop,
    updateShop
}; 