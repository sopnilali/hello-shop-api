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
exports.PaymentService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const handleSuccess = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { tran_id, status, val_id } = data;
    // Find order by transaction ID
    const order = yield prisma_1.default.order.findFirst({
        where: { transactionId: tran_id },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    // Update order status
    const updatedOrder = yield prisma_1.default.order.update({
        where: { id: order.id },
        data: { status: client_1.OrderStatus.PROCESSING },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });
    return updatedOrder;
});
const handleFail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { tran_id } = data;
    // Find order by transaction ID
    const order = yield prisma_1.default.order.findFirst({
        where: { transactionId: tran_id },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    // Update order status
    const updatedOrder = yield prisma_1.default.order.update({
        where: { id: order.id },
        data: { status: client_1.OrderStatus.CANCELLED },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });
    // Restore product quantities
    for (const item of order.items) {
        yield prisma_1.default.product.update({
            where: { id: item.productId },
            data: {
                quantity: {
                    increment: item.quantity
                },
                status: 'AVAILABLE'
            }
        });
    }
    return updatedOrder;
});
const handleCancel = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { tran_id } = data;
    // Find order by transaction ID
    const order = yield prisma_1.default.order.findFirst({
        where: { transactionId: tran_id },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    // Update order status
    const updatedOrder = yield prisma_1.default.order.update({
        where: { id: order.id },
        data: { status: client_1.OrderStatus.CANCELLED },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });
    // Restore product quantities
    for (const item of order.items) {
        yield prisma_1.default.product.update({
            where: { id: item.productId },
            data: {
                quantity: {
                    increment: item.quantity
                },
                status: 'AVAILABLE'
            }
        });
    }
    return updatedOrder;
});
const handleIPN = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { tran_id, status } = data;
    // Find order by transaction ID
    const order = yield prisma_1.default.order.findFirst({
        where: { transactionId: tran_id },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    // Update order status based on payment status
    const updatedOrder = yield prisma_1.default.order.update({
        where: { id: order.id },
        data: {
            status: status === 'VALID' ? client_1.OrderStatus.PROCESSING : client_1.OrderStatus.CANCELLED
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });
    // If payment failed, restore product quantities
    if (status !== 'VALID') {
        for (const item of order.items) {
            yield prisma_1.default.product.update({
                where: { id: item.productId },
                data: {
                    quantity: {
                        increment: item.quantity
                    },
                    status: 'AVAILABLE'
                }
            });
        }
    }
    return updatedOrder;
});
const getVerifyPayment = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findFirst({
        where: {
            userId: user.id,
            transactionId: payload.tran_id
        },
        include: {
            user: true,
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            images: true,
                        }
                    }
                }
            },
        },
    });
    return result;
});
exports.PaymentService = {
    handleSuccess,
    handleFail,
    handleCancel,
    handleIPN,
    getVerifyPayment
};
