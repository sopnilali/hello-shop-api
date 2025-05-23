import { DiscountType, DiscountStatus } from "@prisma/client";

export interface IDiscountCreate {
    type: DiscountType;
    value: number;
    productId: string;
    startDate: Date;
    endDate: Date;
    status?: DiscountStatus;
}

export interface IDiscountUpdate {
    type?: DiscountType;
    value?: number;
    startDate?: Date;
    endDate?: Date;
    status?: DiscountStatus;
} 