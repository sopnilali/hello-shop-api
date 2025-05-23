import prisma from "../../utils/prisma"


const createBlogCategory = async (req: any) => {
    const result = await prisma.blogCategory.create({
        data: req.body
    })
    return result
}

const getAllBlogCategories = async () => {
    const result = await prisma.blogCategory.findMany()
    return result
}

const getSingleBlogCategory = async (id: string) => {
    const result = await prisma.blogCategory.findUnique({
        where: { id },
        include: {
            blog: true
        }
    })
    return result
}

const updateBlogCategory = async (id: string, req: any) => {
    const result = await prisma.blogCategory.update({
        where: { id },
        data: req.body
    })
    return result
}

const deleteBlogCategory = async (id: string) => {
    const result = await prisma.blogCategory.delete({
        where: { id }
    })
    return result
}

export const BlogCategoryService = {
    createBlogCategory,
    getAllBlogCategories,
    getSingleBlogCategory,
    updateBlogCategory,
    deleteBlogCategory
} 