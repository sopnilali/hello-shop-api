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
exports.SSLService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const config_1 = __importDefault(require("../../config"));
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const store_id = config_1.default.ssl.store_id;
const store_passwd = config_1.default.ssl.store_password;
const is_live = false;
const initPayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        store_id: config_1.default.ssl.store_id,
        store_passwd: config_1.default.ssl.store_password,
        total_amount: paymentData.amount,
        currency: "BDT",
        tran_id: paymentData.transactionId,
        success_url: `${config_1.default.ssl.validation_api}?tran_id=${paymentData.transactionId}`,
        fail_url: config_1.default.ssl.failed_url,
        cancel_url: config_1.default.ssl.cancel_url,
        ipn_url: "http://localhost:5000/api/ipn",
        shipping_method: "N/A",
        product_name: paymentData.productName,
        product_category: paymentData.productCategory,
        product_profile: "general",
        cus_name: paymentData.name,
        cus_email: paymentData.email,
        cus_add1: "Dhaka",
        cus_add2: "N/A",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "N/A",
        ship_add1: "N/A",
        ship_add2: "N/A",
        ship_city: "N/A",
        ship_state: "N/A",
        ship_postcode: 1000,
        ship_country: "N/A",
        userId: paymentData.userId,
        productId: paymentData.productId,
    };
    const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
    try {
        const apiResponse = yield sslcz.init(data);
        const GatewayPageURL = apiResponse.GatewayPageURL;
        if (GatewayPageURL) {
            return GatewayPageURL;
        }
        else {
            throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, "Failed to generate payment gateway URL.");
        }
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "An error occurred while processing payment.");
    }
});
exports.SSLService = {
    initPayment,
};
