import express, { NextFunction, Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middleware/auth';
import { ProductController } from './product.controller';
import { FileUploader } from '../../helper/fileUploader';
import { ProductValidation } from './product.validation';

const router = express.Router();

router.post(
    '/create-product',
    auth(UserRole.SELLER, UserRole.ADMIN),
    FileUploader.upload.array('files'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = ProductValidation.createProductValidation.parse(JSON.parse(req.body.data));
        return ProductController.createProduct(req, res, next);
    }
);

router.get('/', ProductController.getAllProducts);

router.get('/:id', ProductController.getSingleProduct);

router.patch(
    '/:id',
    auth(UserRole.SELLER, UserRole.ADMIN),
    FileUploader.upload.array('files'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = ProductValidation.updateProductValidation.parse(JSON.parse(req.body.data));
        return ProductController.updateProduct(req, res, next);
    }
);

router.patch(
    '/:id/status',
    auth(UserRole.SELLER, UserRole.ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = { status: req.body.status };
        return ProductController.updateProductStatus(req, res, next);
    }
);

router.delete(
    '/:id',
    auth(UserRole.SELLER, UserRole.ADMIN),
    ProductController.deleteProduct
);

export const ProductRoutes = router;
