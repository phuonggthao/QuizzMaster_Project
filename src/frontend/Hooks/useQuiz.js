import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

// Câu hỏi mẫu cho khách — không cần backend
const GUEST_QUESTIONS = {
    Quiz: [
        { _id: 'g1', questionText: 'Thủ đô của Việt Nam là gì?', options: ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Huế'], correctAnswer: 'Hà Nội', category: 'Địa lý' },
        { _id: 'g2', questionText: '1 + 1 = ?', options: ['1', '2', '3', '4'], correctAnswer: '2', category: 'Toán học' },
        { _id: 'g3', questionText: 'Con vật nào kêu "gâu gâu"?', options: ['Mèo', 'Chó', 'Gà', 'Vịt'], correctAnswer: 'Chó', category: 'Thường thức' },
        { _id: 'g4', questionText: 'Màu của bầu trời là gì?', options: ['Đỏ', 'Xanh lá', 'Xanh dương', 'Vàng'], correctAnswer: 'Xanh dương', category: 'Thường thức' },
        { _id: 'g5', questionText: 'Việt Nam có bao nhiêu tỉnh thành?', options: ['58', '61', '63', '65'], correctAnswer: '63', category: 'Địa lý' },
    ],
    TrueFalse: [
        { _id: 'tf1', questionText: 'Trái Đất quay quanh Mặt Trời?', options: ['Đúng', 'Sai'], correctAnswer: 'Đúng', category: 'Khoa học' },
        { _id: 'tf2', questionText: 'Cá voi là loài cá?', options: ['Đúng', 'Sai'], correctAnswer: 'Sai', category: 'Sinh học' },
        { _id: 'tf3', questionText: 'Hà Nội là thủ đô Việt Nam?', options: ['Đúng', 'Sai'], correctAnswer: 'Đúng', category: 'Địa lý' },
    ],
    Flashcard: [
        { _id: 'fc1', questionText: 'Hello nghĩa là gì?', correctAnswer: 'Xin chào', category: 'Tiếng Anh' },
        { _id: 'fc2', questionText: 'Apple nghĩa là gì?', correctAnswer: 'Quả táo', category: 'Tiếng Anh' },
        { _id: 'fc3', questionText: 'Water nghĩa là gì?', correctAnswer: 'Nước', category: 'Tiếng Anh' },
    ],
};

export const useQuiz = (gameType = 'Quiz') => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = await AsyncStorage.getItem('userToken');

            // Khách dùng câu hỏi mẫu local — không cần backend
            if (token === 'GUEST') {
                const guestQ = GUEST_QUESTIONS[gameType] || GUEST_QUESTIONS['Quiz'];
                setQuestions(guestQ);
                return;
            }

            if (!token) {
                throw new Error("Bạn chưa đăng nhập hoặc Token đã hết hạn!");
            }

            const response = await fetch(`${BASE_URL}/game/questions/${gameType}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                setQuestions(data);
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
        fetchQuestions,
    };
};
