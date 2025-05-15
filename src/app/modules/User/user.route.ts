import express, { NextFunction, Request, Response } from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middleware/validateRequest'
import { UserValidation } from './user.validation'
import auth from '../../middleware/auth'
import { UserRole } from '@prisma/client'
import { FileUploader } from '../../helper/fileUploader'

const router = express.Router()

router.post('/register', (req: Request, res:Response, next:NextFunction)=> {
    req.body = UserValidation.createUserValidation.parse(req.body)
    return UserController.createUser(req, res, next)
})

router.get('/', auth(UserRole.ADMIN), UserController.getAllUser)
router.get('/:id', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER), UserController.getSingleUser)
router.patch('/:id', FileUploader.upload.single('file'), (req: Request, res:Response, next:NextFunction)=> {
    req.body = UserValidation.updateUserValidationSchema.parse(JSON.parse(req.body.data))
    return UserController.updateUser(req, res, next)
})
router.delete('/:id', auth(UserRole.ADMIN), UserController.deleteUser)

export const UserRoutes = router