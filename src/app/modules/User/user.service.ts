import * as bcrypt from "bcrypt"

import prisma from "../../utils/prisma"
import { IUser } from "./user.interface"
import config from "../../config"
import { FileUploader } from "../../helper/fileUploader"

const CreateUser = async (req: any )=> {

    const payload: IUser = req.body

    const hashedPassword = await bcrypt.hash(payload.password, config.saltRounds)
    payload.password = hashedPassword

    const result = await prisma.user.create({
        data: payload
    })
    return result
}

const getAllUser = async () => {
    const result = await prisma.user.findMany()
    return result
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