import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    gameType: {
        type: String,
        required: true,
        enum: [
            'Quiz',         // 1. Trắc nghiệm MCQ theo chủ đề
            'Matching',     // 2. So khớp cặp hình/chữ xáo trộn
            'LuckyNumber',  // 3. Dự đoán số may mắn
            'Flashcard',    // 4. Lật thẻ học tập tương tác
            'WordScramble', // 5. Xáo trộn vị trí chữ cái
            'OpenBox',      // 6. Mở hộp quà ngẫu nhiên
            'PictureQuiz',  // 7. Nhận diện và đoán hình ảnh
            'TrueFalse',    // 8. Quyết định nhanh Đúng/Sai
            'SimpleSpin',   // 9. Vòng quay may mắn tính góc xoay
            'FindMatch',    // 10. Tìm hình lựa chọn khớp với mục tiêu
            'FillInBlank',  // 11. Điền vào chỗ trống
        ]
    },
    category:      { type: String, required: true },    // Ví dụ: Toán, Lý, Tiếng Anh, Logic
    questionText:  { type: String },                    // Nội dung câu hỏi dạng văn bản
    imageName:     { type: String },                    // Tên file ảnh từ bộ nhớ lưu trữ
    imageUrl:      { type: String },                    // URL ảnh trực tiếp (PictureQuiz, FindMatch)
    options:       [{ type: String }],                  // Danh sách các đáp án lựa chọn
    correctAnswer: { type: String, required: true },    // Đáp án đúng để so khớp logic
    difficulty:    { type: String, default: 'Easy' },

    // Cấu trúc mảng cho trò chơi Matching Pairs
    pairs: [{
        id:    { type: String },
        text:  { type: String },
        image: { type: String }
    }],

    // Phần thưởng cho OpenBox và SimpleSpin
    rewards: [{
        name:  { type: String },
        value: { type: Number }
    }]
}, {
    timestamps: true,
    collection: 'questions'
});

export default mongoose.model('Question', QuestionSchema);
