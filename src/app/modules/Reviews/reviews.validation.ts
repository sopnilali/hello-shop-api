import { z } from "zod";

const addReviewValidationSchema = z.object({
  body: z.object({
    reviewText: z.string({
      required_error: "Review text is required",
    }),
    rating: z.number({
      required_error: "Rating is required",
    }),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z.object({
    reviewText: z
      .string({
        required_error: "Review text is required",
      })
      .optional(),
    rating: z
      .number({
        required_error: "Rating is required",
      })
      .optional(),
    status: z
      .string({
        required_error: "Status is required",
      })
      .optional(),
  }),
});

export const ReviewValidations = {
  addReviewValidationSchema,
  updateReviewValidationSchema,
};