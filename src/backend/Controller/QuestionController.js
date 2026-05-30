const upload = require('../Middleware/uploadCloudinary');

// Trong function tạo câu hỏi
const createQuestion = async (req, res) => {
    try {
        // Lấy URL ảnh từ req.file.path do middleware trả về
        const imageUrl = req.file ? req.file.path : null;

        // Gọi service để lưu câu hỏi vào DB cùng với imageUrl
        // const newQuestion = await questionService.create({...req.body, image: imageUrl});

        res.status(201).json({ message: "Đã tạo câu hỏi", imageUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};