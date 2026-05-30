import express from 'express';
import { connectDatabase } from './mongoClient.js';
import { register, login, getMe } from '../backend/Controller/authController.js';
import { getGameQuestions } from '../backend/Service/gameLogicService.js';
import { processGameOver, getLeaderboard, getUserHistory, getReportStats } from '../backend/Service/scoreService.js';
import { verifyToken, isAdmin } from '../backend/Middleware/authMiddleware.js';
import { addQuestion, getQuizList, getAllQuestions, deleteQuestion, getQuizzesByCategory, getAllCategories } from '../backend/Service/questionService.js';
import User from '../backend/Model/User.js';
import Score from '../backend/Model/Score.js';

// ⚙️ KHỞI TẠO EXPRESS APP TRƯỚC TIÊN
const app = express();
app.use(express.json());

// ✅ CORS — cho phép web browser và điện thoại gọi API
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

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
// 👤 PROFILE — Lịch sử chơi & Thống kê cá nhân
// ------------------------------------------
router.get('/user/history', verifyToken, async (req, res) => {
    try {
        const history = await getUserHistory(req.user.id);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/user/stats', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('fullName username highScore level tierName createdAt');
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        const totalPlays = await Score.countDocuments({ userId: req.user.id });
        const scores = await Score.find({ userId: req.user.id }).select('points');
        const totalPoints = scores.reduce((sum, s) => sum + (s.points || 0), 0);
        res.status(200).json({ user, totalPlays, totalPoints });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 🔍 EXPLORE — Danh sách quiz & danh mục
// ------------------------------------------
router.get('/explore/quizzes', async (req, res) => {
    try {
        const quizList = await getQuizList();
        res.status(200).json(quizList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/explore/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/explore/category/:category', async (req, res) => {
    try {
        const quizzes = await getQuizzesByCategory(req.params.category);
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// ⚙️ MANAGE — Quản lý câu hỏi (Admin)
// ------------------------------------------
router.get('/manage/questions', verifyToken, isAdmin, async (req, res) => {
    try {
        const questions = await getAllQuestions();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/manage/questions/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await deleteQuestion(req.params.id);
        res.status(200).json({ message: 'Đã xóa câu hỏi thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 📊 REPORT — Thống kê báo cáo (Admin)
// ------------------------------------------
router.get('/report/stats', verifyToken, isAdmin, async (req, res) => {
    try {
        const stats = await getReportStats();
        res.status(200).json(stats);
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
