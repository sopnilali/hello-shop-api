import { Request, Response } from "express";
import { BrandService } from "./brand.service";
import httpStatus from "http-status";
import sendResponse from "../../helper/sendResponse";
import { catchAsync } from "../../helper/catchAsync";

const createBrand = catchAsync(async (req: Request, res: Response) => {
    const result = await BrandService.createBrand(req);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Brand created successfully",
        data: result
    });
});

const getAllBrands = catchAsync(async (req: Request, res: Response) => {
    const result = await BrandService.getAllBrands();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brands retrieved successfully",
        data: result
    });
});

const getSingleBrand = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await BrandService.getSingleBrand(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brand retrieved successfully",
        data: result
    });
});

const updateBrand = catchAsync(async (req: Request, res: Response) => {
    const result = await BrandService.updateBrand(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brand updated successfully",
        data: result
    });
});

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await BrandService.deleteBrand(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brand deleted successfully",
    });
});

export const BrandController = {
    createBrand,
    getAllBrands,
    getSingleBrand,
    updateBrand,
    deleteBrand
};
