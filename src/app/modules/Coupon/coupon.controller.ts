import { Request, Response } from 'express';
import { CouponService } from './coupon.service';
import { catchAsync } from '../../helper/catchAsync';
import pick from '../../utils/pick';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
    const result = await CouponService.createCoupon(req.body);
    res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
        data: result
    });
});

const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['searchTerm', 'status', 'type']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await CouponService.getAllCoupons(filters, options);
    res.status(200).json({
        success: true,
        message: 'Coupons retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});

const getCouponById = catchAsync(async (req: Request, res: Response) => {
    const result = await CouponService.getCouponById(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Coupon retrieved successfully',
        data: result
    });
});

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
    const result = await CouponService.updateCoupon(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: 'Coupon updated successfully',
        data: result
    });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
    await CouponService.deleteCoupon(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully'
    });
});

const validateCoupon = catchAsync(async (req: Request, res: Response) => {
    const { code, totalAmount } = req.body;
    const result = await CouponService.validateAndApplyCoupon(code, totalAmount);
    res.status(200).json({
        success: true,
        message: 'Coupon validated successfully',
        data: result
    });
});

const verifyCoupon = catchAsync(async (req: Request, res: Response) => {
    const { couponCode } = req.params;
    const result = await CouponService.verifyCoupon(couponCode);
    res.status(200).json({
        success: true,
        message: 'Coupon verified successfully',
        data: result
    });
});

export const CouponController = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    verifyCoupon
}; 