import mongoose from 'mongoose';
<<<<<<< Updated upstream

export const connectDatabase = async () => {
  try {
    //  đang dùng link từ file .env để bảo mật dự án
    await mongoose.connect(process.env.MONGO_URI);
    console.log("--- Team QuizzMaster đã kết nối Database thành công! ---");
  } catch (error) {
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
  }
};
