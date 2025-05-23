"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middleware/auth"));
const blog_controller_1 = require("./blog.controller");
const express_1 = require("express");
const fileUploader_1 = require("../../helper/fileUploader");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), fileUploader_1.FileUploader.upload.single('thumbnail'), (req, res) => {
    req.body = JSON.parse(req.body.data);
    blog_controller_1.BlogController.createBlog(req, res);
});
router.get('/', blog_controller_1.BlogController.getAllBlog);
router.get('/:id', blog_controller_1.BlogController.getSingleBlog);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), fileUploader_1.FileUploader.upload.single('thumbnail'), (req, res) => {
    req.body = JSON.parse(req.body.data);
    blog_controller_1.BlogController.updateBlog(req, res);
});
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), blog_controller_1.BlogController.deleteBlog);
router.post('/editor-upload', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SELLER), fileUploader_1.FileUploader.editorUpload.single('file'), blog_controller_1.BlogController.editorUpload);
exports.BlogRoutes = router;
