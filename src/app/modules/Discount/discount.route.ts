import express from 'express';
import auth from '../../middleware/auth';
import { DiscountValidation } from './discount.validation';
import validateRequest from '../../middleware/validateRequest';
import { DiscountController } from './discount.controller';
import { UserRole } from '@prisma/client';

const router = express.Router();



router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.SELLER),
    validateRequest(DiscountValidation.createDiscount),
    DiscountController.createDiscount
);



router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.SELLER),
    DiscountController.getAllDiscounts
);

router.get(
    '/active',
    DiscountController.getActiveDiscounts
);

router.get(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SELLER),
    DiscountController.getDiscountById
);




router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SELLER),
    validateRequest(DiscountValidation.updateDiscount),
    DiscountController.updateDiscount
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SELLER),
    DiscountController.deleteDiscount
);

router.post(
    '/apply',
    auth(UserRole.ADMIN, UserRole.SELLER),
    DiscountController.applyDiscountToProduct
);





export const DiscountRoutes = router; 