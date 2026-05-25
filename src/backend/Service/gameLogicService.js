// src/backend/Service/gameLogicService.js
import Question from '../Model/Question.js'; 

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
        if (!word) return "";
        let arr = word.toUpperCase().split('');
        
        // Vòng lặp xáo trộn ngẫu nhiên vị trí các chữ cái
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            // Hoán vị chuẩn giữa phần tử i và j
            [arr[i], arr[j]] = [arr[j], arr[i]]; 
        }

        // Trường hợp xáo trộn xong lại vô tình trùng khít từ cũ thì đảo lại lần nữa
        const scrambledWord = arr.join('');
        return scrambledWord === word.toUpperCase() && word.length > 1 
            ? GameLogics.scramble(word) 
            : scrambledWord;
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
        // Sử dụng $sample của MongoDB để bốc ngẫu nhiên câu hỏi tránh trùng lặp nhàm chán
        const questions = await Question.aggregate([
            { $match: { gameType: gameType } }, // Lọc đúng loại trò chơi (ví dụ: Quiz, TrueFalse...)
            { $sample: { size: limit } }        // Bốc ngẫu nhiên tối đa 10 câu
        ]);
        return questions;
    } catch (error) {
        console.error(`❌ Lỗi khi lấy câu hỏi cho trò chơi ${gameType}:`, error.message);
        throw error;
    }
};