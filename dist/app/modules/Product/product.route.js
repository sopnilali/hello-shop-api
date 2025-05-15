"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middleware/auth"));
const product_controller_1 = require("./product.controller");
const fileUploader_1 = require("../../helper/fileUploader");
const product_validation_1 = require("./product.validation");
const router = express_1.default.Router();
router.post('/create-product', (0, auth_1.default)(client_1.UserRole.SELLER, client_1.UserRole.ADMIN), fileUploader_1.FileUploader.upload.array('files'), (req, res, next) => {
    req.body = product_validation_1.ProductValidation.createProductValidation.parse(JSON.parse(req.body.data));
    return product_controller_1.ProductController.createProduct(req, res, next);
});
router.get('/', product_controller_1.ProductController.getAllProducts);
router.get('/:id', product_controller_1.ProductController.getSingleProduct);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.SELLER, client_1.UserRole.ADMIN), fileUploader_1.FileUploader.upload.array('files'), (req, res, next) => {
    req.body = product_validation_1.ProductValidation.updateProductValidation.parse(JSON.parse(req.body.data));
    return product_controller_1.ProductController.updateProduct(req, res, next);
});
router.patch('/:id/status', (0, auth_1.default)(client_1.UserRole.SELLER, client_1.UserRole.ADMIN), (req, res, next) => {
    req.body = { status: req.body.status };
    return product_controller_1.ProductController.updateProductStatus(req, res, next);
});
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.SELLER, client_1.UserRole.ADMIN), product_controller_1.ProductController.deleteProduct);
exports.ProductRoutes = router;
