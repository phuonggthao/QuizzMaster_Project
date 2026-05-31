import dotenv from 'dotenv';
dotenv.config();

console.log("--- DEBUG ENV ---");
console.log("URI:", process.env.MONGO_URI ? "ĐÃ LOAD ĐƯỢC" : "LỖI: KHÔNG TÌM THẤY");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Secret length:", process.env.CLOUDINARY_API_SECRET?.length);