import { NextFunction, Request, Response } from "express";
import { FileUploader } from "../../helper/fileUploader";
import { ProductService } from "./product.service";

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (files?.length) {
            const uploadPromises = files.map(file => FileUploader.uploadToCloudinary(file));
            const uploadedFiles = await Promise.all(uploadPromises);
            req.body.images = uploadedFiles.map(file => file?.secure_url);
        }
        const result = await ProductService.createProduct(req);
        res.status(200).json({
            success: true,
            message: "Product created successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ProductService.getAllProducts(req.query);
        res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ProductService.getSingleProduct(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (files?.length) {
            const uploadPromises = files.map(file => FileUploader.uploadToCloudinary(file));
            const uploadedFiles = await Promise.all(uploadPromises);
            req.body.images = uploadedFiles.map(file => file?.secure_url);
        }
        const result = await ProductService.updateProduct(req);
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ProductService.deleteProduct(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const updateProductStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ProductService.updateProductStatus(req.params.id, req.body.status);
        res.status(200).json({
            success: true,
            message: "Product status updated successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const ProductController = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus
};
