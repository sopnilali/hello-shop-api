import prisma from '../../utils/prisma';
import { IOrderCreate } from './order.interface';
import { OrderStatus, PaymentMethod, Prisma } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { sendOrderConfirmationEmail } from '../../utils/emailService';
import { IUser } from '../User/user.interface';
import { paginationHelper } from '../../helper/paginationHelper';
import { IPaginationOptions } from '../../interface/pagination.type';
import { orderSearchAbleFields } from './order.constant';

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
        select: {
            id: true,
            name: true,
            price: true,
            quantity: true
        }
    });

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
                total: data.total,
                transactionId: data.transactionId,
                status: OrderStatus.PENDING,
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
                }
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

        return newOrder;
    });

    // Send order confirmation email
    try {
        await sendOrderConfirmationEmail(user.email, order);
    } catch (error) {
        console.error('Failed to send order confirmation email:', error);
        // Don't throw error here as the order was created successfully
    }

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
}

export const OrderService = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getOrdersByUserId
}; 