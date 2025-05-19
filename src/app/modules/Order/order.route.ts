import express from 'express';
import { OrderController } from './order.controller';
import { UserRole } from '@prisma/client';
import auth from '../../middleware/auth';

const router = express.Router();

router.post(
    '/create',
    auth(UserRole.CUSTOMER),
    OrderController.createOrder
);

router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.SELLER),
    OrderController.getAllOrders
);

router.get(
    '/orderHistory',
    auth(UserRole.CUSTOMER),
    OrderController.getOrdersByUserId
);

router.get(
    '/:id',
    auth(UserRole.ADMIN, UserRole.CUSTOMER),
    OrderController.getOrderById
);

router.patch(
    '/:id/status',
    auth(UserRole.ADMIN, UserRole.SELLER),
    OrderController.updateOrderStatus
);

export const OrderRoutes = router; 