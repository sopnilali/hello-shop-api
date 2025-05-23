import express from "express";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import { ReviewValidations } from "./reviews.validation";
import validateRequest from "../../middleware/validateRequest";
import { ReviewsController } from "./reviews.controller";


const router = express.Router();

router.post(
  "/create-review",
  auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
  validateRequest(ReviewValidations.addReviewValidationSchema),
  ReviewsController.addReviews
);

router.get("/", auth(UserRole.ADMIN, UserRole.SELLER), ReviewsController.getAllReviews);
router.get("/:productId", auth(UserRole.SELLER, UserRole.CUSTOMER, UserRole.ADMIN), ReviewsController.getAllReviewsById);
// router.get("/:id", ReviewsController.getSingleReviews);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SELLER, UserRole.CUSTOMER),
  validateRequest(ReviewValidations.updateReviewValidationSchema),
  ReviewsController.updateReview
);
router.delete("/:id", auth(UserRole.ADMIN, UserRole.SELLER), ReviewsController.deleteReview);
router.get('/stats', auth(UserRole.ADMIN, UserRole.SELLER), ReviewsController.getReviewStats);

export const ReviewsRoutes = router;