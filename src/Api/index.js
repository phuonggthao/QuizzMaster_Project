import express from 'express';
import { connectDatabase } from './mongoClient.js';
import { register, login } from '../backend/Controller/authController.js';
import { getRandomQuestions } from '../backend/Service/questionService.js';

const router = express.Router();

// Kết nối DB khi API khởi động
connectDatabase();

// Route cho Nhung làm Auth
router.post('/auth/register', register);
router.post('/auth/login', login);

// Route cho Vinh làm Game
router.get('/questions/:category', async (req, res) => {
    const questions = await getRandomQuestions(req.params.category);
    res.json(questions);
});

export default router;