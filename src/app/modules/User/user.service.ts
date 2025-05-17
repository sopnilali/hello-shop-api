import * as bcrypt from "bcrypt"

import prisma from "../../utils/prisma"
import { IUser } from "./user.interface"
import config from "../../config"
import { FileUploader } from "../../helper/fileUploader"
import { Prisma } from "@prisma/client"
import { IPaginationOptions } from "../../interface/pagination.type"
import { paginationHelper } from "../../helper/paginationHelper"
import { userSearchAbleFields } from "./user.constant"

const CreateUser = async (req: any )=> {

    const payload: IUser = req.body

    const hashedPassword = await bcrypt.hash(payload.password, config.saltRounds)
    payload.password = hashedPassword

    const result = await prisma.user.create({
        data: payload
    })
    return result
}

const getAllUser = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options)
    const { searchTerm, ...filterData } = params

    const andCondition: Prisma.UserWhereInput[] = [];

    if (params.searchTerm) {
        andCondition.push({
            OR: userSearchAbleFields.map(filed => ({
                [filed]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditons: Prisma.UserWhereInput = andCondition.length > 0 ? { AND: andCondition } : {}

    const result = await prisma.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePhoto: true,
            status: true,
            address: true,
            city: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true
        }

    })
    const total = await prisma.user.count({
        where: whereConditons,
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }

}
const getSingleUser = async (id: string) => {
    const result = await prisma.user.findUnique({
        where: {
            id
        }
    })
    return result
}

const updateUser = async (id: string, req: any) => {

    const file = req.file
    if (file) {
        const result = await FileUploader.uploadToCloudinary(file)
        req.body.profilePhoto = result?.secure_url
    }
    const result = await prisma.user.update({
        where: {
            id
        },
        data: req.body
    })
    return result
}
const deleteUser = async (id: string) => {
    const result = await prisma.user.delete({
        where: {
            id
        }
    })
    return result
}

export const UserService = {
    CreateUser,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser
}