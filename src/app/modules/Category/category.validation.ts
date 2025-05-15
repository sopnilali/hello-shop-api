import { z } from "zod";

const createCategoryValidation = z.object({
    name: z.string({required_error: "Name is required"}),
    description: z.string({required_error: "Description is required"})
});

const updateCategoryValidation = z.object({
    name: z.string({required_error: "Name is required"}).optional(),
    description: z.string({required_error: "Description is required"}).optional()
});

export const CategoryValidation = {
    createCategoryValidation,
    updateCategoryValidation
}
