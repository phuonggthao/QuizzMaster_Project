import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Thiết lập các biến đường dẫn
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trỏ đường dẫn về file .env nằm ở thư mục gốc (E:\QuizzMaster_Project)
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Kiểm tra xem đã load được .env chưa
console.log("📍 Đang đọc file .env tại:", envPath);
console.log("🔑 MONGO_URI trạng thái:", process.env.MONGO_URI ? "Đã tìm thấy!" : "CHƯA TÌM THẤY!");

export const connectDatabase = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("Không tìm thấy MONGO_URI trong file .env! Hãy kiểm tra lại.");
    }

    // Kết nối với MongoDB kèm cấu hình timeout an toàn
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000, 
    });

    console.log("✅ Team QuizzMaster đã kết nối Database thành công!");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
    process.exit(1); // Dừng app nếu không kết nối được DB
  }
};