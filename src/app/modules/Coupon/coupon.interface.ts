import { CouponType } from "@prisma/client";

import { CouponStatus } from "@prisma/client";

export interface ICouponCreate {
    code: string;
    type: CouponType;
    value: number;
    minPurchase?: number;
    maxDiscount?: number;
    startDate: Date;
    endDate: Date;
    usageLimit?: number;
}

export interface ICouponUpdate {
    code?: string;
    type?: CouponType;
    value?: number;
    minPurchase?: number;
    maxDiscount?: number;
    startDate?: Date;
    endDate?: Date;
    status?: CouponStatus;
    usageLimit?: number;
}