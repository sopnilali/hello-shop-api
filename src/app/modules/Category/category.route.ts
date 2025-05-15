import express from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middleware/auth';
import { CategoryValidation } from './category.validation';
import { CategoryController } from './category.controller';

const router = express.Router();

router.post(
    '/create-category',
    auth(UserRole.ADMIN, UserRole.SELLER),
    (req, res, next) => {
        req.body = CategoryValidation.createCategoryValidation.parse(req.body);
        return CategoryController.createCategory(req, res, next);
    }
);

router.get('/', CategoryController.getAllCategories);

router.get('/:id', CategoryController.getSingleCategory);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SELLER),
    (req, res, next) => {
        req.body = CategoryValidation.updateCategoryValidation.parse(req.body);
        return CategoryController.updateCategory(req, res, next);
    }
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.SELLER),
    CategoryController.deleteCategory
);

export const CategoryRoutes = router;
