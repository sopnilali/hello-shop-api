"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const catchAsync_1 = require("../../helper/catchAsync");
const config_1 = __importDefault(require("../../config"));
const handleSuccess = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.handleSuccess(req.body);
    res.status(200).json({
        success: true,
        message: 'Payment successful',
        data: result
    });
}));
const handleFail = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.handleFail(req.body);
    res.status(200).json({
        success: false,
        message: 'Payment failed',
        data: result
    });
}));
const handleCancel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.handleCancel(req.body);
    res.status(200).json({
        success: false,
        message: 'Payment cancelled',
        data: result
    });
}));
const handleIPN = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.handleIPN(req.body);
    if (result.status === "PROCESSING") {
        res.redirect(`${config_1.default.ssl.success_url}/success?tran_id=${result.transactionId}`);
    }
    else {
        res.redirect(`${config_1.default.ssl.failed_url}/failed`);
    }
}));
const getVerifyPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.getVerifyPayment(req.user, req.query);
    res.status(200).json({
        success: true,
        message: "My Payment fetched successfully",
        data: result
    });
}));
exports.PaymentController = {
    handleSuccess,
    handleFail,
    handleCancel,
    handleIPN,
    getVerifyPayment
};
