import prisma from '../../utils/prisma';
import { Prisma } from '@prisma/client';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { IPaginationOptions } from '../../interface/pagination.type';
import { paginationHelper } from '../../helper/paginationHelper';
import { FileUploader } from '../../helper/fileUploader';



const createShop = async (req: any) => {

    const file = req.file;

    if (!file) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Logo is required');
    }

    const uploadResult = await FileUploader.uploadToCloudinary(file);
    req.body.logo = uploadResult?.secure_url;


    const shop = await prisma.shop.create({
        data: {
            ...req.body,
            ownerId: req.user.id
        },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    return shop;
};

const getAllShops = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm } = params;

    const andCondition: Prisma.ShopWhereInput[] = [];

    if (searchTerm) {
        andCondition.push({
            OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } }
            ]
        });
    }

    const whereConditions: Prisma.ShopWhereInput = andCondition.length > 0 ? { AND: andCondition } : {};

    const result = await prisma.shop.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            _count: {
                select: {
                    products: true
                }
            }
        }
    });

    const total = await prisma.shop.count({
        where: whereConditions
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};

const getShopById = async (id: string) => {
    const shop = await prisma.shop.findUnique({
        where: { id },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            products: {
                include: {
                    category: true,
                    brand: true
                }
            }
        }
    });

    if (!shop) {
        throw new AppError(httpStatus.NOT_FOUND, 'Shop not found');
    }

    return shop;
};

const updateShop = async (id: string, data: any) => {
    const shop = await prisma.shop.findUnique({
        where: { id }
    });

    if (!shop) {
        throw new AppError(httpStatus.NOT_FOUND, 'Shop not found');
    }

    const updatedShop = await prisma.shop.update({
        where: { id },
        data,
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    return updatedShop;
};

const deleteShop = async (id: string) => {
    const shop = await prisma.shop.findUnique({
        where: { id }
    });

    if (!shop) {
        throw new AppError(httpStatus.NOT_FOUND, 'Shop not found');
    }

    await prisma.shop.delete({
        where: { id }
    });

    return null;
};

const getShopsByOwner = async (ownerId: string) => {
    const shops = await prisma.shop.findMany({
        where: { ownerId },
        include: {
            _count: {
                select: {
                    products: true
                }
            }
        }
    });

    return shops;
};

export const ShopService = {
    createShop,
    getAllShops,
    getShopById,
    updateShop,
    deleteShop,
    getShopsByOwner
}; 