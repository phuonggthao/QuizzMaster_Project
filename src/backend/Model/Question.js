import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    category: { type: String, required: true }, // Ví dụ: Toán, Lý, Logic
    difficulty: { type: String, default: 'Easy' }
}, { timestamps: true });

export default mongoose.model('Question', QuestionSchema);