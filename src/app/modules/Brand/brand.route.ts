
import express, { NextFunction, Request, Response } from 'express';
import { BrandController } from './brand.controller';
import { UserRole } from '@prisma/client';
import { BrandValidation } from './brand.validation';
import auth from '../../middleware/auth';
import { FileUploader } from '../../helper/fileUploader';

const router = express.Router();

router.post(
    '/create-brand',
    auth(UserRole.ADMIN, UserRole.SELLER),
    FileUploader.upload.array('file'),
    (req: Request, res: Response, next: NextFunction)=> {
       req.body = BrandValidation.createBrandValidation.parse(JSON.parse(req.body.data))
        return BrandController.createBrand(req, res, next)
    }
);

router.get('/', BrandController.getAllBrands);
router.get('/:id', BrandController.getSingleBrand);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SELLER),
    FileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction)=> {
        req.body = BrandValidation.updateBrandValidation.parse(JSON.parse(req.body.data))
         return BrandController.updateBrand(req, res, next)
     }
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SELLER),
    BrandController.deleteBrand
);

export const BrandRoutes = router;
