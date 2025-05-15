"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const fileUploader_1 = require("../../helper/fileUploader");
const product_service_1 = require("./product.service");
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        if (files === null || files === void 0 ? void 0 : files.length) {
            const uploadPromises = files.map(file => fileUploader_1.FileUploader.uploadToCloudinary(file));
            const uploadedFiles = yield Promise.all(uploadPromises);
            req.body.images = uploadedFiles.map(file => file === null || file === void 0 ? void 0 : file.secure_url);
        }
        const result = yield product_service_1.ProductService.createProduct(req);
        res.status(200).json({
            success: true,
            message: "Product created successfully",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_service_1.ProductService.getAllProducts(req.query);
        res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_service_1.ProductService.getSingleProduct(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        if (files === null || files === void 0 ? void 0 : files.length) {
            const uploadPromises = files.map(file => fileUploader_1.FileUploader.uploadToCloudinary(file));
            const uploadedFiles = yield Promise.all(uploadPromises);
            req.body.images = uploadedFiles.map(file => file === null || file === void 0 ? void 0 : file.secure_url);
        }
        const result = yield product_service_1.ProductService.updateProduct(req);
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_service_1.ProductService.deleteProduct(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
const updateProductStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_service_1.ProductService.updateProductStatus(req.params.id, req.body.status);
        res.status(200).json({
            success: true,
            message: "Product status updated successfully",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.ProductController = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus
};
