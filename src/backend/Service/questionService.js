import Question from '../Model/Question.js';
import { BaseRepository } from '../Repositories/baseRepository.js';

const questionRepo = new BaseRepository(Question);

export const getRandomQuestions = async (category, limit = 10) => {
    // Sử dụng aggregate để lấy ngẫu nhiên câu hỏi từ MongoDB
    return await Question.aggregate([
        { $match: { category: category } },
        { $sample: { size: limit } }
    ]);
};