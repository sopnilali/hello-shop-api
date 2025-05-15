
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
        brandId: options.brandId ? String(options.brandId) : undefined // Ensure brandId is a string
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
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.product.count({
        where: whereConditions
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
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
