import express from 'express';
import { connectDatabase } from './mongoClient.js';
import { register, login, getMe } from '../backend/Controller/authController.js';
import { getGameQuestions } from '../backend/Service/gameLogicService.js';
import { processGameOver, getLeaderboard } from '../backend/Service/scoreService.js';
import { verifyToken, isAdmin } from '../backend/Middleware/authMiddleware.js';
import { addQuestion } from '../backend/Service/questionService.js';

// ⚙️ KHỞI TẠO EXPRESS APP TRƯỚC TIÊN
const app = express();
app.use(express.json()); // Phải đặt TRƯỚC khi đăng ký routes để req.body hoạt động

const router = express.Router();

// Kết nối MongoDB Atlas khi server khởi động
connectDatabase();

// ------------------------------------------
// 🔐 XÁC THỰC (ĐĂNG KÝ / ĐĂNG NHẬP)
// ------------------------------------------
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', verifyToken, getMe);

// ------------------------------------------
// 🎮 TRÒ CHƠI & CÂU HỎI
// ------------------------------------------
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

router.post('/game/questions/add', verifyToken, isAdmin, async (req, res) => {
    try {
        const { gameType, questionText, imageName, imageUrl, options, correctAnswer, category, difficulty, pairs, rewards } = req.body;
        if (!gameType || !correctAnswer || !category) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc (gameType, correctAnswer, category)!" });
        }
        const newQuestion = await addQuestion({
            gameType, questionText, imageName, imageUrl,
            options, correctAnswer, category, difficulty, pairs, rewards
        });
        res.status(201).json({ message: "🎉 Câu hỏi đã được Admin thêm thành công!", data: newQuestion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 🏆 ĐIỂM SỐ & BẢNG XẾP HẠNG
// ------------------------------------------
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

router.get('/game/leaderboard', async (req, res) => {
    try {
        const leaderboardData = await getLeaderboard();
        res.status(200).json(leaderboardData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// ⚙️ KHỞI CHẠY SERVER
// ------------------------------------------
app.use('/api', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});

export default router;
