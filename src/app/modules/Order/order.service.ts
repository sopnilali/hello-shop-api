import prisma from '../../utils/prisma';
import { IOrderCreate } from './order.interface';
import { OrderStatus, PaymentMethod, Prisma, Conditions } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { sendOrderConfirmationEmail } from '../../utils/emailService';
import { IUser } from '../User/user.interface';
import { paginationHelper } from '../../helper/paginationHelper';
import { IPaginationOptions } from '../../interface/pagination.type';
import { orderSearchAbleFields } from './order.constant';
import { CouponService } from '../Coupon/coupon.service';
import { SSLService } from '../SSL/ssl.service';

type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';
type DiscountStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';

interface ProductWithDiscount {
    id: string;
    name: string;
    price: number;
    quantity: number;
    categoryId: string;
    discount?: {
        type: DiscountType;
        value: number;
        status: DiscountStatus;
        startDate: Date;
        endDate: Date;
    } | null;
}

const createOrder = async (user: any, data: IOrderCreate) => {
    // Validate required fields
    if (!data.address || !data.city || !data.phoneNumber || !data.paymentMethod || !data.items || !data.total) {
        throw new AppError(httpStatus.BAD_REQUEST, 'All fields are required');
    }

    // Get all products in a single query
    const products = await prisma.product.findMany({
        where: {
            id: { in: data.items.map(item => item.productId) }
        },
        include: {
            discount: true
        }
    }) as ProductWithDiscount[];

    // Check if all products exist
    if (products.length !== data.items.length) {
        throw new AppError(httpStatus.NOT_FOUND, 'One or more products not found');
    }

    // Check if all products have sufficient quantity
    for (const item of data.items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) continue;
        if (product.quantity < item.quantity) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                `Insufficient quantity for product: ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`
            );
        }
    }

    let totalDiscount = 0;
    let couponId = null;

    // Calculate product discounts
    for (const item of data.items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) continue;

        if (product.discount && product.discount.status === 'ACTIVE' && 
            new Date() >= product.discount.startDate && 
            new Date() <= product.discount.endDate) {
            
            const itemTotal = product.price * item.quantity;
            let itemDiscount = 0;

            if (product.discount.type === 'PERCENTAGE') {
                itemDiscount = (itemTotal * product.discount.value) / 100;
            } else {
                itemDiscount = Math.min(product.discount.value * item.quantity, itemTotal);
            }

            totalDiscount += itemDiscount;
        }
    }

    // Apply coupon if provided
    if (data.couponCode) {
        try {
            const couponResult = await CouponService.validateAndApplyCoupon(data.couponCode, data.total - totalDiscount);
            totalDiscount += couponResult.discount;
            couponId = couponResult.coupon.id;
        } catch (error: any) {
            throw new AppError(httpStatus.BAD_REQUEST, error.message);
        }
    }

    // Calculate final total after all discounts
    const finalTotal = data.total - totalDiscount;

    // Determine order status based on payment method and transactionId
    let orderStatus: OrderStatus = OrderStatus.PENDING;
    if (
        (data.paymentMethod === PaymentMethod.BKASH || data.paymentMethod === PaymentMethod.NAGAD) &&
        data.transactionId
    ) {
        orderStatus = OrderStatus.PROCESSING;
    }

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
        // Create the order
        const newOrder = await tx.order.create({
            data: {
                userId: user.id,
                name: user.name,
                email: user.email,
                address: data.address,
                city: data.city,
                phoneNumber: data.phoneNumber,
                paymentMethod: data.paymentMethod as PaymentMethod,
                total: finalTotal,
                transactionId: data.transactionId || `ORDER_${Date.now()}`,
                status: orderStatus,
                couponId,
                discount: totalDiscount,
                items: {
                    create: data.items.map(item => {
                        const product = products.find(p => p.id === item.productId)!;
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
                },
                coupon: true
            }
        });

        // Update product quantities and status
        for (const item of data.items) {
            const product = products.find(p => p.id === item.productId)!;
            const newQuantity = product.quantity - item.quantity;
            
            await tx.product.update({
                where: { id: item.productId },
                data: {
                    quantity: newQuantity,
                    status: newQuantity === 0 ? 'SOLD' : 'AVAILABLE'
                }
            });
        }

        // Update coupon usage count if coupon was applied
        if (couponId) {
            await tx.coupon.update({
                where: { id: couponId },
                data: {
                    usedCount: {
                        increment: 1
                    },
                    usageLimit: {
                        decrement: 1
                    }
                }
            });
        }

        // If order is confirmed (created successfully), send confirmation email
        try {
            await sendOrderConfirmationEmail(user.email, newOrder);
        } catch (error) {
            console.error('Failed to send order confirmation email:', error);
            // Don't throw error here as the order was created successfully
        }

        // Return based on payment method
        if (data.paymentMethod === PaymentMethod.SSL_COMMERZ) {
            const initPaymentData = {
                amount: finalTotal,
                transactionId: newOrder.transactionId || `ORDER_${Date.now()}`,
                name: user.name,
                email: user.email,
                userId: user.id,
                productId: newOrder.items[0].productId,
                productName: newOrder.items[0].product.name,
                productCategory: newOrder.items[0].product.categoryId,
                discountPercentage: totalDiscount
            };

            try {
                const paymentUrl = await SSLService.initPayment(initPaymentData);
                // Return order and paymentUrl for SSL_COMMERZ
                return {
                    order: newOrder,
                    paymentUrl
                };
            } catch (error: any) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    error.message || 'Failed to initialize payment'
                );
            }
        } else {
            // For other payment methods, just return the order
            return {
                order: newOrder
            };
        }
    });
    
    return order;
};

const getAllOrders = async (params: any, options: IPaginationOptions) => {
        const { page, limit, skip } = paginationHelper.calculatePagination(options)
    const { searchTerm, ...filterData } = params

    const andCondition: Prisma.OrderWhereInput[] = [];

    if (params.searchTerm) {
        andCondition.push({
            OR: orderSearchAbleFields.map(filed => ({
                [filed]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditons: Prisma.OrderWhereInput = andCondition.length > 0 ? { AND: andCondition } : {}

    const result = await prisma.order.findMany({
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
            items: {
                include: {
                    product: {
                        include: {
                            shop: true
                        }
                    }
                }
            },
            createdAt: true,
            updatedAt: true
        }

    })
    const total = await prisma.order.count({
        where: whereConditons,
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }

};

const getOrderById = async (id: string) => {
    const order = await prisma.order.findUnique({
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
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    }

    return order;
};

const updateOrderStatus = async (id: string, status: OrderStatus) => {
    const order = await prisma.order.update({
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
};

const getOrdersByUserId = async (user: IUser) => {
    const orders = await prisma.order.findMany({
        where: { userId: user.id  },
        include: {
            items: {
                include: {
                    product: {
                        include : {
                            shop: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    logo: true,
                                    owner: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    }
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
}

const deleteOrder = async (id: string) => {
    // First delete all order items
    await prisma.orderItem.deleteMany({
        where: { orderId: id }
    });

    // Then delete the order
    const order = await prisma.order.delete({
        where: { id }
    });
    return order;
}

export const OrderService = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getOrdersByUserId,
    deleteOrder
}; 