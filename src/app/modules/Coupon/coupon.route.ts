import express from 'express';
import { CouponController } from './coupon.controller';
import { CouponValidation } from './coupon.validation';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { UserRole } from '@prisma/client';

const router = express.Router();

// Admin routes
router.post(
    '/',
    auth(UserRole.ADMIN),
    validateRequest(CouponValidation.createCoupon),
    CouponController.createCoupon
);

router.get(
    '/',
    auth(UserRole.ADMIN),
    CouponController.getAllCoupons
);

router.get(
    '/:id',
    auth(UserRole.ADMIN),
    CouponController.getCouponById
);

router.patch(
    '/:id',
    auth(UserRole.ADMIN),
    validateRequest(CouponValidation.updateCoupon),
    CouponController.updateCoupon
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN),
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