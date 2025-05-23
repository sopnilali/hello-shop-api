import httpStatus from "http-status";
import { catchAsync } from "../../helper/catchAsync";
import { ReviewsService } from "./reviews.service";
import sendResponse from "../../helper/sendResponse";
import pick from "../../utils/pick";
import { paginationHelper } from "../../helper/paginationHelper";
import { reviewFilterableFields } from "./review.constant";

const addReviews = catchAsync(async (req, res) => {
  const result = await ReviewsService.addReviews(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Reviews added successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
  const result = await ReviewsService.getAllReviews(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAllReviewsById = catchAsync(async (req, res) => {
  const {productId} = req.params
  const result = await ReviewsService.getAllReviewByProductId(productId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
});
const updateReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ReviewsService.updateReview(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Review updated successfully",
    data: result,
  });
});
const deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ReviewsService.deleteReview(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully",
    // data: result
  });
});

const getReviewStats = catchAsync(async (req, res) => {
  const result = await ReviewsService.getReviewStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review statistics retrieved successfully",
    data: result
  });
});

export const ReviewsController = {
  addReviews,
  getAllReviews,
  updateReview,
  deleteReview,
  getReviewStats,
  getAllReviewsById
};