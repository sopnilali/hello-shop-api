"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const coupon_controller_1 = require("./coupon.controller");
const coupon_validation_1 = require("./coupon.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Admin routes
router.post('/', (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(coupon_validation_1.CouponValidation.createCoupon), coupon_controller_1.CouponController.createCoupon);
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN), coupon_controller_1.CouponController.getAllCoupons);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), coupon_controller_1.CouponController.getCouponById);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(coupon_validation_1.CouponValidation.updateCoupon), coupon_controller_1.CouponController.updateCoupon);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), coupon_controller_1.CouponController.deleteCoupon);
// Public route for coupon validation
router.post('/validate', (0, validateRequest_1.default)(coupon_validation_1.CouponValidation.validateCoupon), coupon_controller_1.CouponController.validateCoupon);
// Public route for verifying coupon code
router.get('/verify/:couponCode', coupon_controller_1.CouponController.verifyCoupon);
exports.CouponRoutes = router;
