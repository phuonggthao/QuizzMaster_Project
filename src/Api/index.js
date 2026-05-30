import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './mongoClient.js';
import { register, login, getMe } from '../backend/Controller/authController.js';
import { getGameQuestions } from '../backend/Service/gameLogicService.js';
import { processGameOver, getLeaderboard } from '../backend/Service/scoreService.js';
import { verifyToken, isAdmin } from '../backend/Middleware/authMiddleware.js';
import { addQuestion } from '../backend/Service/questionService.js';
import upload from '../backend/Middleware/uploadCloudinary.js';

dotenv.config();

const app = express();
const router = express.Router();

// Middleware toàn cục
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Hỗ trợ nhận dữ liệu từ form

// ------------------------------------------
// 🔐 HỆ THỐNG XÁC THỰC
// ------------------------------------------
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', verifyToken, getMe);

// ------------------------------------------
// 🎮 HỆ THỐNG TRÒ CHƠI
// ------------------------------------------
router.get('/game/questions/:gameType', verifyToken, async (req, res) => {
    try {
        const questions = await getGameQuestions(req.params.gameType);
        res.status(200).json(questions || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/game/questions/add', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const newQuestion = await addQuestion({ ...req.body, imageName: req.file?.path });
        res.status(201).json({ message: "🎉 Câu hỏi đã được thêm!", data: newQuestion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ------------------------------------------
// 🏆 HỆ THỐNG ĐIỂM SỐ
// ------------------------------------------
router.post('/game/game-over', async (req, res) => {
    try {
        const { userId, gameType, correctAnswersCount } = req.body;
        const result = await processGameOver(userId, gameType, correctAnswersCount);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/game/leaderboard', async (req, res) => {
    try {
        res.status(200).json(await getLeaderboard());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Gắn router vào app
app.use('/api', router);

// Khởi chạy server
const startServer = async () => {
    await connectDatabase();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server chạy trên cổng ${PORT}`));
};

startServer();