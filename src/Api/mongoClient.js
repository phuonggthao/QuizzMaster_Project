import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Kích hoạt dotenv để đọc file .env
dotenv.config();

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
    console.error("❌ Lỗi rồi, kiểm tra lại mạng hoặc pass nhé:", error.message);
  }
};