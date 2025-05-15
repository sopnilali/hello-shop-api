import { Reviews, ReviewStatus, UserStatus } from "@prisma/client";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import status from "http-status";

const addReviews = async (payload: Reviews, user: any) => {
    const isUserExist = await prisma.user.findUnique({
        where: { id: user.id },
    });

    const isUserBlockedOrDeleted =
        isUserExist?.status === UserStatus.BLOCKED

    if (!isUserExist || isUserBlockedOrDeleted) {
        throw new AppError(
            status.NOT_FOUND,
            "User not found or blocked"
        );
    }

    const result = await prisma.reviews.create({
        data: {
            ...payload,
            userId: user.id
        },
    });

    return result;
};

const getAllReviews = async () => {
    const result = await prisma.reviews.findMany({
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
};

const getAllReviewByProductId = async (productId: string) => {
    const result = await prisma.reviews.findMany({
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
};

const updateReview = async (id: string, payload: Reviews) => {

    const checkReview = await prisma.reviews.findUnique({
        where: { id, status: ReviewStatus.PUBLISHED }
    })
    if (checkReview) {
        throw new AppError(status.BAD_REQUEST, "Review already published")
    }

    const result = await prisma.reviews.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
};

const deleteReview = async (id: string) => {
    const result = await prisma.$transaction(async (tx) => {
        // First delete all comments associated with this review
        await tx.comment.deleteMany({
            where: {
                reviewId: id
            }
        });

        // Then delete all likes associated with this review
        await tx.like.deleteMany({
            where: {
                reviewId: id
            }
        });

        // Finally delete the review
        const deletedReview = await tx.reviews.delete({
            where: {
                id,
            },
        });

        return deletedReview;
    });
    return result;
};

const getReviewStats = async () => {
    const stats = await prisma.reviews.groupBy({
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
    const statsWithProduct = await Promise.all(
        stats.map(async (stat) => {
            const product = await prisma.product.findUnique({
                where: { id: stat.productId },
                select: {
                    name: true,
                }
            });

            return {
                productId: stat.productId,
                name: product?.name,
                averageRating: stat._avg,
                totalReviews: stat._count.rating
            };
        })
    );

    return statsWithProduct;
};




export const ReviewsService = {
    addReviews,
    getAllReviews,
    updateReview,
    deleteReview,
    getReviewStats,
    getAllReviewByProductId
};