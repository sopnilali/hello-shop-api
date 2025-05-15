import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import config from "../config";
import { ICloudinaryResponse, IFile } from "../interface/file.type";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const isVercel = process.env.VERCEL === '1';
const uploadPath = isVercel ? '/tmp' : path.join(process.cwd(), 'tmp');

// Create local tmp folder if it doesn't exist
if (!isVercel && !fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Configure multer with file size limits
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp|gif|PNG|JPEG|JPG|GIF|WEBP)$/)) {
      return cb(new Error('Only image files are allowed!') as any, false);
    }
    cb(null, true);
  }
});

const uploadToCloudinary = async (file: IFile): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, (error: Error, result: ICloudinaryResponse) => {
      // Delete the file from tmp folder after upload, regardless of success or failure
      fs.unlink(file.path, (unlinkError) => {
        if (unlinkError) {
          console.error('Error deleting temp file:', unlinkError);
        }
      });

      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export const FileUploader = {
  upload,
  uploadToCloudinary,
};
