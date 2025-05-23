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
exports.DiscountController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const discount_service_1 = require("./discount.service");
const pick_1 = __importDefault(require("../../utils/pick"));
const catchAsync_1 = require("../../helper/catchAsync");
const sendResponse_1 = __importDefault(require("../../helper/sendResponse"));
const createDiscount = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield discount_service_1.DiscountService.createDiscount(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Discount created successfully',
        data: result
    });
}));
const getAllDiscounts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, ['type', 'status']);
    const options = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = yield discount_service_1.DiscountService.getAllDiscounts(options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Discounts fetched successfully',
        data: result
    });
}));
const getDiscountById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield discount_service_1.DiscountService.getDiscountById(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Discount fetched successfully',
        data: result
    });
}));
const updateDiscount = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield discount_service_1.DiscountService.updateDiscount(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Discount updated successfully',
        data: result
    });
}));
const deleteDiscount = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield discount_service_1.DiscountService.deleteDiscount(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Discount deleted successfully'
    });
}));
const applyDiscountToProduct = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { discountId, productId } = req.body;
    const result = yield discount_service_1.DiscountService.applyDiscountToProduct(discountId, productId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Discount applied to product successfully',
        data: result
    });
}));
const getActiveDiscounts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield discount_service_1.DiscountService.getActiveDiscounts();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Active discounts fetched successfully',
        data: result
    });
}));
exports.DiscountController = {
    createDiscount,
    getAllDiscounts,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
    applyDiscountToProduct,
    getActiveDiscounts
};
