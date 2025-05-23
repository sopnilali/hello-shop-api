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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const blog_service_1 = require("./blog.service");
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogService.createBlog(req);
    res.status(200).json({
        success: true,
        message: "Blog created successfully",
        data: result
    });
});
const getAllBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogService.getAllBlog();
    res.status(200).json({
        success: true,
        message: "Blogs fetched successfully",
        data: result
    });
});
const getSingleBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogService.getSingleBlog(req.params.id);
    res.status(200).json({
        success: true,
        message: "Blog fetched successfully",
        data: result
    });
});
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogService.updateBlog(req.params.id, req);
    res.status(200).json({
        success: true,
        message: "Blog updated successfully",
        data: result
    });
});
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogService.deleteBlog(req.params.id);
    res.status(200).json({
        success: true,
        message: "Blog deleted successfully",
        data: result
    });
});
const editorUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogService.editorUpload(req);
    res.status(200).json({
        success: true,
        message: "Editor upload successfully",
        data: result
    });
});
exports.BlogController = { createBlog, getAllBlog, getSingleBlog, updateBlog, deleteBlog, editorUpload };
