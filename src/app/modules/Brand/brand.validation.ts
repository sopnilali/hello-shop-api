import { z } from "zod";


const createBrandValidation = z.object({
    name: z.string({required_error: "Name is required"}),
    description: z.string({required_error: "Description is required"}),
    image: z.string({required_error: "Image is required"}).optional(),
});

const updateBrandValidation = z.object({
    name: z.string({required_error: "Name is required"}).optional(),
    description: z.string({required_error: "Description is required"}).optional(),
    image: z.string({required_error: "Image is required"}).optional(),
    status: z.string({required_error: "Status is required"}).optional(),
});

export const BrandValidation = {
    createBrandValidation,
    updateBrandValidation,
}
