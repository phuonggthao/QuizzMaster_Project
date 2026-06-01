import express from 'express';
import { ObjectId } from 'mongodb'; // Import ObjectId đúng cách
import { register, login, getMe } from '../backend/Controller/authController.js';
import { getGameQuestions } from '../backend/Service/gameLogicService.js';
import { processGameOver, getGlobalLeaderboard } from '../backend/Service/scoreService.js';
import { verifyToken, isAdmin } from '../backend/Middleware/authMiddleware.js';
import { addQuestion } from '../backend/Service/questionService.js';
import upload from '../backend/Middleware/uploadCloudinary.js';
import { getDb } from './mongoClient.js';

const router = express.Router();

// --- Auth Routes ---
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', verifyToken, getMe);

// --- Game Routes ---
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

router.post('/game/game-over', verifyToken, async (req, res) => {
    try {
        const result = await processGameOver(req.user.id, req.body.gameType, req.body.correctAnswersCount);
        res.status(200).json(result);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- Score & Leaderboard Routes ---
router.get('/leaderboard/global', async (req, res) => {
    try {
        const topPlayers = await getGlobalLeaderboard();
        res.status(200).json(topPlayers);
    } catch (error) {
        res.status(500).json({ message: "Không thể lấy bảng xếp hạng", error: error.message });
    }
});

// Update score dùng Token
router.post('/auth/update-score', verifyToken, async (req, res) => {
    try {
        const { score } = req.body;
        const db = getDb();
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(req.user.id) }, 
            { $inc: { highScore: score } }
        );
        res.status(200).json({ message: "Cập nhật điểm thành công!", result });
    } catch (error) {
        res.status(500).json({ error: "Không thể lưu điểm: " + error.message });
    }
});

// Save score công khai (ví dụ dùng username)
router.post('/game/score', async (req, res) => {
    try {
        const { username, gameType, score } = req.body;
        if (!username) return res.status(400).json({ error: "Thiếu thông tin username!" });

        const db = getDb();
        const result = await db.collection('scores').insertOne({
            username, gameType, score, createdAt: new Date()
        });
        res.status(200).json({ message: "Lưu điểm thành công!", id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: "Không thể lưu điểm: " + error.message });
    }
});

export default router;