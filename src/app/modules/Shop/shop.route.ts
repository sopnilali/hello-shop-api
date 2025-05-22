import express, { NextFunction, Request, Response } from 'express';
import { ShopController } from './shop.controller';
import { ShopValidation } from './shop.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';
import { FileUploader } from '../../helper/fileUploader';

const router = express.Router();

// Public routes
router.get('/', ShopController.getAllShops);
router.get('/:id', ShopController.getShopById);

// Protected routes
router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.SELLER),
    FileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = ShopValidation.createShop.parse(JSON.parse(req.body.data));
        return ShopController.createShop(req, res, next);
    }
);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SELLER),
    FileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = ShopValidation.updateShop.parse(JSON.parse(req.body.data));
        return ShopController.updateShop(req, res, next);
    }
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SELLER),
    ShopController.deleteShop
);

router.get(
    '/my/shops',
    auth(UserRole.ADMIN, UserRole.SELLER),
    ShopController.getMyShops
);

export const ShopRoutes = router; 