"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const payment_validation_1 = require("./payment.validation");
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// SSLCommerz success callback
router.post('/success', (0, validateRequest_1.default)(payment_validation_1.PaymentValidation.validatePayment), payment_controller_1.PaymentController.handleSuccess);
// SSLCommerz fail callback
router.post('/fail', (0, validateRequest_1.default)(payment_validation_1.PaymentValidation.validatePayment), payment_controller_1.PaymentController.handleFail);
// SSLCommerz cancel callback
router.post('/cancel', (0, validateRequest_1.default)(payment_validation_1.PaymentValidation.validatePayment), payment_controller_1.PaymentController.handleCancel);
// SSLCommerz IPN (Instant Payment Notification)
router.post('/ipn', payment_controller_1.PaymentController.handleIPN);
router.get('/verify', (0, auth_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.SELLER, client_1.UserRole.ADMIN), payment_controller_1.PaymentController.getVerifyPayment);
exports.PaymentRoutes = router;
