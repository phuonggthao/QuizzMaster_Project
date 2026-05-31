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
        ],
        index: true
    },

    category: { type: String, required: true, index: true },
    questionText: { type: String, trim: true },

    imageName: { type: String },
    imageUrl: { type: String },

    options: [{ type: String, trim: true }],
    correctAnswer: { type: String, required: true, trim: true },

    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy'
    },

    pairs: [{
        id: String,
        text: String,
        image: String
    }],

    rewards: [{
        name: String,
        value: Number
    }]
}, {
    timestamps: true,
    collection: 'questions', // Chỉ định rõ collection để tránh Mongoose tự thêm 's'
    // Tự động sử dụng lean() nếu bạn muốn truy vấn nhanh hơn mặc định
    // (Lưu ý: lean() trả về object JS thuần, không phải document Mongoose)
});

// Index kép tối ưu hóa truy vấn
QuestionSchema.index({ gameType: 1, category: 1 });

/** * ĐẢM BẢO MODEL CHỈ ĐƯỢC KHỞI TẠO 1 LẦN
 * Đây là cách an toàn nhất trong môi trường Node.js 
 */
let Question;

try {
    // Thử lấy model nếu đã tồn tại
    Question = mongoose.model('Question');
} catch (error) {
    // Nếu chưa tồn tại, thì tạo mới
    Question = mongoose.model('Question', QuestionSchema);
}

export default Question;
