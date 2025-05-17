"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandRoutes = void 0;
const express_1 = __importDefault(require("express"));
const brand_controller_1 = require("./brand.controller");
const client_1 = require("@prisma/client");
const brand_validation_1 = require("./brand.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const fileUploader_1 = require("../../helper/fileUploader");
const router = express_1.default.Router();
router.post('/create-brand', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = brand_validation_1.BrandValidation.createBrandValidation.parse(JSON.parse(req.body.data));
    return brand_controller_1.BrandController.createBrand(req, res, next);
});
router.get('/', brand_controller_1.BrandController.getAllBrands);
router.get('/:id', brand_controller_1.BrandController.getSingleBrand);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = brand_validation_1.BrandValidation.updateBrandValidation.parse(JSON.parse(req.body.data));
    return brand_controller_1.BrandController.updateBrand(req, res, next);
});
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), brand_controller_1.BrandController.deleteBrand);
exports.BrandRoutes = router;
