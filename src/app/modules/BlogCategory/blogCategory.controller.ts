import status from "http-status"
import { catchAsync } from "../../helper/catchAsync"
import sendResponse from "../../helper/sendResponse"
import { BlogCategoryService } from "./blogCategory.service"

const createBlogCategory = catchAsync(async (req: any, res: any) => {
    const result = await BlogCategoryService.createBlogCategory(req)
    sendResponse(res, {
        success: true,
        statusCode: status.CREATED,
        message: "Blog category created successfully",
        data: result
    })
})

const getAllBlogCategories = catchAsync(async (req: any, res: any) => {
    const result = await BlogCategoryService.getAllBlogCategories()
    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Blog categories fetched successfully",
        data: result
    })
})

const getSingleBlogCategory = catchAsync(async (req: any, res: any) => {
    const result = await BlogCategoryService.getSingleBlogCategory(req.params.id)
    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Blog category fetched successfully",
        data: result
    })
})

const updateBlogCategory = catchAsync(async (req: any, res: any) => {
    const result = await BlogCategoryService.updateBlogCategory(req.params.id, req)
    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Blog category updated successfully",
        data: result
    })
})

const deleteBlogCategory = catchAsync(async (req: any, res: any) => {
    const result = await BlogCategoryService.deleteBlogCategory(req.params.id)
    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Blog category deleted successfully",
        data: result
    })
})

export const BlogCategoryController = {
    createBlogCategory,
    getAllBlogCategories,
    getSingleBlogCategory,
    updateBlogCategory,
    deleteBlogCategory
}