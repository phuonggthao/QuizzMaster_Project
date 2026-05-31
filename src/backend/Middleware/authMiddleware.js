import jwt from 'jsonwebtoken';

// 1. Kiểm tra xác thực (Đăng nhập)
export const verifyToken = (req, res, next) => {
    // Lấy header Authorization
    const authHeader = req.headers['authorization'];
    
    // Kiểm tra định dạng 'Bearer <token>'
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "🚫 Bạn chưa đăng nhập hoặc không có quyền truy cập." });
    }

    try {
        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET );
        
        // Lưu thông tin người dùng vào req (đã bao gồm id và role từ lúc login)
        req.user = decoded; 
        next();
    } catch (error) {
        console.error("Lỗi xác thực Token:", error.message);
        return res.status(403).json({ message: "❌ Token đã hết hạn hoặc không hợp lệ!" });
    }
};

// 2. Kiểm tra quyền Admin
export const isAdmin = (req, res, next) => {
    // Đảm bảo req.user đã tồn tại (đã qua middleware verifyToken)
    if (req.user && req.user.role === 'Admin') {
        next(); 
    } else {
        return res.status(403).json({ message: "🔒 Quyền truy cập bị từ chối! Bạn cần quyền Admin." });
    }
};