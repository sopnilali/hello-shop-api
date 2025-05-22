import { Request, Response } from 'express';
import { ShopService } from './shop.service';
import pick from '../../utils/pick';
import { catchAsync } from '../../helper/catchAsync';
import sendResponse from '../../helper/sendResponse';
import httpStatus from 'http-status';
const createShop = catchAsync(async (req: Request, res: Response) => {
    const result = await ShopService.createShop(req);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Shop created successfully',
        data: result
    })
});

const getAllShops = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['searchTerm']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await ShopService.getAllShops(filters, options);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Shops retrieved successfully',
        data: result.data,
        meta: result.meta
    })
});

const getShopById = catchAsync(async (req: Request, res: Response) => {
    const result = await ShopService.getShopById(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Shop retrieved successfully',
        data: result
    })
});

const updateShop = catchAsync(async (req: Request, res: Response) => {
    const result = await ShopService.updateShop(req.params.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Shop updated successfully',
        data: result
    })
});

const deleteShop = catchAsync(async (req: Request, res: Response) => {
    await ShopService.deleteShop(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Shop deleted successfully'
    });
});

const getMyShops = catchAsync(async (req: Request, res: Response) => {
    const result = await ShopService.getShopsByOwner(req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Your shops retrieved successfully',
        data: result
    })
});

export const ShopController = {
    createShop,
    getAllShops,
    getShopById,
    updateShop,
    deleteShop,
    getMyShops
}; 