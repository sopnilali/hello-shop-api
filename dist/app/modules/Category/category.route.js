"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middleware/auth"));
const category_validation_1 = require("./category.validation");
const category_controller_1 = require("./category.controller");
const router = express_1.default.Router();
router.post('/create-category', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), (req, res, next) => {
    req.body = category_validation_1.CategoryValidation.createCategoryValidation.parse(req.body);
    return category_controller_1.CategoryController.createCategory(req, res, next);
});
router.get('/', category_controller_1.CategoryController.getAllCategories);
router.get('/:id', category_controller_1.CategoryController.getSingleCategory);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), (req, res, next) => {
    req.body = category_validation_1.CategoryValidation.updateCategoryValidation.parse(req.body);
    return category_controller_1.CategoryController.updateCategory(req, res, next);
});
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), category_controller_1.CategoryController.deleteCategory);
exports.CategoryRoutes = router;
