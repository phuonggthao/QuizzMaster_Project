import User from '../Model/User.js';
import { BaseRepository } from '../Repositories/baseRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userRepo = new BaseRepository(User);

// 1. Hàm Đăng Ký đã được cập nhật an toàn
export const register = async (req, res) => {
    console.log("Dữ liệu nhận được:", req.body);
    try {
        const { username, password, fullName } = req.body;

        // BƯỚC 1: Kiểm tra username đã tồn tại chưa bằng code
        const existingUser = await userRepo.findOne({ username });
        if (existingUser) {
            console.log("Phát hiện username đã tồn tại trong DB!");
            return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });
        }

        // BƯỚC 2: Nếu chưa có thì mới tạo
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepo.create({ username, password: hashedPassword, fullName });
        
        console.log("Đăng ký thành công tài khoản:", username);
        res.status(201).json({ message: "Đăng ký thành công", user });

    } catch (error) {
        // BẮT LỖI MONGODB: Nếu Index vẫn gây lỗi, ta bắt nó tại đây
        if (error.code === 11000) {
            console.error("Lỗi trùng lặp Index MongoDB:", error.message);
            return res.status(400).json({ message: "Tên đăng nhập đã tồn tại trong hệ thống!" });
        }
        
        console.error("Lỗi hệ thống:", error.message);
        res.status(500).json({ error: "Lỗi hệ thống: " + error.message });
    }
};

// 2. Hàm Đăng Nhập
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userRepo.findOne({ username });
        
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user._id, role: user.role }, 
                process.env.JWT_SECRET || 'SECRET_KEY_MAC_DINH',
                { expiresIn: '1d' }
            );
            res.json({ message: "Đăng nhập thành công", token, user });
        } else {
            res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Hàm lấy thông tin Hồ sơ cá nhân
export const getMe = async (req, res) => {
    try {
        const user = await userRepo.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy thông tin tài khoản người dùng!" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};