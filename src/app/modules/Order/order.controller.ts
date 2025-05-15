import { Request, Response } from 'express';
import { OrderService } from './order.service';
import { catchAsync } from '../../helper/catchAsync';
import sendResponse from '../../helper/sendResponse';
import httpStatus from 'http-status';

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.createOrder(req.user, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Order created successfully',
        data: result
    });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.getAllOrders();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Orders retrieved successfully',
        data: result
    });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OrderService.getOrderById(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order retrieved successfully',
        data: result
    });
});

const getOrdersByUserId = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.getOrdersByUserId(req.user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Orders retrieved successfully',
        data: result
    });
})

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await OrderService.updateOrderStatus(id, status);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order status updated successfully',
        data: result
    });
});

export const OrderController = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getOrdersByUserId
}; 