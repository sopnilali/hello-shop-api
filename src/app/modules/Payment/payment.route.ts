import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { PaymentValidation } from './payment.validation';
import { PaymentController } from './payment.controller';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

// SSLCommerz success callback
router.post(
    '/success',
    validateRequest(PaymentValidation.validatePayment),
    PaymentController.handleSuccess
);

// SSLCommerz fail callback
router.post(
    '/fail',
    validateRequest(PaymentValidation.validatePayment),
    PaymentController.handleFail
);

// SSLCommerz cancel callback
router.post(
    '/cancel',
    validateRequest(PaymentValidation.validatePayment),
    PaymentController.handleCancel
);

// SSLCommerz IPN (Instant Payment Notification)
router.post(
    '/ipn',
    PaymentController.handleIPN
);

router.get(
    '/verify',
    auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
    PaymentController.getVerifyPayment
);

export const PaymentRoutes = router; 