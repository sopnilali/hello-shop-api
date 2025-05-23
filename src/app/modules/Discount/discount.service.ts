import { DiscountStatus, DiscountType, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { IPaginationOptions } from '../../interface/pagination.type';
import { paginationHelper } from '../../helper/paginationHelper';
import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import { IDiscountCreate, IDiscountUpdate } from './discount.interface';

const createDiscount = async (data: IDiscountCreate) => {
    // Validate dates
    if (data.startDate >= data.endDate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Start date must be before end date');
    }

    // Validate value based on type
    if (data.type === DiscountType.PERCENTAGE && data.value > 100) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Percentage discount cannot exceed 100%');
    }

    const discount = await prisma.discount.create({
        data: {
            ...data,
            status: data.status || DiscountStatus.ACTIVE
        }
    });

    return discount;
};

const getAllDiscounts = async (options: IPaginationOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const discounts = await prisma.discount.findMany({
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
            products: true
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
            products: true
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
            products: true
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

const applyDiscountToProduct = async (discountId: string, productId: string) => {
    const [discount, product] = await Promise.all([
        prisma.discount.findUnique({ where: { id: discountId } }),
        prisma.product.findUnique({ where: { id: productId } })
    ]);

    if (!discount) {
        throw new AppError(httpStatus.NOT_FOUND, 'Discount not found');
    }

    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    // Check if discount is active and valid
    if (discount.status !== DiscountStatus.ACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Discount is not active');
    }

    if (new Date() > discount.endDate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Discount has expired');
    }

    const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
            discountId
        },
        include: {
            discount: true
        }
    });

    return updatedProduct;
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
            products: true
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
    applyDiscountToProduct,
    getActiveDiscounts
}; 