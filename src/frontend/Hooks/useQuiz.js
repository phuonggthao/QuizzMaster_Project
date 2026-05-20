import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config'; // Nhảy ra ngoài 1 cấp để lấy file IP config

export const useQuiz = (gameType = 'Quiz') => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Hàm 1: Xử lý Đăng nhập và lưu Token tự động vào máy
     */
    const loginUser = async (username, password) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Lưu token và userId vào bộ nhớ tạm của điện thoại
                await AsyncStorage.setItem('userToken', data.token);
                if (data.user && data.user.id) {
                    await AsyncStorage.setItem('userId', data.user.id);
                }
                setLoading(false);
                return { success: true, message: "Đăng nhập thành công!" };
            } else {
                setLoading(false);
                return { success: false, message: data.message || "Sai tài khoản hoặc mật khẩu!" };
            }
        } catch (err) {
            setLoading(false);
            return { success: false, message: "Lỗi mạng! Không thể kết nối tới Server Backend." };
        }
    };

    /**
     * Hàm 2: Tải danh sách câu hỏi ngẫu nhiên từ Backend (Yêu cầu Token)
     */
    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Lấy Token đã lưu trong máy ra
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                throw new Error("Bạn chưa đăng nhập hoặc Token đã hết hạn!");
            }

            // 2. Gọi API lấy câu hỏi theo gameType (Ví dụ: Quiz, TrueFalse...)
            const response = await fetch(`${BASE_URL}/game/questions/${gameType}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Đính kèm token chuẩn mã hóa để qua cổng verifyToken
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                setQuestions(data); // Đổ mảng câu hỏi ngẫu nhiên vào state
            } else {
                throw new Error(data.message || "Không thể tải câu hỏi từ hệ thống.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        questions,
        loading,
        error,
        loginUser,      // Xuất hàm này ra để giao diện Login gọi
        fetchQuestions  // Xuất hàm này ra để giao diện Trò chơi gọi khi bắt đầu vào game
    };
};