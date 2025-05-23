import { DiscountStatus, DiscountType, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { IPaginationOptions } from '../../interface/pagination.type';
import { paginationHelper } from '../../helper/paginationHelper';
import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import { IDiscountCreate, IDiscountUpdate } from './discount.interface';

const createDiscount = async (payload: {
    type: DiscountType;
    value: number;
    productId: string;
    startDate: Date;
    endDate: Date;
  }) => {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: payload.productId },
    });
  
    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }
  
    // Check if product already has an active discount
    const existingDiscount = await prisma.discount.findUnique({
      where: { productId: payload.productId },
    });
  
    if (existingDiscount) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Product already has a discount"
      );
    }
  
    // Validate value based on type
    if (payload.type === DiscountType.PERCENTAGE && payload.value > 100) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Percentage discount cannot exceed 100%"
      );
    }
  
    // Validate dates
    if (payload.startDate >= payload.endDate) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Start date must be before end date"
      );
    }
  
    const result = await prisma.discount.create({
      data: {
        type: payload.type,
        value: payload.value,
        startDate: payload.startDate,
        endDate: payload.endDate,
        status: DiscountStatus.ACTIVE,
        productId: payload.productId
      }
    });
  
    return result;
  };

const getAllDiscounts = async (options: IPaginationOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const discounts = await prisma.discount.findMany({
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
            product: true
        }
    });

    const total = await prisma.discount.count();

    return {
        meta: {
            page,
            limit,
            total
        },
        data: discounts
    };
};

const getDiscountById = async (id: string) => {
    const discount = await prisma.discount.findUnique({
        where: { id },
        include: {
            product: true
        }
    });

    if (!discount) {
        throw new AppError(httpStatus.NOT_FOUND, 'Discount not found');
    }

    return discount;
};

const updateDiscount = async (id: string, data: IDiscountUpdate) => {
    const discount = await prisma.discount.findUnique({
        where: { id }
    });

    if (!discount) {
        throw new AppError(httpStatus.NOT_FOUND, 'Discount not found');
    }

    // Validate dates if both are provided
    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Start date must be before end date');
    }

    // Validate value based on type
    if (data.type === DiscountType.PERCENTAGE && data.value && data.value > 100) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Percentage discount cannot exceed 100%');
    }

    const updatedDiscount = await prisma.discount.update({
        where: { id },
        data,
        include: {
            product: true
        }
    });

    return updatedDiscount;
};

const deleteDiscount = async (id: string) => {
    const discount = await prisma.discount.findUnique({
        where: { id }
    });

    if (!discount) {
        throw new AppError(httpStatus.NOT_FOUND, 'Discount not found');
    }

    await prisma.discount.delete({
        where: { id }
    });

    return null;
};

const getActiveDiscounts = async () => {
    const now = new Date();
    const result = await prisma.discount.findMany({
        where: {
            status: DiscountStatus.ACTIVE,
            startDate: {
                lte: now
            },
            endDate: {
                gte: now
            }
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    quantity: true,
                    images: true,
                    status: true,
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    brand: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    discount: {
                        select: {
                            value: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return result;
};

export const DiscountService = {
    createDiscount,
    getAllDiscounts,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
    getActiveDiscounts
}; 