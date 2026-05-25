import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

export const useQuiz = (gameType = 'Quiz') => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = await AsyncStorage.getItem('userToken');
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
