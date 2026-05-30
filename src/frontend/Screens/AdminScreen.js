import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import BASE_URL from '../config';
import { useTheme } from '../context/ThemeContext';

export default function AdminScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const { theme: C } = useTheme();
    
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
        <ScrollView style={[styles.container, { backgroundColor: C.bgApp }]} contentContainerStyle={{ paddingBottom: 40, padding: 20 }}>
            <View style={styles.adminHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
                    <Text style={[styles.backBtnText, { color: C.primary }]}>←</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: C.textPrimary }]}>🛠️ Quản Trị Câu Hỏi</Text>
                <View style={styles.backBtn} />
            </View>
            
            <Text style={[styles.label, { color: C.textSecondary }]}>1. Chọn loại trò chơi:</Text>
            <View style={[styles.pickerContainer, { backgroundColor: C.bgCard, borderColor: C.border }]}>
                <Picker
                    selectedValue={gameType}
                    onValueChange={(item) => setGameType(item)}
                    dropdownIconColor={C.textPrimary}
                    style={{ color: C.textPrimary }}
                >
                    <Picker.Item style={{ backgroundColor: C.bgCard, color: C.textPrimary }} label="🧠 Trắc nghiệm lựa chọn (Quiz)" value="Quiz" />
                    <Picker.Item style={{ backgroundColor: C.bgCard, color: C.textPrimary }} label="🖼️ Ghép cặp thẻ bài (Matching)" value="Matching" />
                    <Picker.Item style={{ backgroundColor: C.bgCard, color: C.textPrimary }} label="🎲 Vòng quay số may mắn (LuckyNumber)" value="LuckyNumber" />
                    <Picker.Item style={{ backgroundColor: C.bgCard, color: C.textPrimary }} label="🎴 Thẻ bài Flashcards (Flashcard)" value="Flashcard" />
                    <Picker.Item style={{ backgroundColor: C.bgCard, color: C.textPrimary }} label="🧩 Từ xáo trộn (WordScramble)" value="WordScramble" />
                    <Picker.Item style={{ backgroundColor: C.bgCard, color: C.textPrimary }} label="🎁 Hộp quà bí ẩn (OpenBox)" value="OpenBox" />
                    <Picker.Item style={{ backgroundColor: C.bgCard, color: C.textPrimary }} label="🎤 Nhìn hình đoán chữ (PictureQuiz)" value="PictureQuiz" />
                    <Picker.Item style={{ backgroundColor: C.bgCard, color: C.textPrimary }} label="⚖️ Đúng hoặc Sai (TrueFalse)" value="TrueFalse" />
                    <Picker.Item style={{ backgroundColor: C.bgCard, color: C.textPrimary }} label="🎡 Vòng quay kịch tính (SimpleSpin)" value="SimpleSpin" />
                    <Picker.Item style={{ backgroundColor: C.bgCard, color: C.textPrimary }} label="🎯 Tìm hình trùng khớp (FindMatch)" value="FindMatch" />
                </Picker>
            </View>
            <Text style={[styles.label, { color: C.textSecondary }]}>2. Nội dung câu hỏi:</Text>
            <TextInput
                style={[styles.input, { backgroundColor: C.bgCard, borderColor: C.border, color: C.textPrimary }]}
                placeholder="Nhập câu hỏi tại đây..."
                placeholderTextColor={C.textMuted}
                value={questionText}
                onChangeText={setQuestionText}
                multiline
            />

            {/* Nếu là trò Quiz thì hiện 4 ô nhập lựa chọn */}
            {gameType === 'Quiz' && (
                <View>
                    <Text style={[styles.label, { color: C.textSecondary }]}>3. Các lựa chọn (Options):</Text>
                    {options.map((opt, index) => (
                        <TextInput 
                            key={index}
                            style={[styles.input, { backgroundColor: C.bgCard, borderColor: C.border, color: C.textPrimary }]}
                            placeholder={`Lựa chọn ${index + 1}`}
                            placeholderTextColor={C.textMuted}
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

            <Text style={[styles.label, { color: C.textSecondary }]}>{gameType === 'Quiz' ? '4.' : '3.'} Đáp án đúng:</Text>
            <TextInput
                style={[styles.input, { backgroundColor: C.bgCard, borderColor: C.border, color: C.textPrimary }]}
                placeholder="Gõ chính xác đáp án đúng..."
                placeholderTextColor={C.textMuted}
                value={correctAnswer}
                onChangeText={setCorrectAnswer}
            />

            <Text style={[styles.label, { color: C.textSecondary }]}>Chủ đề (Category):</Text>
            <TextInput
                style={[styles.input, { backgroundColor: C.bgCard, borderColor: C.border, color: C.textPrimary }]}
                placeholder="Ví dụ: Toán học, Lịch sử..."
                placeholderTextColor={C.textMuted}
                value={category}
                onChangeText={setCategory}
            />

            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: C.primary }]} onPress={handleAddQuestion} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Thêm vào hệ thống</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
                <Text style={[styles.logoutBtnText, { color: C.wrong }]}>Đăng xuất khỏi Admin</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    adminHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backBtnText: { fontSize: 22, fontWeight: '700' },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginTop: 10 },
    input: { borderWidth: 1, padding: 12, borderRadius: 10, fontSize: 16, marginBottom: 15 },
    pickerContainer: { borderRadius: 10, borderWidth: 1, marginBottom: 15, overflow: 'hidden' },
    submitBtn: { padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20, elevation: 3 },
    submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    logoutBtn: { marginTop: 30, padding: 10, alignItems: 'center' },
    logoutBtnText: { fontWeight: 'bold' }
});