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
exports.BrandService = void 0;
const fileUploader_1 = require("../../helper/fileUploader");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createBrand = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const results = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.logo = results === null || results === void 0 ? void 0 : results.secure_url;
    }
    const result = yield prisma_1.default.brand.create({
        data: req.body
    });
    return result;
});
const getAllBrands = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.brand.findMany();
    return result;
});
const getSingleBrand = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.brand.findUnique({
        where: {
            id
        }
    });
    return result;
});
const updateBrand = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const results = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.logo = results === null || results === void 0 ? void 0 : results.secure_url;
    }
    const result = yield prisma_1.default.brand.update({
        where: {
            id: req.params.id
        },
        data: req.body
    });
    return result;
});
const deleteBrand = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.brand.delete({
        where: {
            id
        }
    });
    return result;
});
exports.BrandService = {
    createBrand,
    getAllBrands,
    getSingleBrand,
    updateBrand,
    deleteBrand,
};
