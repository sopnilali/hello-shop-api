import { FileUploader } from "../../helper/fileUploader";
import prisma from "../../utils/prisma";
import { IBrand } from "./brand.interface";

const createBrand = async (req: any) => {
    const file = req.file;
    if (file) {
        const results = await FileUploader.uploadToCloudinary(file);
        req.body.logo = results?.secure_url;
    }
    const result = await prisma.brand.create({
        data: req.body
    });
    return result;
}

const getAllBrands = async () => {
    const result = await prisma.brand.findMany();
    return result;
}

const getSingleBrand = async (id: string) => {
    const result = await prisma.brand.findUnique({
        where: {
            id
        }
    });
    return result;
}

const updateBrand = async (req: any) => {

    const file = req.file;
    if (file) {
        const results = await FileUploader.uploadToCloudinary(file);
        req.body.logo = results?.secure_url;
    }
    const result = await prisma.brand.update({
        where: {
            id: req.params.id
        },
        data: req.body as IBrand
    });
    return result;
}

const deleteBrand = async (id: string) => {
    const result = await prisma.brand.delete({
        where: {
            id
        }
    });
    return result;
}
export const BrandService = {
    createBrand,
    getAllBrands,
    getSingleBrand,
    updateBrand,
    deleteBrand,
}
