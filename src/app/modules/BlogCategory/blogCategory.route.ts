import express from 'express'
import { BlogCategoryController } from './blogCategory.controller'
import { UserRole } from '@prisma/client'
import auth from '../../middleware/auth'

const router = express.Router()

router.post('/', auth(UserRole.ADMIN, UserRole.SELLER), BlogCategoryController.createBlogCategory)
router.get('/', BlogCategoryController.getAllBlogCategories)
router.get('/:id', BlogCategoryController.getSingleBlogCategory)
router.patch('/:id', auth(UserRole.ADMIN, UserRole.SELLER), BlogCategoryController.updateBlogCategory)
router.delete('/:id', auth(UserRole.ADMIN, UserRole.SELLER), BlogCategoryController.deleteBlogCategory)

export const BlogCategoryRoutes = router 