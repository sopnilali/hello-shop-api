
import status from "http-status";
import AppError from "../../errors/AppError";
import { paginationHelper } from "../../helper/paginationHelper";
import { IOptions } from "../../interface/options.type";
import prisma from "../../utils/prisma";
import { IProduct } from "./product.interface";

const createProduct = async (req: any) => {
    req.body.sellerId = req.user.id;
    const result = await prisma.product.create({
        data: req.body as IProduct
    });
    return result;
};

const getAllProducts = async (options: IOptions = {}) => {
    // Convert query parameters to appropriate types
    const processedOptions = {
        ...options,
        page: options.page ? Number(options.page) : undefined,
        limit: options.limit ? Number(options.limit) : undefined,
        minPrice: options.minPrice ? Number(options.minPrice) : undefined,
        maxPrice: options.maxPrice ? Number(options.maxPrice) : undefined,
        brandId: options.brandId ? String(options.brandId) : undefined
    };

    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(processedOptions);

    // Extract filter conditions
    const { searchTerm, minPrice, maxPrice, categoryId, brandId } = processedOptions;

    // Build where conditions
    const whereConditions: any = {};

    if (searchTerm) {
        whereConditions.OR = [
            {
                name: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            },
            {
                brand: {
                    name: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                }
            },
            {
                category: {
                    name: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                }
            }
        ];
    }

    if (minPrice !== undefined) {
        whereConditions.price = {
            ...whereConditions.price,
            gte: Number(minPrice)
        };
    }

    if (maxPrice !== undefined) {
        whereConditions.price = {
            ...whereConditions.price,
            lte: Number(maxPrice)
        };
    }

    if (categoryId) {
        whereConditions.categoryId = categoryId;
    }

    if (brandId) {
        whereConditions.brandId = brandId;
    }

    let orderBy: any = { createdAt: "desc" }; // default

    if (sortBy) {
        const sortOrderValue = sortOrder?.toLowerCase() === "asc" ? "asc" : "desc";

        switch (sortBy) {
            case "rating":
                // Sort by average rating from reviews
                const products = await prisma.product.findMany({
                    where: whereConditions,
                    include: {
                        category: true,
                        brand: true,
                        seller: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phoneNumber: true,
                                address: true
                            }
                        },
                        reviews: {
                            select: {
                                rating: true
                            }
                        }
                    }
                });

                const productsWithAvgRating = products.map((product) => {
                    const reviews = product.reviews as { rating: number }[];
                    const average = reviews.length > 0
                        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
                        : 0;
                    
                    return {
                        ...product,
                        averageRating: parseFloat(average.toFixed(1)),
                        totalReviews: reviews.length
                    };
                });

                productsWithAvgRating.sort((a, b) =>
                    sortOrderValue === "asc"
                        ? a.averageRating - b.averageRating
                        : b.averageRating - a.averageRating
                );

                return {
                    meta: {
                        page,
                        limit,
                        total: products.length
                    },
                    data: productsWithAvgRating.slice(skip, skip + limit)
                };

            case "reviews":
                // Sort by number of reviews
                const productsWithReviewCount = await prisma.product.findMany({
                    where: whereConditions,
                    include: {
                        category: true,
                        brand: true,
                        seller: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phoneNumber: true,
                                address: true
                            }
                        },
                        reviews: {
                            select: {
                                rating: true
                            }
                        }
                    },
                    orderBy: {
                        reviews: {
                            _count: sortOrderValue
                        }
                    },
                    skip,
                    take: limit
                });

                const total = await prisma.product.count({
                    where: whereConditions
                });

                const productsWithReviewCountAndRating = productsWithReviewCount.map((product) => {
                    const reviews = product.reviews as { rating: number }[];
                    const averageRating = reviews.length > 0
                        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
                        : 0;
                    
                    return {
                        ...product,
                        averageRating: Number(averageRating.toFixed(1)),
                        totalReviews: reviews.length
                    };
                });

                return {
                    meta: {
                        page,
                        limit,
                        total
                    },
                    data: productsWithReviewCountAndRating
                };

            case "latest":
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - 7);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);

                whereConditions.createdAt = {
                    gte: startDate,
                    lte: endDate
                };

                orderBy = { createdAt: sortOrderValue };
                break;

            case "name":
                orderBy = { name: sortOrderValue };
                break;

            case "price":
                orderBy = { price: sortOrderValue };
                break;
        }
    }

    // Default query for other cases
    const result = await prisma.product.findMany({
        where: whereConditions,
        include: {
            category: true,
            brand: true,
            seller: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                    address: true
                }
            },
            reviews: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phoneNumber: true,
                            address: true,
                            profilePhoto: true
                        }
                    }
                }
            }
        },
        skip,
        take: limit,
        orderBy
    });

    const total = await prisma.product.count({
        where: whereConditions
    });

    const productsWithAvgRating = result.map((product) => {
        const reviews = product.reviews as { rating: number }[];
        return {
            ...product,
            averageRating: reviews.length > 0
                ? parseFloat((reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1))
                : 0,
            totalReviews: reviews.length
        };
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: productsWithAvgRating
    };
};

const getSingleProduct = async (id: string) => {

    // Fetch full product data including relations
    const result = await prisma.product.findUnique({
        where: {
            id
        },
        include: {
            category: true,
            brand: true,
            reviews: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profilePhoto: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    },
                    _count: {
                        select: { like: true }
                    }
                }
            },
            seller: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                    address: true
                }
            }
        }
    });

    if (!result) {
        throw new AppError(status.NOT_FOUND, "Product Not Found")
    }


    const averateRating = result.reviews.length > 0 ? parseFloat( (result.reviews.reduce((acc, r)=> acc + r.rating, 0) / result.reviews.length).toFixed(1)): 0
    
    const totalReviews = result.reviews.length;

     // Final return object
     return {
        ...result,
        averateRating,
        totalReviews
     }

};

const updateProduct = async (req: any) => {
    const result = await prisma.product.update({
        where: {
            id: req.params.id
        },
        data: req.body as IProduct
    });
    return result;
};

const deleteProduct = async (id: string) => {
    const result = await prisma.$transaction(async (tx) => {
        // First delete all order items for this product
        await tx.orderItem.deleteMany({
            where: {
                productId: id
            }
        });

        // Then delete the product
        return await tx.product.delete({
            where: {
                id
            }
        });
    });

    return result;
};

const updateProductStatus = async (id: string, status: 'AVAILABLE' | 'SOLD') => {
    const result = await prisma.product.update({
        where: {
            id
        },
        data: {
            status
        }
    });
    return result;
};

export const ProductService = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus
};
