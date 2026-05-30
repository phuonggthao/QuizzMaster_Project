import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Cấu hình Cloudinary (đảm bảo bạn đã có các biến này trong .env)
cloudinary.config({
  cloud_name: process.env. ddbedajz0,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'quizz_master',
    format: async (req, file) => 'png', 
    public_id: (req, file) => Date.now().toString(),
  },
});

const upload = multer({ storage: storage });

export default upload;