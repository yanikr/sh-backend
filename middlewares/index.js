import multer from 'multer';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMiddleware = upload.array('Images', 5);
