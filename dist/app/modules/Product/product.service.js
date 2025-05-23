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
exports.ProductService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const paginationHelper_1 = require("../../helper/paginationHelper");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.sellerId = req.user.id;
    const result = yield prisma_1.default.product.create({
        data: req.body
    });
    return result;
});
const getAllProducts = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (options = {}) {
    // Convert query parameters to appropriate types
    const processedOptions = Object.assign(Object.assign({}, options), { page: options.page ? Number(options.page) : undefined, limit: options.limit ? Number(options.limit) : undefined, minPrice: options.minPrice ? Number(options.minPrice) : undefined, maxPrice: options.maxPrice ? Number(options.maxPrice) : undefined, brandId: options.brandId ? String(options.brandId) : undefined });
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(processedOptions);
    // Extract filter conditions
    const { searchTerm, minPrice, maxPrice, categoryId, brandId } = processedOptions;
    // Build where conditions
    const whereConditions = {};
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
        whereConditions.price = Object.assign(Object.assign({}, whereConditions.price), { gte: Number(minPrice) });
    }
    if (maxPrice !== undefined) {
        whereConditions.price = Object.assign(Object.assign({}, whereConditions.price), { lte: Number(maxPrice) });
    }
    if (categoryId) {
        whereConditions.categoryId = categoryId;
    }
    if (brandId) {
        whereConditions.brandId = brandId;
    }
    let orderBy = { createdAt: "desc" }; // default
    if (sortBy) {
        const sortOrderValue = (sortOrder === null || sortOrder === void 0 ? void 0 : sortOrder.toLowerCase()) === "asc" ? "asc" : "desc";
        switch (sortBy) {
            case "rating":
                // Sort by average rating from reviews
                const products = yield prisma_1.default.product.findMany({
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
                    const reviews = product.reviews;
                    const average = reviews.length > 0
                        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
                        : 0;
                    return Object.assign(Object.assign({}, product), { averageRating: parseFloat(average.toFixed(1)), totalReviews: reviews.length });
                });
                productsWithAvgRating.sort((a, b) => sortOrderValue === "asc"
                    ? a.averageRating - b.averageRating
                    : b.averageRating - a.averageRating);
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
                const productsWithReviewCount = yield prisma_1.default.product.findMany({
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
                const total = yield prisma_1.default.product.count({
                    where: whereConditions
                });
                const productsWithReviewCountAndRating = productsWithReviewCount.map((product) => {
                    const reviews = product.reviews;
                    const averageRating = reviews.length > 0
                        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
                        : 0;
                    return Object.assign(Object.assign({}, product), { averageRating: Number(averageRating.toFixed(1)), totalReviews: reviews.length });
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
    const result = yield prisma_1.default.product.findMany({
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
            shop: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phoneNumber: true,
                            address: true
                        }
                    }
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
            },
            orderItems: {
                select: {
                    quantity: true
                }
            },
            _count: {
                select: {
                    orderItems: true
                }
            }
        },
        skip,
        take: limit,
        orderBy
    });
    const total = yield prisma_1.default.product.count({
        where: whereConditions
    });
    const productsWithAvgRating = result.map((product) => {
        const reviews = product.reviews;
        return Object.assign(Object.assign({}, product), { averageRating: reviews.length > 0
                ? parseFloat((reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1))
                : 0, totalReviews: reviews.length });
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: productsWithAvgRating
    };
});
const getSingleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch full product data including relations
    const result = yield prisma_1.default.product.findUnique({
        where: {
            id
        },
        include: {
            category: true,
            brand: true,
            discount: true,
            shop: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    owner: {
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
            },
            seller: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                    profilePhoto: true,
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
            orderItems: {
                select: {
                    quantity: true
                }
            }
        }
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product Not Found");
    }
    const averateRating = result.reviews.length > 0 ? parseFloat((result.reviews.reduce((acc, r) => acc + r.rating, 0) / result.reviews.length).toFixed(1)) : 0;
    const totalReviews = result.reviews.length;
    // Final return object
    return Object.assign(Object.assign({}, result), { averateRating,
        totalReviews });
});
const updateProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.update({
        where: {
            id: req.params.id
        },
        data: req.body
    });
    return result;
});
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // First delete all order items for this product
        yield tx.orderItem.deleteMany({
            where: {
                productId: id
            }
        });
        // Then delete the product
        return yield tx.product.delete({
            where: {
                id
            }
        });
    }));
    return result;
});
const updateProductStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.update({
        where: {
            id
        },
        data: {
            status
        }
    });
    return result;
});
exports.ProductService = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus
};
