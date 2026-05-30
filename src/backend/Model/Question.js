import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    gameType: {
        type: String,
        required: true,
        enum: [
            'Quiz', 'Matching', 'LuckyNumber', 'Flashcard', 'WordScramble', 
            'OpenBox', 'PictureQuiz', 'TrueFalse', 'SimpleSpin', 'FindMatch'
        ],
        index: true 
    },
    category: { type: String, required: true, index: true },
    questionText: { type: String, trim: true },
    
    image: {
        name: { type: String },
        url:  { type: String } 
    },
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