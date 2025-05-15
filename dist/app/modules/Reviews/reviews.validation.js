"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidations = void 0;
const zod_1 = require("zod");
const addReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        reviewText: zod_1.z.string({
            required_error: "Review text is required",
        }),
        rating: zod_1.z.number({
            required_error: "Rating is required",
        }),
    }),
});
const updateReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        reviewText: zod_1.z
            .string({
            required_error: "Review text is required",
        })
            .optional(),
        rating: zod_1.z
            .number({
            required_error: "Rating is required",
        })
            .optional(),
        status: zod_1.z
            .string({
            required_error: "Status is required",
        })
            .optional(),
    }),
});
exports.ReviewValidations = {
    addReviewValidationSchema,
    updateReviewValidationSchema,
};
