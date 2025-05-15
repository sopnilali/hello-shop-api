"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const addReviews = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { id: user.id },
    });
    const isUserBlockedOrDeleted = (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.status) === client_1.UserStatus.BLOCKED;
    if (!isUserExist || isUserBlockedOrDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found or blocked");
    }
    const result = yield prisma_1.default.reviews.create({
        data: Object.assign(Object.assign({}, payload), { userId: user.id }),
    });
    return result;
});
const getAllReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.reviews.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                    address: true
                }
            },
            product: true,
            comment: true,
            like: true,
        },
        orderBy: { createdAt: 'desc' },
    });
    return result;
});
const getAllReviewByProductId = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.reviews.findMany({
        where: { productId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                    address: true,
                    profilePhoto: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            comment: true,
            like: true,
        },
        orderBy: { createdAt: 'desc' },
    });
    return result;
});
const updateReview = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const checkReview = yield prisma_1.default.reviews.findUnique({
        where: { id, status: client_1.ReviewStatus.PUBLISHED }
    });
    if (checkReview) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Review already published");
    }
    const result = yield prisma_1.default.reviews.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // First delete all comments associated with this review
        yield tx.comment.deleteMany({
            where: {
                reviewId: id
            }
        });
        // Then delete all likes associated with this review
        yield tx.like.deleteMany({
            where: {
                reviewId: id
            }
        });
        // Finally delete the review
        const deletedReview = yield tx.reviews.delete({
            where: {
                id,
            },
        });
        return deletedReview;
    }));
    return result;
});
const getReviewStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield prisma_1.default.reviews.groupBy({
        by: ['productId'],
        _avg: {
            rating: true
        },
        _count: {
            rating: true
        },
        orderBy: {
            _avg: {
                rating: 'desc'
            }
        }
    });
    console.log(stats);
    // Get content details for each stat
    const statsWithProduct = yield Promise.all(stats.map((stat) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield prisma_1.default.product.findUnique({
            where: { id: stat.productId },
            select: {
                name: true,
            }
        });
        return {
            productId: stat.productId,
            name: product === null || product === void 0 ? void 0 : product.name,
            averageRating: stat._avg,
            totalReviews: stat._count.rating
        };
    })));
    return statsWithProduct;
});
exports.ReviewsService = {
    addReviews,
    getAllReviews,
    updateReview,
    deleteReview,
    getReviewStats,
    getAllReviewByProductId
};
