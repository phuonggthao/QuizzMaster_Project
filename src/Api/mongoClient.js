import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDatabase = async () => {
    try {
        const uri = process.env.MONGO_URI;
        
        // Tùy chọn "trần trụi" nhất - không ép bất cứ thứ gì
        const options = {
            serverSelectionTimeoutMS: 10000, 
           
        };

        console.log("📍 Đang kết nối tới MongoDB...");
        // Bỏ await để tránh nó treo ở bước connect
        mongoose.connect(uri, options);

        // Lắng nghe sự kiện kết nối để biết nó thực sự "sống" hay không
        mongoose.connection.on('connected', () => console.log("✅ MongoDB đã kết nối!"));
        mongoose.connection.on('error', (err) => console.error("❌ MongoDB lỗi kết nối:", err));

    } catch (error) {
        console.error("❌ Lỗi cấu hình:", error.message);
    }
};