import { CouponStatus, CouponType, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { IPaginationOptions } from '../../interface/pagination.type';
import { paginationHelper } from '../../helper/paginationHelper';
import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import { ICouponCreate, ICouponUpdate } from './coupon.interface';



const createCoupon = async (data: ICouponCreate) => {
    // Check if coupon code already exists
    const existingCoupon = await prisma.coupon.findUnique({
        where: { code: data.code }
    });

    if (existingCoupon) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Coupon code already exists');
    }

    // Validate dates
    if (data.startDate >= data.endDate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Start date must be before end date');
    }

    // Validate value based on type
    if (data.type === CouponType.PERCENTAGE && data.value > 100) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Percentage discount cannot exceed 100%');
    }

    const coupon = await prisma.coupon.create({
        data: {
            ...data,
            status: CouponStatus.ACTIVE
        }
    });

    return coupon;
};

const getAllCoupons = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andCondition: Prisma.CouponWhereInput[] = [];

    if (searchTerm) {
        andCondition.push({
            OR: [
                { code: { contains: searchTerm, mode: 'insensitive' } }
            ]
        });
    }

    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        });
    }

    const whereConditions: Prisma.CouponWhereInput = andCondition.length > 0 ? { AND: andCondition } : {};

    const result = await prisma.coupon.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.coupon.count({
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

const getCouponById = async (id: string) => {
    const coupon = await prisma.coupon.findUnique({
        where: { id }
    });

    if (!coupon) {
        throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
    }

    return coupon;
};

const updateCoupon = async (id: string, data: ICouponUpdate) => {
    const coupon = await prisma.coupon.findUnique({
        where: { id }
    });

    if (!coupon) {
        throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
    }

    // If code is being updated, check for uniqueness
    if (data.code && data.code !== coupon.code) {
        const existingCoupon = await prisma.coupon.findUnique({
            where: { code: data.code }
        });

        if (existingCoupon) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Coupon code already exists');
        }
    }

    // Validate dates if both are provided
    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Start date must be before end date');
    }

    // Validate value based on type
    if (data.type === CouponType.PERCENTAGE && data.value && data.value > 100) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Percentage discount cannot exceed 100%');
    }

    const updatedCoupon = await prisma.coupon.update({
        where: { id },
        data
    });

    return updatedCoupon;
};

const deleteCoupon = async (id: string) => {
    const coupon = await prisma.coupon.findUnique({
        where: { id }
    });

    if (!coupon) {
        throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
    }

    await prisma.coupon.delete({
        where: { id }
    });

    return null;
};

const validateAndApplyCoupon = async (code: string, totalAmount: number) => {
    const coupon = await prisma.coupon.findUnique({
        where: { code },
        include: {
            orders: {
                select: {
                    id: true
                }
            }
        }
    });

    if (!coupon) {
        throw new AppError(httpStatus.NOT_FOUND, 'Invalid coupon code');
    }

    // Check if coupon is active
    if (coupon.status !== CouponStatus.ACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Coupon is not active');
    }

    // Check if coupon has expired
    if (new Date() > coupon.endDate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Coupon has expired');
    }

    // Check if coupon has reached usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Coupon usage limit reached');
    }

    // Check minimum purchase amount
    if (coupon.minPurchase && totalAmount < coupon.minPurchase) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Minimum purchase amount of ${coupon.minPurchase} required`
        );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === CouponType.PERCENTAGE) {
        discount = (totalAmount * coupon.value) / 100;
        if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount);
        }
    } else {
        discount = Math.min(coupon.value, totalAmount);
    }

    return {
        coupon,
        discount
    };
};

const verifyCoupon = async (code: string) => {
    const coupon = await prisma.coupon.findUnique({
        where: { code }
    });

    if (!coupon) {
        throw new AppError(httpStatus.NOT_FOUND, 'Invalid coupon code');
    }

    // Check if coupon is active
    if (coupon.status !== CouponStatus.ACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Coupon is not active');
    }

    // Check if coupon has expired
    if (new Date() > coupon.endDate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Coupon has expired');
    }

    // Check if coupon has reached usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Coupon usage limit reached');
    }

    return {
        isValid: true,
        coupon: {
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            minPurchase: coupon.minPurchase,
            maxDiscount: coupon.maxDiscount,
            startDate: coupon.startDate,
            endDate: coupon.endDate,
            usageLimit: coupon.usageLimit,
            usedCount: coupon.usedCount
        }
    };
};

export const CouponService = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    validateAndApplyCoupon,
    verifyCoupon
}; 