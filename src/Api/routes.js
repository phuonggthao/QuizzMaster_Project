import express from 'express';
import { register, login, getMe } from '../backend/Controller/authController.js';
import { getGameQuestions } from '../backend/Service/gameLogicService.js';
import { processGameOver, getGlobalLeaderboard, getUserHistory, getUserStats, getReportStats } from '../backend/Service/scoreService.js';
import { verifyToken, isAdmin } from '../backend/Middleware/authMiddleware.js';
import { addQuestion, getAllQuestions, deleteQuestion, getQuizList, getAllCategories, getQuizzesByCategory } from '../backend/Service/questionService.js';
import upload from '../backend/Middleware/uploadCloudinary.js';
import User from '../backend/Model/User.js';

console.log("✅ Routes đã được nạp!");
const router = express.Router();

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', verifyToken, getMe);

// ── Game ──────────────────────────────────────────────────────────────────────
router.get('/game/questions/:gameType', verifyToken, async (req, res) => {
    try {
        const questions = await getGameQuestions(req.params.gameType);
        res.status(200).json(questions || []);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/game/questions/add', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const questionData = { ...req.body, imageUrl: req.file ? req.file.path : null };
        const newQuestion = await addQuestion(questionData);
        res.status(201).json({ message: "🎉 Đã thêm câu hỏi!", data: newQuestion });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// FIX #1: Lấy username từ DB thay vì truyền ObjectId vào processGameOver
router.post('/game/game-over', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username').lean();
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
        const result = await processGameOver(user.username, req.body.gameType, req.body.correctAnswersCount, req.body.score);
        res.status(200).json(result);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ── Manage routes (Admin only) ────────────────────────────────────────────────
router.get('/manage/questions', verifyToken, isAdmin, async (req, res) => {
    try {
        const questions = await getAllQuestions();
        res.status(200).json(questions);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/manage/questions/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const deleted = await deleteQuestion(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
        res.status(200).json({ message: '✅ Đã xóa câu hỏi thành công' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ── Report routes (Admin only) ────────────────────────────────────────────────
router.get('/report/stats', verifyToken, isAdmin, async (req, res) => {
    try {
        const stats = await getReportStats();
        res.status(200).json(stats);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ── User routes ───────────────────────────────────────────────────────────────
router.get('/user/history', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username').lean();
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
        const history = await getUserHistory(user.username);
        res.status(200).json(history);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// FIX #3: /user/stats dùng username (khớp với Score model)
router.get('/user/stats', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username').lean();
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
        const stats = await getUserStats(user.username);
        res.status(200).json(stats);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Upload avatar
router.put('/user/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Không có file ảnh được gửi lên' });
        const avatarUrl = req.file.path; // Cloudinary trả về URL đầy đủ qua req.file.path
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { avatar: avatarUrl },
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ message: 'Không tìm thấy user' });
        res.status(200).json({ message: 'Cập nhật avatar thành công', avatar: avatarUrl });
    } catch (error) { res.status(500).json({ error: error.message }); }
});
// ── Leaderboard ───────────────────────────────────────────────────────────────
router.get('/leaderboard/global', async (req, res) => {
    try {
        const topPlayers = await getGlobalLeaderboard();
        res.status(200).json(topPlayers);
    } catch (error) {
        res.status(500).json({ message: "Không thể lấy bảng xếp hạng", error: error.message });
    }
});

// FIX #5: Alias cho LeaderboardScreen đang gọi /game/leaderboard
router.get('/game/leaderboard', async (req, res) => {
    try {
        const topPlayers = await getGlobalLeaderboard();
        res.status(200).json(topPlayers);
    } catch (error) {
        res.status(500).json({ message: "Không thể lấy bảng xếp hạng", error: error.message });
    }
});

// ── Explore ───────────────────────────────────────────────────────────────────
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

router.get('/test', (req, res) => res.json({ message: "Server chạy tốt!" }));

export default router;
