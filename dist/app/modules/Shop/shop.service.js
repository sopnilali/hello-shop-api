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
exports.ShopService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../helper/paginationHelper");
const fileUploader_1 = require("../../helper/fileUploader");
const createShop = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Logo is required');
    }
    const uploadResult = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
    req.body.logo = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    const shop = yield prisma_1.default.shop.create({
        data: Object.assign(Object.assign({}, req.body), { ownerId: req.user.id }),
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    return shop;
});
const getAllShops = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params;
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } }
            ]
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.shop.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            _count: {
                select: {
                    products: true
                }
            }
        }
    });
    const total = yield prisma_1.default.shop.count({
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
const getShopById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.findUnique({
        where: { id },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            products: {
                include: {
                    category: true,
                    brand: true
                }
            }
        }
    });
    if (!shop) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Shop not found');
    }
    return shop;
});
const updateShop = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadResult = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.logo = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    const shop = yield prisma_1.default.shop.findUnique({
        where: { id }
    });
    if (!shop) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Shop not found');
    }
    const updatedShop = yield prisma_1.default.shop.update({
        where: { id },
        data: req.body,
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    return updatedShop;
});
const deleteShop = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.findUnique({
        where: { id }
    });
    if (!shop) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Shop not found');
    }
    yield prisma_1.default.shop.delete({
        where: { id }
    });
    return null;
});
const getShopsByOwner = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const shops = yield prisma_1.default.shop.findMany({
        where: { ownerId },
        include: {
            _count: {
                select: {
                    products: true
                }
            }
        }
    });
    return shops;
});
exports.ShopService = {
    createShop,
    getAllShops,
    getShopById,
    updateShop,
    deleteShop,
    getShopsByOwner
};
