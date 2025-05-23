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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const fileUploader_1 = require("../../helper/fileUploader");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createBlog = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadfile = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.thumbnail = uploadfile === null || uploadfile === void 0 ? void 0 : uploadfile.secure_url;
    }
    const result = yield prisma_1.default.blog.create({
        data: Object.assign(Object.assign({}, req.body), { userId: req.user.id })
    });
    return result;
});
const getAllBlog = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.findMany({
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    profilePhoto: true,
                }
            },
            category: {
                select: {
                    name: true,
                    description: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return result;
});
const getSingleBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    profilePhoto: true,
                }
            },
            category: {
                select: {
                    name: true,
                    description: true,
                }
            }
        }
    });
    return result;
});
const updateBlog = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadfile = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.thumbnail = uploadfile === null || uploadfile === void 0 ? void 0 : uploadfile.secure_url;
    }
    const result = yield prisma_1.default.blog.update({
        where: { id },
        data: req.body
    });
    return result;
});
const deleteBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.delete({
        where: { id }
    });
    return result;
});
const editorUpload = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fileUploader_1.FileUploader.uploadEditorFileToCloudinary(req.file);
    return result;
});
exports.BlogService = {
    createBlog,
    getAllBlog,
    getSingleBlog,
    updateBlog,
    deleteBlog,
    editorUpload
};
