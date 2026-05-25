import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
<<<<<<< Updated upstream
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Thuộc chủ đề nào
  gameType: { type: String, required: true }, // 'Quiz', 'Matching', 'FlipCard'...
  questionText: { type: String, required: true },
  options: [{ type: String }],                // Danh sách đáp án
  correctAnswer: { type: String, required: true },
  image: { type: String },                    // Dùng cho Picture Quiz
  timer: { type: Number, default: 30 }        // Thời gian riêng cho mỗi câu
=======
    gameType: { 
        type: String, 
        required: true,
        enum: [
            'Quiz',          // 1. Trắc nghiệm MCQ theo chủ đề
            'Matching', // 2. So khớp cặp hình/chữ xáo trộn
            'LuckyNumber',   // 3. Dự đoán số may mắn
            'Flashcard',    // 4. Lật thẻ học tập tương tác
            'WordScramble',  // 5. Xáo trộn vị trí chữ cái
           'OpenBox',   // 6. Mở hộp quà ngẫu nhiên
            'PictureQuiz',   // 7. Nhận diện và đoán hình ảnh
            'TrueFalse',     // 8. Quyết định nhanh Đúng/Sai
            'SimpleSpin',    // 9. Vòng quay may mắn tính góc xoay
            'FindMatch'   // 10. Tìm hình lựa chọn khớp với mục tiêu
        ]
    },
    category: { type: String, required: true },     // Ví dụ: Toán, Lý, Tiếng Anh, Logic
    questionText: { type: String },                 // Nội dung câu hỏi hiển thị dạng văn bản
    imageName: { type: String },                    // Tên file ảnh từ bộ nhớ lưu trữ
    imageUrl: { type: String },                     // URL ảnh trực tiếp (dùng cho PictureQuiz, FindMatch)
    options: [{ type: String }],                    // Danh sách các đáp án hoặc file ảnh lựa chọn
    correctAnswer: { type: String, required: true }, // Đáp án đúng chuẩn dùng để so khớp logic
    difficulty: { type: String, default: 'Easy' },
    
    // Cấu trúc mảng bổ trợ riêng cho trò chơi Matching Pairs (Ghép hình/chữ)
    pairs: [{
        id: { type: String },
        text: { type: String },
        image: { type: String }
    }],
    
    // Danh sách phần thưởng dành riêng cho Open the box và Simple Spin
    rewards: [{
        name: { type: String },
        value: { type: Number }
    }]
}, { 
    timestamps: true,
    collection: 'questions' // Ép chuẩn đồng bộ vào bảng tên 'questions' viết thường
>>>>>>> Stashed changes
});

export default mongoose.model('Question', QuestionSchema);