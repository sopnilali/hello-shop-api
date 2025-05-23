import { BlogService } from "./blog.service"

const createBlog = async (req: any, res: any) => {
    const result = await BlogService.createBlog(req)
    res.status(200).json({
        success: true,
        message: "Blog created successfully",
        data: result
    })
}

const getAllBlog = async (req: any, res: any) => {
    const result = await BlogService.getAllBlog()
    res.status(200).json({
        success: true,
        message: "Blogs fetched successfully",
        data: result
    })
}

const getSingleBlog = async (req: any, res: any) => {
    const result = await BlogService.getSingleBlog(req.params.id)
    res.status(200).json({
        success: true,
        message: "Blog fetched successfully",
        data: result
    })
}

const updateBlog = async (req: any, res: any) => {
    const result = await BlogService.updateBlog(req.params.id, req)
    res.status(200).json({
        success: true,
        message: "Blog updated successfully",
        data: result
    })
}

const deleteBlog = async (req: any, res: any) => {
    const result = await BlogService.deleteBlog(req.params.id)
    res.status(200).json({
        success: true,
        message: "Blog deleted successfully",
        data: result
    })
}

const editorUpload = async (req: any, res: any) => {
    const result = await BlogService.editorUpload(req)
    res.status(200).json({
        success: true,
        message: "Editor upload successfully",
        data: result
    })
}
export const BlogController = { createBlog, getAllBlog, getSingleBlog, updateBlog, deleteBlog, editorUpload }
