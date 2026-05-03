import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Thuộc chủ đề nào
  gameType: { type: String, required: true }, // 'Quiz', 'Matching', 'FlipCard'...
  questionText: { type: String, required: true },
  options: [{ type: String }],                // Danh sách đáp án
  correctAnswer: { type: String, required: true },
  image: { type: String },                    // Dùng cho Picture Quiz
  timer: { type: Number, default: 30 }        // Thời gian riêng cho mỗi câu
});

export default mongoose.model('Question', QuestionSchema);