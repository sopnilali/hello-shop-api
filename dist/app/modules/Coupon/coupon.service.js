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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../helper/paginationHelper");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createCoupon = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if coupon code already exists
    const existingCoupon = yield prisma_1.default.coupon.findUnique({
        where: { code: data.code }
    });
    if (existingCoupon) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon code already exists');
    }
    // Validate dates
    if (data.startDate >= data.endDate) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Start date must be before end date');
    }
    // Validate value based on type
    if (data.type === client_1.CouponType.PERCENTAGE && data.value > 100) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Percentage discount cannot exceed 100%');
    }
    const coupon = yield prisma_1.default.coupon.create({
        data: Object.assign(Object.assign({}, data), { status: client_1.CouponStatus.ACTIVE })
    });
    return coupon;
});
const getAllCoupons = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [];
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
                    equals: filterData[key]
                }
            }))
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.coupon.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });
    const total = yield prisma_1.default.coupon.count({
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
});
const getCouponById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findUnique({
        where: { id }
    });
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Coupon not found');
    }
    return coupon;
});
const updateCoupon = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findUnique({
        where: { id }
    });
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Coupon not found');
    }
    // If code is being updated, check for uniqueness
    if (data.code && data.code !== coupon.code) {
        const existingCoupon = yield prisma_1.default.coupon.findUnique({
            where: { code: data.code }
        });
        if (existingCoupon) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon code already exists');
        }
    }
    // Validate dates if both are provided
    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Start date must be before end date');
    }
    // Validate value based on type
    if (data.type === client_1.CouponType.PERCENTAGE && data.value && data.value > 100) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Percentage discount cannot exceed 100%');
    }
    const updatedCoupon = yield prisma_1.default.coupon.update({
        where: { id },
        data
    });
    return updatedCoupon;
});
const deleteCoupon = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findUnique({
        where: { id }
    });
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Coupon not found');
    }
    yield prisma_1.default.coupon.delete({
        where: { id }
    });
    return null;
});
const validateAndApplyCoupon = (code, totalAmount) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findUnique({
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
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Invalid coupon code');
    }
    // Check if coupon is active
    if (coupon.status !== client_1.CouponStatus.ACTIVE) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon is not active');
    }
    // Check if coupon has expired
    if (new Date() > coupon.endDate) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon has expired');
    }
    // Check if coupon has reached usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon usage limit reached');
    }
    // Check minimum purchase amount
    if (coupon.minPurchase && totalAmount < coupon.minPurchase) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Minimum purchase amount of ${coupon.minPurchase} required`);
    }
    // Calculate discount
    let discount = 0;
    if (coupon.type === client_1.CouponType.PERCENTAGE) {
        discount = (totalAmount * coupon.value) / 100;
        if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount);
        }
    }
    else {
        discount = Math.min(coupon.value, totalAmount);
    }
    return {
        coupon,
        discount
    };
});
const verifyCoupon = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findUnique({
        where: { code }
    });
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Invalid coupon code');
    }
    // Check if coupon is active
    if (coupon.status !== client_1.CouponStatus.ACTIVE) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon is not active');
    }
    // Check if coupon has expired
    if (new Date() > coupon.endDate) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon has expired');
    }
    // Check if coupon has reached usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon usage limit reached');
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
});
exports.CouponService = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    validateAndApplyCoupon,
    verifyCoupon
};
