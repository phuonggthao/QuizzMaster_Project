// src/backend/Service/gameLogicService.js
import Question from '../Model/Question.js'; 
import mongoose from 'mongoose';
import { getDb } from '../../Api/mongoClient.js';

// Đối tượng chứa 10 logic xử lý trò chơi (Giữ nguyên cấu trúc cũ của Thảo)
export const GameLogics = {
    // 1. Quiz (MCQ): Kiểm tra đáp án trắc nghiệm
    checkQuiz: (userChoice, correctAnswer) => {
        if (!userChoice) return false;
        return userChoice.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    },

    // 2. Matching Pairs: Kiểm tra 2 thẻ có cùng cặp không
    isMatch: (card1, card2) => {
        if (!card1 || !card2) return false;
        return card1.pairId === card2.pairId && card1.id !== card2.id; // Tránh tự click chính nó
    },

    // 3. Lucky Number: Quay số ngẫu nhiên từ min đến max
    generateLuckyNumber: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    // 4. Flash cards: Lật thẻ học tập
    toggleCard: (isFlipped) => !isFlipped,

    // 5. Word Scramble: Xáo trộn từ (ĐÃ FIX LỖI HOÁN VỊ)
    scramble: (word) => {
        if (!word || word.length <= 1) return word; // Thêm check độ dài
        let arr = word.toUpperCase().split('');
        
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; 
        }

        const scrambledWord = arr.join('');
        // Tránh trường hợp xáo trộn xong lại y hệt từ cũ
        return scrambledWord === word.toUpperCase() ? GameLogics.scramble(word) : scrambledWord;
    },

    // 6. Open the box: Chọn hộp quà ngẫu nhiên từ mảng các hộp quà
    openBox: (boxes) => {
        if (!boxes || boxes.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * boxes.length);
        return boxes[randomIndex];
    },

    // 7. Picture Quiz: So khớp văn bản nhập vào với từ khóa của ảnh (Bỏ khoảng trắng thừa)
    checkPictureName: (input, actualName) => {
        if (!input || !actualName) return false;
        return input.trim().toLowerCase() === actualName.trim().toLowerCase();
    },

    // 8. True or False: Quyết định nhanh đúng/sai
    checkTrueFalse: (choice, answer) => {
        // Chuyển cả 2 về chuỗi text chữ thường để so sánh không lo lỗi kiểu dữ liệu
        return String(choice).trim().toLowerCase() === String(answer).trim().toLowerCase();
    },

    // 9. Simple Spin (Vòng quay): Tính góc xoay dừng lại
    calculateSpinAngle: (segmentCount) => {
        const fullSpins = 5; // Quay ít nhất 5 vòng tạo hiệu ứng kịch tính cho Quý làm UI
        const randomSegment = Math.floor(Math.random() * segmentCount);
        return (fullSpins * 360) + (randomSegment * (360 / segmentCount));
    },

    // 10. Find the Match: Tìm hình chọn có trùng ID với hình mục tiêu không
    isTargetMatch: (selectedItem, targetItem) => {
        if (!selectedItem || !targetItem) return false;
        return selectedItem.id === targetItem.id;
    }
};

/**
 * Hàm lấy danh sách câu hỏi ngẫu nhiên từ MongoDB Atlas theo gameType
 * Hàm này đứng độc lập để bổ sung chính xác cho file src/Api/index.js gọi import
 */
export const getGameQuestions = async (gameType, limit = 10) => {
    try {
        const db = getDb(); // Lấy db từ mongoClient
        
        // Log để kiểm tra giá trị đầu vào
        console.log("🔍 Đang tìm kiếm với gameType:", gameType);
        
        const allQuestions = await db.collection('questions') // Dùng trực tiếp tên collection gốc
    .find({ gameType: gameType })
    .toArray();

        console.log("📊 Số lượng câu hỏi tìm được:", allQuestions.length);
        
        if (allQuestions.length === 0) {
            // Nếu vẫn rỗng, thử log xem database có gì
            const all = await db.collection('questions').find({}).limit(5).toArray();
            console.log("💡 Mẫu dữ liệu trong DB hiện tại:", all.map(q => q.gameType));
        }

        return allQuestions.sort(() => 0.5 - Math.random()).slice(0, Number(limit));
    } catch (error) {
        console.error(`❌ Lỗi truy vấn:`, error.message);
        throw error;
    }
};