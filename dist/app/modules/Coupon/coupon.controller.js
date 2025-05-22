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
exports.CouponController = void 0;
const coupon_service_1 = require("./coupon.service");
const catchAsync_1 = require("../../helper/catchAsync");
const pick_1 = __importDefault(require("../../utils/pick"));
const createCoupon = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_service_1.CouponService.createCoupon(req.body);
    res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
        data: result
    });
}));
const getAllCoupons = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, ['searchTerm', 'status', 'type']);
    const options = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = yield coupon_service_1.CouponService.getAllCoupons(filters, options);
    res.status(200).json({
        success: true,
        message: 'Coupons retrieved successfully',
        data: result.data,
        meta: result.meta
    });
}));
const getCouponById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_service_1.CouponService.getCouponById(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Coupon retrieved successfully',
        data: result
    });
}));
const updateCoupon = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_service_1.CouponService.updateCoupon(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: 'Coupon updated successfully',
        data: result
    });
}));
const deleteCoupon = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield coupon_service_1.CouponService.deleteCoupon(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully'
    });
}));
const validateCoupon = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, totalAmount } = req.body;
    const result = yield coupon_service_1.CouponService.validateAndApplyCoupon(code, totalAmount);
    res.status(200).json({
        success: true,
        message: 'Coupon validated successfully',
        data: result
    });
}));
const verifyCoupon = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { couponCode } = req.params;
    const result = yield coupon_service_1.CouponService.verifyCoupon(couponCode);
    res.status(200).json({
        success: true,
        message: 'Coupon verified successfully',
        data: result
    });
}));
exports.CouponController = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    verifyCoupon
};
