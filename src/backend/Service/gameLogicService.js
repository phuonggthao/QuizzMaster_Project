// src/backend/Service/gameLogicService.js

export const GameLogics = {
    // 1. Quiz (MCQ): Kiểm tra đáp án trắc nghiệm
    checkQuiz: (userChoice, correctAnswer) => userChoice === correctAnswer,

    // 2. Matching Pairs: Kiểm tra 2 thẻ có cùng ID hoặc cùng cặp không
    isMatch: (card1, card2) => card1.pairId === card2.pairId,

    // 3. Lucky Number: Quay số ngẫu nhiên (Vinh có thể dùng để thưởng điểm)
    generateLuckyNumber: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    // 4. Flash cards: Lật thẻ (Hàm này chỉ trả về trạng thái lật ở Frontend)
    toggleCard: (isFlipped) => !isFlipped,

    // 5. Word Scramble: Xáo trộn từ (Giao cho Vinh xử lý thuật toán này)
    scramble: (word) => {
        let arr = word.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[arr[i]]]; // Thuật toán Fisher-Yates
        }
        return arr.join('');
    },

    // 6. Open the box: Chọn hộp quà ngẫu nhiên
    openBox: (boxes) => {
        const randomIndex = Math.floor(Math.random() * boxes.length);
        return boxes[randomIndex]; // Trả về vật phẩm trong hộp
    },

    // 7. Picture Quiz: So khớp văn bản nhập vào với từ khóa của ảnh
    checkPictureName: (input, actualName) => input.trim().toLowerCase() === actualName.toLowerCase(),

    // 8. True or False: Quyết định nhanh đúng/sai
    checkTrueFalse: (choice, answer) => choice === answer,

    // 9. Simple Spin (Vòng quay): Tính góc xoay dừng lại (Cho Quý làm UI)
    calculateSpinAngle: (segmentCount) => {
        const fullSpins = 5; // Quay ít nhất 5 vòng cho đẹp
        const randomSegment = Math.floor(Math.random() * segmentCount);
        return (fullSpins * 360) + (randomSegment * (360 / segmentCount));
    },

    // 10. Find the Match: Tìm hình giống với hình mẫu cho trước
    isTargetMatch: (selectedItem, targetItem) => selectedItem.id === targetItem.id
};