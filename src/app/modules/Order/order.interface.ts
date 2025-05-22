import { OrderStatus, PaymentMethod } from '@prisma/client';

export interface IOrderItem {
    productId: string;
    quantity: number;
    price: number;
}

export interface IOrderItemCreate {
    productId: string;
    quantity: number;
}

export interface IOrderCreate {
    address: string;
    city: string;
    phoneNumber: string;
    paymentMethod: PaymentMethod;
    transactionId?: string;
    items: IOrderItem[];
    total: number;
    couponCode?: string;
}

export interface IOrder {
    id: string;
    userId: string;
    name: string;
    email: string;
    address: string;
    city: string;
    phoneNumber: string;
    paymentMethod: PaymentMethod;
    total: number;
    transactionId: string;
    status: OrderStatus;
    items: IOrderItem[];
    createdAt: Date;
    updatedAt: Date;
} 