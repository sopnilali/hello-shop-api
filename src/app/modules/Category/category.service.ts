import prisma from "../../utils/prisma";

const createCategory = async (data: any) => {
    const result = await prisma.category.create({
        data
    });
    return result;
}

const getAllCategories = async () => {
    const result = await prisma.category.findMany();
    return result;
}

const getSingleCategory = async (id: string) => {
    const result = await prisma.category.findUnique({
        where: {
            id
        }
    });
    return result;
}

const updateCategory = async (id: string, data: any) => {
    const result = await prisma.category.update({
        where: {
            id
        },
        data
    });
    return result;
}

const deleteCategory = async (id: string) => {
    const result = await prisma.category.delete({
        where: {
            id
        }
    });
    return result;
}

export const CategoryService = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
}
