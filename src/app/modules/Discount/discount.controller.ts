import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { DiscountService } from './discount.service';
import { IPaginationOptions } from '../../interface/pagination.type';
import pick from '../../utils/pick';
import { catchAsync } from '../../helper/catchAsync';
import sendResponse from '../../helper/sendResponse';

const createDiscount = catchAsync(async (req: Request, res: Response) => {
    const result = await DiscountService.createDiscount(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Discount created successfully',
        data: result
    });
});

const getAllDiscounts = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['type', 'status']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']) as IPaginationOptions;
    const result = await DiscountService.getAllDiscounts(options);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Discounts fetched successfully',
        data: result
    });
});

const getDiscountById = catchAsync(async (req: Request, res: Response) => {
    const result = await DiscountService.getDiscountById(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Discount fetched successfully',
        data: result
    });
});

const updateDiscount = catchAsync(async (req: Request, res: Response) => {
    const result = await DiscountService.updateDiscount(req.params.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Discount updated successfully',
        data: result
    });
});

const deleteDiscount = catchAsync(async (req: Request, res: Response) => {
    await DiscountService.deleteDiscount(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Discount deleted successfully'
    });
});

const applyDiscountToProduct = catchAsync(async (req: Request, res: Response) => {
    const { discountId, productId } = req.body;
    const result = await DiscountService.applyDiscountToProduct(discountId, productId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Discount applied to product successfully',
        data: result
    });
});

const getActiveDiscounts = catchAsync(async (req: Request, res: Response) => {
    const result = await DiscountService.getActiveDiscounts();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Active discounts fetched successfully',
        data: result
    });
});

export const DiscountController = {
    createDiscount,
    getAllDiscounts,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
    applyDiscountToProduct,
    getActiveDiscounts
}; 