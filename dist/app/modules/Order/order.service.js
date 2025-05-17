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
exports.OrderService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const emailService_1 = require("../../utils/emailService");
const paginationHelper_1 = require("../../helper/paginationHelper");
const order_constant_1 = require("./order.constant");
const createOrder = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate required fields
    if (!data.address || !data.city || !data.phoneNumber || !data.paymentMethod || !data.items || !data.total) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'All fields are required');
    }
    // Get all products in a single query
    const products = yield prisma_1.default.product.findMany({
        where: {
            id: { in: data.items.map(item => item.productId) }
        },
        select: {
            id: true,
            name: true,
            price: true,
            quantity: true
        }
    });
    // Check if all products exist
    if (products.length !== data.items.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'One or more products not found');
    }
    // Check if all products have sufficient quantity
    for (const item of data.items) {
        const product = products.find(p => p.id === item.productId);
        if (!product)
            continue;
        if (product.quantity < item.quantity) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Insufficient quantity for product: ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`);
        }
    }
    // Create order with items in a transaction
    const order = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Create the order
        const newOrder = yield tx.order.create({
            data: {
                userId: user.id,
                name: user.name,
                email: user.email,
                address: data.address,
                city: data.city,
                phoneNumber: data.phoneNumber,
                paymentMethod: data.paymentMethod,
                total: data.total,
                transactionId: data.transactionId,
                status: client_1.OrderStatus.PENDING,
                items: {
                    create: data.items.map(item => {
                        const product = products.find(p => p.id === item.productId);
                        return {
                            productId: item.productId,
                            quantity: item.quantity,
                            price: product.price
                        };
                    })
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        // Update product quantities and status
        for (const item of data.items) {
            const product = products.find(p => p.id === item.productId);
            const newQuantity = product.quantity - item.quantity;
            yield tx.product.update({
                where: { id: item.productId },
                data: {
                    quantity: newQuantity,
                    status: newQuantity === 0 ? 'SOLD' : 'AVAILABLE'
                }
            });
        }
        return newOrder;
    }));
    // Send order confirmation email
    try {
        yield (0, emailService_1.sendOrderConfirmationEmail)(user.email, order);
    }
    catch (error) {
        console.error('Failed to send order confirmation email:', error);
        // Don't throw error here as the order was created successfully
    }
    return order;
});
const getAllOrders = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [];
    if (params.searchTerm) {
        andCondition.push({
            OR: order_constant_1.orderSearchAbleFields.map(filed => ({
                [filed]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
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
    const whereConditons = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.order.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            name: true,
            email: true,
            paymentMethod: true,
            total: true,
            transactionId: true,
            phoneNumber: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
    const total = yield prisma_1.default.order.count({
        where: whereConditons,
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
const getOrderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma_1.default.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true
                }
            },
            user: true
        }
    });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    return order;
});
const updateOrderStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma_1.default.order.update({
        where: { id },
        data: { status },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });
    return order;
});
const getOrdersByUserId = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.default.order.findMany({
        where: { userId: user.id },
        include: {
            items: {
                include: {
                    product: true
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return orders;
});
exports.OrderService = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getOrdersByUserId
};
