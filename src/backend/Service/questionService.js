import Question from '../Model/Question.js';
import { BaseRepository } from '../Repositories/baseRepository.js';

const questionRepo = new BaseRepository(Question);

// Thêm câu hỏi mới (với validation từ thao_quizz)
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

// Lấy danh sách các loại game khác nhau (cho ExploreScreen)
export const getQuizList = async () => {
    try {
        // Nhóm theo gameType, đếm số câu hỏi mỗi loại
        const groups = await Question.aggregate([
            {
                $group: {
                    _id: '$gameType',
                    count: { $sum: 1 },
                    categories: { $addToSet: '$category' },
                    latestCreated: { $max: '$createdAt' }
                }
            },
            { $sort: { count: -1 } }
        ]);
        return groups;
    } catch (error) {
        throw new Error("Lỗi lấy danh sách quiz: " + error.message);
    }
};

// Lấy danh sách bộ câu hỏi theo category (cho CategoryScreen)
export const getQuizzesByCategory = async (category) => {
    try {
        const groups = await Question.aggregate([
            { $match: { category: category } },
            {
                $group: {
                    _id: '$gameType',
                    count: { $sum: 1 },
                    category: { $first: '$category' },
                    latestCreated: { $max: '$createdAt' }
                }
            },
            { $sort: { count: -1 } }
        ]);
        return groups;
    } catch (error) {
        throw new Error("Lỗi lấy quiz theo category: " + error.message);
    }
};

// Lấy tất cả category có trong DB
export const getAllCategories = async () => {
    try {
        const categories = await Question.distinct('category');
        return categories;
    } catch (error) {
        throw new Error("Lỗi lấy danh sách category: " + error.message);
    }
};

export const getAllQuestions = async () => {
    try {
        return await Question.find()
            .sort({ createdAt: -1 })
            .select('gameType category questionText difficulty createdAt');
    } catch (error) {
        throw new Error("Lỗi lấy danh sách câu hỏi: " + error.message);
    }
};

// Xóa câu hỏi theo ID
export const deleteQuestion = async (id) => {
    return await questionRepo.delete(id);
};
