import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import config from "../config";
import { ICloudinaryResponse, IFile } from "../interface/file.type";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const isVercel = process.env.VERCEL === '1';
const uploadPath = isVercel ? '/tmp' : path.join(process.cwd(), 'tmp');

// Ensure upload directory exists
const ensureUploadPathExists = () => {
  if (!isVercel && !fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};

ensureUploadPathExists();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for different upload scenarios
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // For text editor/TapTap editor uploads, we might want to accept more file types
  const isEditorUpload = req.path.includes('/editor-upload');
  
  if (isEditorUpload) {
    // Accept images, videos, and documents for editor uploads
    const allowedEditorTypes = /\.(jpg|jpeg|png|webp|gif|svg|mp4|mov|avi|pdf|doc|docx|xls|xlsx|ppt|pptx)$/i;
    if (!file.originalname.match(allowedEditorTypes)) {
      return cb(new Error('Only image, video, and document files are allowed for editor uploads!'));
    }
  } else {
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
  return multer({
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

const uploadToCloudinary = async (file: IFile, resourceType: 'image' | 'video' | 'auto' = 'auto'): Promise<ICloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: resourceType,
      folder: resourceType === 'image' ? 'editor-images' : 'documents',
    };

    cloudinary.uploader.upload(file.path, uploadOptions, (err, result) => {
      // Clean up temp file
      fs.unlink(file.path, (unlinkError) => {
        if (unlinkError) console.error('Error deleting temp file:', unlinkError);
      });

      if (err) {
        console.error('Cloudinary upload error:', err);
        reject(new Error(`Failed to upload file to Cloudinary: ${err.message}`));
      } else if (!result) {
        reject(new Error('Cloudinary upload returned no result'));
      } else {
        resolve(result);
      }
    });
  });
};

// Special upload handler for editor files (returns formatted response for editors)
const uploadEditorFileToCloudinary = async (file: IFile) => {
  try {
    const result = await uploadToCloudinary(file, 'auto');

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
  } catch (error) {
    console.error('Editor upload error:', error);
    return {
      success: 0,
      message: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

export const FileUploader = {
  upload, // Regular file upload middleware
  editorUpload, // Special middleware for editor uploads
  uploadToCloudinary, // Regular Cloudinary upload
  uploadEditorFileToCloudinary, // Special handler for editor files
};

// Additional TypeScript interfaces for editor upload responses
declare global {
  namespace Express {
    interface Request {
      editorFiles?: Array<{
        url: string;
        size: number;
        name: string;
        type: string;
      }>;
    }
  }
}