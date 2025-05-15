import { Response } from 'express';

type TResponse<T> = {
  success?: boolean;
  message?: string;
  statusCode: number;
  meta?: {
    page: number,
    limit: number,
    total: number
},
  data?: T | null | undefined;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    statusCode: data.statusCode,
    meta: data.meta || null || undefined,
    data: data.data || null || undefined,
  });
};

export default sendResponse;