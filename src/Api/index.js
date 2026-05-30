import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDatabase } from './mongoClient.js';
import mongoose from 'mongoose';
import apiRouter from './routes.js';

console.log("🔥 ĐANG CHẠY ĐÚNG FILE INDEX.JS NÀY!");
//mongoose.set('bufferCommands', false);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));


 app.use('/api', apiRouter);
const startServer = async () => {
    try {
        // CHẶN MỌI THỨ CHO ĐẾN KHI KẾT NỐI XONG
        await connectDatabase();
        
        console.log("🚀 Mọi thứ sẵn sàng, đang khởi động Server...");
        const { default: apiRouter } = await import('./routes.js');
     
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server đã sẵn sàng tại http://localhost:${PORT}`));
       
    } catch (err) {
        console.error("❌ Lỗi nghiêm trọng, dừng server:", err);
        process.exit(1); // Dừng hoàn toàn để bạn không phải đợi lâu
    }
};
startServer();