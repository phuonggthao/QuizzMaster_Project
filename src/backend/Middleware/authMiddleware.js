// src/backend/Middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

// 1. Chốt kiểm tra xem đã Đăng Nhập chưa (Có Token hợp lệ không)
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy chuỗi mã sau chữ 'Bearer '

    if (!token) {
        return res.status(401).json({ message: "🚫 Bạn chưa đăng nhập! Vui lòng gửi kèm Token." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY_MAC_DINH');
        req.user = decoded; // Lưu thông tin người dùng vào req để dùng ở các hàm sau
        next();
    } catch (error) {
        return res.status(403).json({ message: "❌ Token đã hết hạn hoặc không hợp lệ!" });
    }
};

// 2. Chốt kiểm tra xem có phải là ADMIN không
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next(); // Đúng là Admin thì cho đi tiếp
    } else {
        return res.status(403).json({ message: "🔒 Quyền truy cập bị từ chối! Bạn không phải là Admin." });
    }
};