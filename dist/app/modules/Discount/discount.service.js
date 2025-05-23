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
exports.DiscountService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../helper/paginationHelper");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createDiscount = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if product exists
    const product = yield prisma_1.default.product.findUnique({
        where: { id: payload.productId },
    });
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    // Check if product already has an active discount
    const existingDiscount = yield prisma_1.default.discount.findUnique({
        where: { productId: payload.productId },
    });
    if (existingDiscount) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Product already has a discount");
    }
    // Validate value based on type
    if (payload.type === client_1.DiscountType.PERCENTAGE && payload.value > 100) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Percentage discount cannot exceed 100%");
    }
    // Validate dates
    if (payload.startDate >= payload.endDate) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Start date must be before end date");
    }
    const result = yield prisma_1.default.discount.create({
        data: {
            type: payload.type,
            value: payload.value,
            startDate: payload.startDate,
            endDate: payload.endDate,
            status: client_1.DiscountStatus.ACTIVE,
            productId: payload.productId
        }
    });
    return result;
});
const getAllDiscounts = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const discounts = yield prisma_1.default.discount.findMany({
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
            product: true
        }
    });
    const total = yield prisma_1.default.discount.count();
    return {
        meta: {
            page,
            limit,
            total
        },
        data: discounts
    };
});
const getDiscountById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const discount = yield prisma_1.default.discount.findUnique({
        where: { id },
        include: {
            product: true
        }
    });
    if (!discount) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Discount not found');
    }
    return discount;
});
const updateDiscount = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const discount = yield prisma_1.default.discount.findUnique({
        where: { id }
    });
    if (!discount) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Discount not found');
    }
    // Validate dates if both are provided
    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Start date must be before end date');
    }
    // Validate value based on type
    if (data.type === client_1.DiscountType.PERCENTAGE && data.value && data.value > 100) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Percentage discount cannot exceed 100%');
    }
    const updatedDiscount = yield prisma_1.default.discount.update({
        where: { id },
        data,
        include: {
            product: true
        }
    });
    return updatedDiscount;
});
const deleteDiscount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const discount = yield prisma_1.default.discount.findUnique({
        where: { id }
    });
    if (!discount) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Discount not found');
    }
    yield prisma_1.default.discount.delete({
        where: { id }
    });
    return null;
});
const getActiveDiscounts = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const result = yield prisma_1.default.discount.findMany({
        where: {
            status: client_1.DiscountStatus.ACTIVE,
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
});
exports.DiscountService = {
    createDiscount,
    getAllDiscounts,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
    getActiveDiscounts
};
