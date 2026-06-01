import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

export const useQuiz = (gameType = 'Quiz') => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            
            console.log("Đang gọi API tới:", `${BASE_URL}/game/questions/${gameType}`);

            const response = await fetch(`${BASE_URL}/game/questions/${gameType}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log("Dữ liệu nhận được:", data);
                setQuestions(data || []);
            } else {
                throw new Error(data.error || "Lỗi server");
            }
        } catch (err) {
            console.error("Lỗi fetchQuestions:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [gameType]);

    return { questions, loading, error };
};