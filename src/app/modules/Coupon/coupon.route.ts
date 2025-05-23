import express from 'express';
import { CouponController } from './coupon.controller';
import { CouponValidation } from './coupon.validation';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { UserRole } from '@prisma/client';

const router = express.Router();

// Admin and Seller routes
router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.SELLER),
    validateRequest(CouponValidation.createCoupon),
    CouponController.createCoupon
);

router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.SELLER),
    CouponController.getAllCoupons
);

router.get(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SELLER),
    CouponController.getCouponById
);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SELLER),
    validateRequest(CouponValidation.updateCoupon),
    CouponController.updateCoupon
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SELLER),
    CouponController.deleteCoupon
);

// Public route for coupon validation
router.post(
    '/validate',
    validateRequest(CouponValidation.validateCoupon),
    CouponController.validateCoupon
);

// Public route for verifying coupon code
router.get(
    '/verify/:couponCode',
    CouponController.verifyCoupon
);

export const CouponRoutes = router; 