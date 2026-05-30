// Bạn cần import model Question hoặc service tương ứng
import Question from '../Model/Question.js'; 

export const createQuestion = async (req, res) => {
    try {
        const { questionText, options, correctAnswer, category, gameType } = req.body;
        
        // 1. Lấy URL ảnh từ Cloudinary (req.file.path được set bởi middleware)
        const imageUrl = req.file ? req.file.path : null;

        // 2. Kiểm tra dữ liệu bắt buộc (Validation)
        if (!questionText || !correctAnswer) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ câu hỏi và đáp án!" });
        }

        // 3. Tạo object dữ liệu mới
        const newQuestionData = {
            questionText,
            options: typeof options === 'string' ? JSON.parse(options) : options, // Xử lý nếu options gửi từ form-data là chuỗi JSON
            correctAnswer,
            category,
            gameType,
            imageUrl: imageUrl // Lưu đường dẫn ảnh vào DB
        };

        // 4. Lưu vào Database
        const newQuestion = await Question.create(newQuestionData);

        res.status(201).json({ 
            message: "Đã tạo câu hỏi thành công!", 
            question: newQuestion 
        });
    } catch (error) {
        console.error("Lỗi khi tạo câu hỏi:", error);
        res.status(500).json({ error: "Lỗi hệ thống: " + error.message });
    }
};