import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    //  đang dùng link từ file .env để bảo mật dự án
    await mongoose.connect(process.env.MONGO_URI);
    console.log("--- Team QuizzMaster đã kết nối Database thành công! ---");
  } catch (error) {
    console.error("Lỗi rồi, kiểm tra lại mạng hoặc pass nhé:", error);
  }
};