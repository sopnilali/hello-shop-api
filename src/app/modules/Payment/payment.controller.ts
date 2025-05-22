import { Request, Response } from 'express';
import { OrderStatus } from '@prisma/client';
import { PaymentService } from './payment.service';
import { catchAsync } from '../../helper/catchAsync';
import config from '../../config';

const handleSuccess = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.handleSuccess(req.body);
    res.status(200).json({
        success: true,
        message: 'Payment successful',
        data: result
    });
});

const handleFail = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.handleFail(req.body);
    res.status(200).json({
        success: false,
        message: 'Payment failed',
        data: result
    });
});

const handleCancel = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.handleCancel(req.body);
    res.status(200).json({
        success: false,
        message: 'Payment cancelled',
        data: result
    });
});

const handleIPN = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.handleIPN(req.body);
    if (result.status === "PROCESSING") {
        res.redirect(`${config.ssl.success_url}/success?tran_id=${result.transactionId}`);
      } else {
        res.redirect(`${config.ssl.failed_url}/failed`);
      }
});

const getVerifyPayment = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.getVerifyPayment(req.user, req.query);
    res.status(200).json({
        success: true,
        message: "My Payment fetched successfully",
        data: result
    });
});

export const PaymentController = {
    handleSuccess,
    handleFail,
    handleCancel,
    handleIPN,
    getVerifyPayment
}; 