
import express from 'express';
import { AuthController } from './auth.controller';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();


router.post('/login', AuthController.loginUser);
router.post('/refresh-token', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER), AuthController.refreshToken);
router.post('/logout', AuthController.logoutUser);
router.post('/reset-password', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER), AuthController.resetPassword);
router.post('/change-password', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER), AuthController.changePassword);

export const AuthRoutes = router;