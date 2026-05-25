import Question from '../Model/Question.js'; // Import từ file Model vừa tạo ở Bước 1
import { BaseRepository } from '../Repositories/baseRepository.js';

const questionRepo = new BaseRepository(Question);

// Hàm export chuẩn để file API có thể gọi được
export const addQuestion = async (data) => {
    return await questionRepo.create(data);
};