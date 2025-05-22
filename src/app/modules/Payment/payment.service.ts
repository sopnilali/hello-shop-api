import prisma from '../../utils/prisma';
import { OrderStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { SSLService } from '../SSL/ssl.service';

const handleSuccess = async (data: any) => {
    const { tran_id, status, val_id } = data;

    // Find order by transaction ID
    const order = await prisma.order.findFirst({
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
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PROCESSING },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    return updatedOrder;
};

const handleFail = async (data: any) => {
    const { tran_id } = data;

    // Find order by transaction ID
    const order = await prisma.order.findFirst({
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
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CANCELLED },
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
        await prisma.product.update({
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
};

const handleCancel = async (data: any) => {
    const { tran_id } = data;

    // Find order by transaction ID
    const order = await prisma.order.findFirst({
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
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CANCELLED },
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
        await prisma.product.update({
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
};

const handleIPN = async (data: any) => {
    const { tran_id, status } = data;

    // Find order by transaction ID
    const order = await prisma.order.findFirst({
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
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    }

    // Update order status based on payment status
    const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
            status: status === 'VALID' ? OrderStatus.PROCESSING : OrderStatus.CANCELLED
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
            await prisma.product.update({
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
};


const getVerifyPayment = async (user: any, payload: { tran_id?: string }) => {
    const result = await prisma.order.findFirst({
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
  };

export const PaymentService = {
    handleSuccess,
    handleFail,
    handleCancel,
    handleIPN,
    getVerifyPayment
}; 