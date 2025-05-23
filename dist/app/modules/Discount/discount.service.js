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
const createDiscount = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate dates
    if (data.startDate >= data.endDate) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Start date must be before end date');
    }
    // Validate value based on type
    if (data.type === client_1.DiscountType.PERCENTAGE && data.value > 100) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Percentage discount cannot exceed 100%');
    }
    const discount = yield prisma_1.default.discount.create({
        data: Object.assign(Object.assign({}, data), { status: data.status || client_1.DiscountStatus.ACTIVE })
    });
    return discount;
});
const getAllDiscounts = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const discounts = yield prisma_1.default.discount.findMany({
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
            products: true
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
            products: true
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
            products: true
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
const applyDiscountToProduct = (discountId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const [discount, product] = yield Promise.all([
        prisma_1.default.discount.findUnique({ where: { id: discountId } }),
        prisma_1.default.product.findUnique({ where: { id: productId } })
    ]);
    if (!discount) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Discount not found');
    }
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    // Check if discount is active and valid
    if (discount.status !== client_1.DiscountStatus.ACTIVE) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Discount is not active');
    }
    if (new Date() > discount.endDate) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Discount has expired');
    }
    const updatedProduct = yield prisma_1.default.product.update({
        where: { id: productId },
        data: {
            discountId
        },
        include: {
            discount: true
        }
    });
    return updatedProduct;
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
            products: true
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
    applyDiscountToProduct,
    getActiveDiscounts
};
