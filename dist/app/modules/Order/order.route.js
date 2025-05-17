"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.post('/create', (0, auth_1.default)(client_1.UserRole.CUSTOMER), order_controller_1.OrderController.createOrder);
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN), order_controller_1.OrderController.getAllOrders);
router.get('/orderHistory', (0, auth_1.default)(client_1.UserRole.CUSTOMER), order_controller_1.OrderController.getOrdersByUserId);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER), order_controller_1.OrderController.getOrderById);
router.patch('/:id/status', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), order_controller_1.OrderController.updateOrderStatus);
exports.OrderRoutes = router;
