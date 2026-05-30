import User from '../Model/User.js';
import { BaseRepository } from '../Repositories/baseRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Hàm helper để lấy repo an toàn (giữ nguyên)
const getUserRepo = () => new BaseRepository(User);

export const register = async (req, res) => {
    try {
        const { username, password, fullName } = req.body;
        const userRepo = getUserRepo(); // Lấy repo an toàn

        const existingUser = await userRepo.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepo.create({ username, password: hashedPassword, fullName });
        
        res.status(201).json({ message: "Đăng ký thành công", user });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });
        }
        res.status(500).json({ error: "Lỗi hệ thống: " + error.message });
    }
};

// SỬA HÀM LOGIN NÀY:
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // BỎ QUA REPO, GỌI TRỰC TIẾP MODEL ĐỂ KIỂM TRA MẠNG
        const user = await User.findOne({ username }).lean().exec(); 

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'SECRET', { expiresIn: '1d' });
            res.json({ message: "Đăng nhập thành công", token, user });
        } else {
            res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        }
    } catch (error) {
        console.error("Lỗi login:", error); // Log chi tiết vào terminal
        res.status(500).json({ error: "Lỗi kết nối database: " + error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        // Tương tự, gọi trực tiếp model
        const user = await User.findById(req.user.id).lean().exec();
        if (!user) return res.status(404).json({ message: "Không tìm thấy user!" });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};