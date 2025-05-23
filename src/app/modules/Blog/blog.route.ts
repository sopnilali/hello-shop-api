import { UserRole } from "@prisma/client"
import auth from "../../middleware/auth"
import { BlogController } from "./blog.controller"
import { Router } from "express"
import { FileUploader } from "../../helper/fileUploader"

const router = Router()

router.post('/', auth(UserRole.ADMIN, UserRole.SELLER), FileUploader.upload.single('thumbnail'), (req: any, res: any) => {
    req.body = JSON.parse(req.body.data)
    BlogController.createBlog(req, res)
})
router.get('/', BlogController.getAllBlog)
router.get('/:id', BlogController.getSingleBlog)
router.patch('/:id', auth(UserRole.ADMIN, UserRole.SELLER), FileUploader.upload.single('thumbnail'), (req: any, res: any) => {
    req.body = JSON.parse(req.body.data)
    BlogController.updateBlog(req, res)
})
router.delete('/:id', auth(UserRole.ADMIN, UserRole.SELLER), BlogController.deleteBlog)

router.post('/editor-upload', auth(UserRole.ADMIN, UserRole.SELLER), FileUploader.editorUpload.single('file'), BlogController.editorUpload)


export const BlogRoutes  = router
