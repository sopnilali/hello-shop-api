import { Request, Response } from "express";
import { UserService } from "./user.service";
import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";


const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.CreateUser(req);
    sendResponse(res, {
        success: true,
        message: "User created successfully",
        statusCode: 200,
        data: result,
    })
})

const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getAllUser();
    sendResponse(res, {
        success: true,
        message: "User retrieved successfully",
        statusCode: 200,
        data: result,
    })
})
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getSingleUser(req.params.id);
    sendResponse(res, {
        success: true,
        message: "User retrieved successfully",
        statusCode: 200,
        data: result,
    })
})
const updateUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.updateUser(req.params.id, req);
    sendResponse(res, {
        success: true,
        message: "User updated successfully",
        statusCode: 200,
        data: result,
    })
})
const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.deleteUser(req.params.id);
    sendResponse(res, {
        success: true,
        message: "User deleted successfully",
        statusCode: 200,
        data: result,
    })
})
export const UserController = {
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser
}