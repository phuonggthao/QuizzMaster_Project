import express from 'express';
import mongoose from 'mongoose';
import User from '../backend/Model/User.js'; // Import Model User thật
import { connectDatabase } from './mongoClient.js';
import { register, login, getMe } from '../backend/Controller/authController.js';
import { GameLogics, getGameQuestions } from '../backend/Service/gameLogicService.js';
import { processGameOver, getLeaderboard } from '../backend/Service/scoreService.js';
import { verifyToken, isAdmin } from '../backend/Middleware/authMiddleware.js';
import bcrypt from 'bcryptjs'; // Đảm bảo khớp với thư viện bạn đã cài
import { addQuestion } from '../backend/Service/questionService.js'; // Import service mới

<<<<<<< HEAD
<<<<<<< Updated upstream
// 2. Kích hoạt kết nối (Chỉ cần 1 lần duy nhất tại đây)
=======
// ⚙️ KHỞI TẠO EXPRESS APP TRƯỚC TIÊN
const app = express();
app.use(express.json()); // Phải đặt TRƯỚC khi đăng ký routes để req.body hoạt động

const router = express.Router();

// Tự động kích hoạt kết nối MongoDB Atlas khi API khởi động
>>>>>>> Stashed changes
=======
const router = express.Router();

// Tự động kích hoạt kết nối MongoDB Atlas khi API khởi động
>>>>>>> main
connectDatabase();

// ------------------------------------------
// 🔐 HỆ THỐNG XÁC THỰC THẬT (ĐĂNG KÝ / ĐĂNG NHẬP)
// ------------------------------------------
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', verifyToken, getMe);
// ------------------------------------------
// 🎮 HỆ THỐNG TRÒ CHƠI & CÂU HỎI LOGIC
// ------------------------------------------
/**
 * API: Lấy mảng câu hỏi ngẫu nhiên khi người chơi click chọn 1 trò chơi cụ thể
 * Yêu cầu Đăng nhập: Có (Người chơi phải đăng nhập mới lấy được câu hỏi)
 */
router.get('/game/questions/:gameType', verifyToken, async (req, res) => {
    try {
        const { gameType } = req.params;
        const questions = await getGameQuestions(gameType);
        
        if (!questions || questions.length === 0) {
            return res.status(404).json({ message: `Chưa có câu hỏi nào thuộc trò chơi ${gameType} trên Database!` });
        }
        
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API dành riêng cho Admin để thêm câu hỏi (Đã được chuyển lên trên và cập nhật lưu dữ liệu thật)
router.post('/game/questions/add', verifyToken, isAdmin, async (req, res) => {
    try {
        const { gameType, questionText, imageName, options, correctAnswer, category, difficulty, pairs, rewards } = req.body;
        
        // Kiểm tra các trường bắt buộc theo Model của Thảo
        if (!gameType || !correctAnswer || !category) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc (gameType, correctAnswer, category)!" });
        }

<<<<<<< HEAD
<<<<<<< Updated upstream
// Ví dụ: Hàm xử lý đăng nhập cho Thảo/Nhung
export const loginUser = async (credentials) => {
   // Thảo gọi logic từ backend/Controller ở đây
};
=======
=======
>>>>>>> main
        // Gọi service lưu trực tiếp vào Database thông qua Repository
        const newQuestion = await addQuestion({
            gameType,
            questionText,
            imageName,
            options,
            correctAnswer,
            category,
            difficulty,
            pairs,
            rewards
        });

        res.status(201).json({ message: "🎉 Câu hỏi đã được Admin thêm thành công!", data: newQuestion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 🏆 HỆ THỐNG ĐIỂM SỐ & BẢNG XẾP HẠNG RANK
// ------------------------------------------
/**
 * API: Gọi lên khi người chơi bấm trả lời SAI hoặc HẾT 10 GIÂY đếm ngược
 */
router.post('/game/game-over', async (req, res) => {
    try {
        const { userId, gameType, correctAnswersCount } = req.body;
        
        if (correctAnswersCount === undefined || !gameType) {
            return res.status(400).json({ message: "Dữ liệu gửi lên bị thiếu trường bắt buộc!" });
        }

        const gameResult = await processGameOver(userId, gameType, correctAnswersCount);
        res.status(200).json(gameResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * API: Tải danh sách Top 10 người chơi đứng đầu hệ thống rank
 */
router.get('/game/leaderboard', async (req, res) => {
    try {
        const leaderboardData = await getLeaderboard();
        res.status(200).json(leaderboardData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// ⚙️ KHỞI CHẠY SERVER EXPRESS
// ------------------------------------------
<<<<<<< HEAD
=======
const app = express();
app.use(express.json());
>>>>>>> main

// Đăng ký toàn bộ router VÀO TRƯỚC khi app lắng nghe cổng
app.use('/api', router); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});

<<<<<<< HEAD
export default router;
>>>>>>> Stashed changes
=======
export default router;
>>>>>>> main
