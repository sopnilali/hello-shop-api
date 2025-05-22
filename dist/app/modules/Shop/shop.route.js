"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRoutes = void 0;
const express_1 = __importDefault(require("express"));
const shop_controller_1 = require("./shop.controller");
const shop_validation_1 = require("./shop.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../helper/fileUploader");
const router = express_1.default.Router();
// Public routes
router.get('/', shop_controller_1.ShopController.getAllShops);
router.get('/:id', shop_controller_1.ShopController.getShopById);
// Protected routes
router.post('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = shop_validation_1.ShopValidation.createShop.parse(JSON.parse(req.body.data));
    return shop_controller_1.ShopController.createShop(req, res, next);
});
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = shop_validation_1.ShopValidation.updateShop.parse(JSON.parse(req.body.data));
    return shop_controller_1.ShopController.updateShop(req, res, next);
});
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), shop_controller_1.ShopController.deleteShop);
router.get('/my/shops', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), shop_controller_1.ShopController.getMyShops);
exports.ShopRoutes = router;
