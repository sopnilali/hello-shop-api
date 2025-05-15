import { Conditions, ProductStatus } from "@prisma/client";

export interface IProduct {
    id?: string;
    name: string;
    description: string;
    price: number;
    weight: number;
    quantity: number;
    images: string[];
    categoryId: string;
    condition: Conditions;
    brandId: string;
    status?: ProductStatus;
    sellerId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
