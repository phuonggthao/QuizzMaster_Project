import express from 'express';
import { register, login, getMe } from '../backend/Controller/authController.js';
import { getGameQuestions } from '../backend/Service/gameLogicService.js';
import { processGameOver, getGlobalLeaderboard, getUserHistory, getUserStats, getReportStats } from '../backend/Service/scoreService.js';
import { verifyToken, isAdmin } from '../backend/Middleware/authMiddleware.js';
import { addQuestion, getAllQuestions, deleteQuestion } from '../backend/Service/questionService.js';
import upload from '../backend/Middleware/uploadCloudinary.js';
import { getDb } from './mongoClient.js';
import User from '../backend/Model/User.js';

console.log("✅ Routes đã được nạp!");
const router = express.Router();

// Auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', verifyToken, getMe);

// Game
router.get('/game/questions/:gameType', verifyToken, async (req, res) => {
    console.log("Đã nhận request tại:", new Date().toLocaleTimeString());
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
router.post('/game/game-over', verifyToken, async (req, res) => {
    try {
        const result = await processGameOver(req.user.id, req.body.gameType, req.body.correctAnswersCount);
        res.status(200).json(result);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ── Manage routes (Admin only) ────────────────────────────────────────────────
// Lấy tất cả câu hỏi — chỉ Admin
router.get('/manage/questions', verifyToken, isAdmin, async (req, res) => {
    try {
        const questions = await getAllQuestions();
        res.status(200).json(questions);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Xóa câu hỏi theo ID — chỉ Admin
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

// ── User routes (đã đăng nhập) ────────────────────────────────────────────────
// Lịch sử chơi của user hiện tại
router.get('/user/history', verifyToken, async (req, res) => {
    try {
        // req.user.id là _id từ JWT, cần lấy username
        const user = await User.findById(req.user.id).select('username').lean();
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
        const history = await getUserHistory(user.username);
        res.status(200).json(history);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Thống kê tổng hợp của user hiện tại
router.get('/user/stats', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username').lean();
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
        const stats = await getUserStats(user.username);
        res.status(200).json(stats);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/leaderboard/global', async (req, res) => {
    try {
        const topPlayers = await getGlobalLeaderboard(); // Dùng tên hàm mới
        res.status(200).json(topPlayers);
    } catch (error) {
        res.status(500).json({ message: "Không thể lấy bảng xếp hạng", error: error.message });
    }
});
router.get('/test', (req, res) => res.json({ message: "Server chạy tốt!" }));


router.post('/game/score', async (req, res) => {
    try {
        // Nhận username thay vì userId
        const { username, gameType, score } = req.body;
        
        console.log(`📥 Nhận dữ liệu điểm: Username ${username}, Game ${gameType}, Score ${score}`);

        if (!username) {
            return res.status(400).json({ error: "Thiếu thông tin username!" });
        }

router.post('/auth/update-score', verifyToken, async (req, res) => {
    try {
        // req.user.id được lấy từ verifyToken (middleware)
        const { score } = req.body; 
        
        console.log(`📥 Nhận dữ liệu điểm: UserID ${req.user.id}, Score ${score}`);

        const db = getDb();
        // Cập nhật điểm vào collection 'users' hoặc 'scores' tùy theo DB của bạn
        // Ở đây tôi dùng ví dụ update vào collection users
        const result = await db.collection('users').updateOne(
            { _id: new require('mongodb').ObjectId(req.user.id) }, 
            { $inc: { highScore: score } } // Cộng dồn điểm
        );

        res.status(200).json({ message: "Cập nhật điểm thành công!", result });
    } catch (error) {
        res.status(500).json({ error: "Không thể lưu điểm: " + error.message });
    }
});

        const db = getDb(); // Lấy DB đã kết nối
        const result = await db.collection('scores').insertOne({
            username, // Lưu bằng username
            gameType,
            score,
            createdAt: new Date()
        });

        res.status(200).json({ message: "Lưu điểm thành công!", id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: "Không thể lưu điểm: " + error.message });
    }
});
export default router;