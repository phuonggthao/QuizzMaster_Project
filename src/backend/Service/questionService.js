import Question from '../Model/Question.js';
import { BaseRepository } from '../Repositories/baseRepository.js';

const questionRepo = new BaseRepository(Question);

export const addQuestion = async (data) => {
    try {
        // 1. Chuẩn hóa dữ liệu đầu vào (phòng trường hợp Client gửi dư thừa)
        const questionData = {
            gameType: data.gameType,
            category: data.category,
            questionText: data.questionText,
            image: {
                name: data.imageName || null,
                url: data.imageUrl || null
            },
            options: Array.isArray(data.options) ? data.options : JSON.parse(data.options || "[]"),
            correctAnswer: data.correctAnswer,
            difficulty: data.difficulty || 'Easy',
            pairs: data.pairs || [],
            rewards: data.rewards || []
        };

        // 2. Validate dữ liệu tối thiểu trước khi lưu
        if (!questionData.gameType || !questionData.correctAnswer) {
            throw new Error("Dữ liệu thiếu: gameType và correctAnswer là bắt buộc!");
        }

        // 3. Sử dụng repo để tạo
        return await questionRepo.create(questionData);
    } catch (error) {
        console.error("❌ Lỗi tại Question Service:", error.message);
        throw error; // Ném lỗi ra Controller để Controller gửi response lỗi về cho App
    }
};