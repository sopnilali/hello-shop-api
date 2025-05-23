"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogCategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const blogCategory_controller_1 = require("./blogCategory.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), blogCategory_controller_1.BlogCategoryController.createBlogCategory);
router.get('/', blogCategory_controller_1.BlogCategoryController.getAllBlogCategories);
router.get('/:id', blogCategory_controller_1.BlogCategoryController.getSingleBlogCategory);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), blogCategory_controller_1.BlogCategoryController.updateBlogCategory);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), blogCategory_controller_1.BlogCategoryController.deleteBlogCategory);
exports.BlogCategoryRoutes = router;
