import mongoose from 'mongoose';
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
import dotenv from 'dotenv';

// Kích hoạt dotenv để đọc file .env
dotenv.config();
>>>>>>> main

export const connectDatabase = async () => {
  try {
    // Đảm bảo MONGO_URI trong file .env đã thay <db_password> bằng 123456ABC
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      throw new Error("Chưa tìm thấy MONGO_URI trong file .env !");
    }
    console.log("Chuỗi URI đang đọc là:", uri);
    await mongoose.connect(uri);
    console.log("--- Team QuizzMaster đã kết nối Database thành công! ---");
  } catch (error) {
<<<<<<< HEAD
    console.error("Lỗi rồi, kiểm tra lại mạng hoặc pass nhé:", error);
=======
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Tính đường dẫn tuyệt đối đến file .env ở thư mục gốc dự án
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const connectDatabase = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      throw new Error("Chưa tìm thấy MONGO_URI trong file .env !");
    }

    await mongoose.connect(uri);
    console.log("✅ Team QuizzMaster đã kết nối Database thành công!");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
    process.exit(1); // Dừng server nếu không kết nối được DB
>>>>>>> Stashed changes
=======
    console.error("❌ Lỗi rồi, kiểm tra lại mạng hoặc pass nhé:", error.message);
>>>>>>> main
  }
};
