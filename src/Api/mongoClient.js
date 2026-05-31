import mongoose from 'mongoose';

// Lưu trữ biến db ở đây để dùng bất cứ đâu
let dbInstance = null;

const connectDatabase = async () => {
    if (mongoose.connection.readyState === 1) {
        dbInstance = mongoose.connection.db;
        return;
    }

    console.log("🚀 Đang kết nối Database...");
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'QuizzMaster',
        serverSelectionTimeoutMS: 5000,
        family: 4
    });

    dbInstance = mongoose.connection.db; // Lưu lại kết nối ngay khi thành công
    console.log("✅ Kết nối Database thành công!");
     console.log("✅ Đã kết nối tới Database tên là:", mongoose.connection.name);
};

// Hàm lấy db an toàn
const getDb = () => {
    if (!dbInstance) throw new Error("Database chưa sẵn sàng!");
    return dbInstance;
   
};

export { mongoose, connectDatabase, getDb };