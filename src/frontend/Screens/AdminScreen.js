import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Thảo nhớ cài: npx expo install @react-native-picker/picker
import BASE_URL from '../config';

export default function AdminScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    
    // State quản lý form câu hỏi
    const [gameType, setGameType] = useState('Quiz');
    const [questionText, setQuestionText] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [category, setCategory] = useState('Kiến thức chung');
    const [difficulty, setDifficulty] = useState('Dễ');
    const [options, setOptions] = useState(['', '', '', '']); // Chỉ dùng cho Quiz

    const handleAddQuestion = async () => {
        // Kiểm tra dữ liệu đầu vào
        if (!questionText || !correctAnswer || !category) {
            Alert.alert("Lỗi", "Thảo ơi, điền thiếu thông tin rồi kìa!");
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            
            const body = {
                gameType,
                questionText,
                correctAnswer,
                category,
                difficulty,
                options: gameType === 'Quiz' ? options : [] // Chỉ gửi options nếu là trò Quiz
            };

            const response = await fetch(`${BASE_URL}/game/questions/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Thành công! 🎉", "Câu hỏi đã được lưu thẳng vào MongoDB Atlas.");
                // Reset form sau khi thêm thành công
                setQuestionText('');
                setCorrectAnswer('');
                setOptions(['', '', '', '']);
            } else {
                Alert.alert("Thất bại", data.message || "Có lỗi xảy ra khi lưu câu hỏi.");
            }
        } catch (error) {
            Alert.alert("Lỗi kết nối", "Không thể gửi dữ liệu lên Backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.title}>🛠️ Quản Trị Câu Hỏi</Text>
            
            <Text style={styles.label}>1. Chọn loại trò chơi:</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={gameType} onValueChange={(item) => setGameType(item)}>
                    <Picker.Item label="🧠 Trắc nghiệm lựa chọn (Quiz)" value="Quiz" />
                    <Picker.Item label="🖼️ Ghép cặp thẻ bài (Matching)" value="Matching" />
                    <Picker.Item label="🎲 Vòng quay số may mắn (LuckyNumber)" value="LuckyNumber" />
                    <Picker.Item label="🎴 Thẻ bài Flashcards (Flashcard)" value="Flashcard" />
                    <Picker.Item label="🧩 Từ xáo trộn (WordScramble)" value="WordScramble" />
                    <Picker.Item label="🎁 Hộp quà bí ẩn (OpenBox)" value="OpenBox" />
                    <Picker.Item label="🎤 Nhìn hình đoán chữ (PictureQuiz)" value="PictureQuiz" />
                    <Picker.Item label="⚖️ Đúng hoặc Sai (TrueFalse)" value="TrueFalse" />
                    <Picker.Item label="🎡 Vòng quay kịch tính (SimpleSpin)" value="SimpleSpin" />
                    <Picker.Item label="🎯 Tìm hình trùng khớp (FindMatch)" value="FindMatch" />
                </Picker>
            </View>
            <Text style={styles.label}>2. Nội dung câu hỏi:</Text>
            <TextInput style={styles.input} placeholder="Nhập câu hỏi tại đây..." value={questionText} onChangeText={setQuestionText} multiline />

            {/* Nếu là trò Quiz thì hiện 4 ô nhập lựa chọn */}
            {gameType === 'Quiz' && (
                <View>
                    <Text style={styles.label}>3. Các lựa chọn (Options):</Text>
                    {options.map((opt, index) => (
                        <TextInput 
                            key={index}
                            style={styles.input} 
                            placeholder={`Lựa chọn ${index + 1}`} 
                            value={opt} 
                            onChangeText={(text) => {
                                let newOpts = [...options];
                                newOpts[index] = text;
                                setOptions(newOpts);
                            }} 
                        />
                    ))}
                </View>
            )}

            <Text style={styles.label}>{gameType === 'Quiz' ? '4.' : '3.'} Đáp án đúng:</Text>
            <TextInput style={styles.input} placeholder="Gõ chính xác đáp án đúng..." value={correctAnswer} onChangeText={setCorrectAnswer} />

            <Text style={styles.label}>Chủ đề (Category):</Text>
            <TextInput style={styles.input} placeholder="Ví dụ: Toán học, Lịch sử..." value={category} onChangeText={setCategory} />

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddQuestion} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Thêm vào hệ thống</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
                <Text style={styles.logoutBtnText}>Đăng xuất khỏi Admin</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f4f7', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 25, textAlign: 'center' },
    label: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 8, marginTop: 10 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d9e0', padding: 12, borderRadius: 10, fontSize: 16, marginBottom: 15 },
    pickerContainer: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#d1d9e0', marginBottom: 15, overflow: 'hidden' },
    submitBtn: { backgroundColor: '#4CAF50', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20, elevation: 3 },
    submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    logoutBtn: { marginTop: 30, padding: 10, alignItems: 'center' },
    logoutBtnText: { color: '#f44336', fontWeight: 'bold' }
});