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
    const processedOptions = Object.assign(Object.assign({}, options), { page: options.page ? Number(options.page) : undefined, limit: options.limit ? Number(options.limit) : undefined, minPrice: options.minPrice ? Number(options.minPrice) : undefined, maxPrice: options.maxPrice ? Number(options.maxPrice) : undefined, brandId: options.brandId ? String(options.brandId) : undefined // Ensure brandId is a string
     });
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
            }
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });
    const total = yield prisma_1.default.product.count({
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
const getSingleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUnique({
        where: {
            id
        },
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
            }
        }
    });
    return result;
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
