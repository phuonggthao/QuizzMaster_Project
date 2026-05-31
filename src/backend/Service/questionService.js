import Question from '../Model/Question.js';
import { BaseRepository } from '../Repositories/baseRepository.js';

const questionRepo = new BaseRepository(Question);

export const addQuestion = async (data) => {
    try {
        // 1. Xử lý options: Đảm bảo luôn là mảng (Array)
        let parsedOptions = [];
        try {
            parsedOptions = typeof data.options === 'string' 
                ? JSON.parse(data.options) 
                : (Array.isArray(data.options) ? data.options : []);
        } catch (e) {
            console.error("❌ Lỗi parse options:", e);
        }

        // 2. Chuẩn hóa dữ liệu với cấu trúc ảnh từ Cloudinary
        const questionData = {
            gameType: data.gameType,
            category: data.category,
            questionText: data.questionText,
            image: {
                name: data.imageName || 'question_image',
                url: data.imageUrl || null // Nhận URL từ Controller gửi qua
            },
            options: parsedOptions,
            correctAnswer: data.correctAnswer,
            difficulty: data.difficulty || 'Easy',
            pairs: data.pairs || [],
            rewards: data.rewards || []
        };

        // 3. Log kiểm tra dữ liệu trước khi lưu vào Database
        console.log("📥 Dữ liệu chuẩn bị lưu vào MongoDB:", JSON.stringify(questionData, null, 2));

        // 4. Validate bắt buộc
        if (!questionData.gameType || !questionData.correctAnswer) {
            throw new Error("Thiếu trường bắt buộc: gameType hoặc correctAnswer!");
        }

        // 5. Lưu vào database
        return await questionRepo.create(questionData);

    } catch (error) {
        console.error("❌ Lỗi tại Question Service:", error.message);
        throw error;
    }
};