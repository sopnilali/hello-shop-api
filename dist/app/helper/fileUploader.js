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
exports.FileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloud_name,
    api_key: config_1.default.cloudinary.api_key,
    api_secret: config_1.default.cloudinary.api_secret,
});
const isVercel = process.env.VERCEL === '1';
const uploadPath = isVercel ? '/tmp' : path_1.default.join(process.cwd(), 'tmp');
// Ensure upload directory exists
const ensureUploadPathExists = () => {
    if (!isVercel && !fs_1.default.existsSync(uploadPath)) {
        fs_1.default.mkdirSync(uploadPath, { recursive: true });
    }
};
ensureUploadPathExists();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
// File filter for different upload scenarios
const fileFilter = (req, file, cb) => {
    // For text editor/TapTap editor uploads, we might want to accept more file types
    const isEditorUpload = req.path.includes('/editor-upload');
    if (isEditorUpload) {
        // Accept images, videos, and documents for editor uploads
        const allowedEditorTypes = /\.(jpg|jpeg|png|webp|gif|svg|mp4|mov|avi|pdf|doc|docx|xls|xlsx|ppt|pptx)$/i;
        if (!file.originalname.match(allowedEditorTypes)) {
            return cb(new Error('Only image, video, and document files are allowed for editor uploads!'));
        }
    }
    else {
        // Standard file upload restrictions
        const allowedFileTypes = /\.(jpg|jpeg|png|webp|gif|pdf|doc|docx|xls|xlsx|ppt|pptx)$/i;
        if (!file.originalname.match(allowedFileTypes)) {
            return cb(new Error('Only image, PDF, and Office document files are allowed!'));
        }
    }
    cb(null, true);
};
// Configure multer with different options for editor vs regular uploads
const createUploadMiddleware = (isEditorUpload = false) => {
    return (0, multer_1.default)({
        storage,
        limits: {
            fileSize: isEditorUpload ? 20 * 1024 * 1024 : 10 * 1024 * 1024, // 20MB for editor, 10MB otherwise
            files: isEditorUpload ? 10 : 5 // More files allowed for editor
        },
        fileFilter
    });
};
// Regular file upload middleware
const upload = createUploadMiddleware(false);
// Editor-specific upload middleware (for TapTap editor or similar)
const editorUpload = createUploadMiddleware(true);
const uploadToCloudinary = (file_1, ...args_1) => __awaiter(void 0, [file_1, ...args_1], void 0, function* (file, resourceType = 'auto') {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            resource_type: resourceType,
            folder: resourceType === 'image' ? 'editor-images' : 'documents',
        };
        cloudinary_1.v2.uploader.upload(file.path, uploadOptions, (err, result) => {
            // Clean up temp file
            fs_1.default.unlink(file.path, (unlinkError) => {
                if (unlinkError)
                    console.error('Error deleting temp file:', unlinkError);
            });
            if (err) {
                console.error('Cloudinary upload error:', err);
                reject(new Error(`Failed to upload file to Cloudinary: ${err.message}`));
            }
            else if (!result) {
                reject(new Error('Cloudinary upload returned no result'));
            }
            else {
                resolve(result);
            }
        });
    });
});
// Special upload handler for editor files (returns formatted response for editors)
const uploadEditorFileToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield uploadToCloudinary(file, 'auto');
        // Format response according to TapTap editor's expected format
        return {
            success: 1,
            file: {
                url: result.secure_url,
                // Additional metadata that might be useful for the editor
                size: result.bytes,
                name: file.originalname,
                type: result.resource_type,
                width: result.width,
                height: result.height,
            }
        };
    }
    catch (error) {
        console.error('Editor upload error:', error);
        return {
            success: 0,
            message: error instanceof Error ? error.message : 'Upload failed'
        };
    }
});
exports.FileUploader = {
    upload, // Regular file upload middleware
    editorUpload, // Special middleware for editor uploads
    uploadToCloudinary, // Regular Cloudinary upload
    uploadEditorFileToCloudinary, // Special handler for editor files
};
