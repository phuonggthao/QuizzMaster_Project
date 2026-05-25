import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useQuiz } from '../Hooks/useQuiz';

export default function QuizScreen({ route, navigation }) {
    const { gameType } = route.params || { gameType: 'Quiz' };
    const { questions, loading, error, fetchQuestions } = useQuiz(gameType);
    
    // Các trạng thái quản lý trò chơi
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [textInput, setTextInput] = useState(''); 
    const [isFlipped, setIsFlipped] = useState(false); // Riêng cho trò chơi Flashcard

    // Hệ thống đếm ngược thời gian (10 giây)
    const [timeLeft, setTimeLeft] = useState(10);
    const timerRef = useRef(null);

    useEffect(() => {
        fetchQuestions();
        return () => clearInterval(timerRef.current); // Xóa bộ đếm khi thoát màn hình
    }, []);

    // Hiệu ứng đếm ngược chạy mỗi khi chuyển sang câu hỏi mới
    useEffect(() => {
        if (questions.length > 0 && !loading) {
            setTimeLeft(10); // Đặt lại 10 giây cho câu mới
            if (timerRef.current) clearInterval(timerRef.current);

            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleTimeOut(); // Xử lý khi hết giờ
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [currentIndex, questions, loading]);

    // Hàm tự động kích hoạt khi Thảo hết 10 giây
    const handleTimeOut = () => {
        Alert.alert("Hết Giờ Rồi! ⏳", `Thời gian 10 giây đã hết. Đáp án đúng là: ${questions[currentIndex]?.correctAnswer}`, [
            { text: "Tiếp tục", onPress: () => nextQuestion(score) }
        ]);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Đang bốc câu hỏi từ MongoDB...</Text>
            </View>
        );
    }

    if (error || questions.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>❌ {error || `Chưa có dữ liệu câu hỏi cho trò [${gameType}] trên Database!`}</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>Quay lại Menu</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentQuestion = questions[currentIndex];

    // Hàm xử lý kiểm tra đáp án khi người chơi chủ động trả lời
    const handleAnswer = (userAnswer) => {
        if (timerRef.current) clearInterval(timerRef.current); // Dừng đếm ngược khi đã bấm chọn

        let isCorrect = false;
        switch (gameType) {
            case 'Quiz':
            case 'TrueFalse':
                isCorrect = String(userAnswer).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase();
                break;
                
            case 'FillInBlank':
            case 'PictureQuiz':
            case 'WordScramble':
                isCorrect = String(textInput).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase();
                break;

            default:
                isCorrect = true; 
                break;
        }

        if (isCorrect) {
            const newScore = score + 10;
            setScore(newScore);
            Alert.alert("Chính Xác! 🎉", "Chúc mừng Thảo đã trả lời đúng.", [
                { text: "Tiếp theo", onPress: () => nextQuestion(newScore) }
            ]);
        } else {
            Alert.alert("Sai Mất Rồi 😢", `Đáp án đúng là: ${currentQuestion.correctAnswer}`, [
                { text: "Tiếp theo", onPress: () => nextQuestion(score) }
            ]);
        }    };

    // Hàm chuyển sang câu hỏi tiếp theo — nhận điểm thực tế thay vì boolean
    const nextQuestion = (currentScore) => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setTextInput('');
            setIsFlipped(false); // Reset trạng thái lật thẻ cho câu tiếp theo
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            Alert.alert("Trò Chơi Kết Thúc! 🏁", `Tổng số điểm Thảo đạt được: ${currentScore} điểm.`, [
                { text: "Hoàn thành", onPress: () => navigation.replace('Home') }
            ]);
        }
    };

    // --- RENDER GIAO DIỆN PHÙ HỢP CHO TỪNG LOẠI GAME ---
    const renderGameUI = () => {
        switch (gameType) {
            // 1 & 8: Trắc nghiệm lựa chọn (Quiz) & Đúng Sai (True/False)
            case 'Quiz':
            case 'TrueFalse':
                return (
                    <View style={styles.uiContainer}>
                        <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
                        {currentQuestion.options?.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.optionBtn} onPress={() => handleAnswer(item)}>
                                <Text style={styles.optionText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );

            // 4: Thẻ Bài Flashcard tương tác lật mặt (ĐÃ NÂNG CẤP)
            case 'Flashcard':
                return (
                    <View style={styles.uiContainer}>
                        <TouchableOpacity style={styles.flashcardContainer} onPress={() => setIsFlipped(!isFlipped)}>
                            {!isFlipped ? (
                                <View style={styles.flashcardInner}>
                                    <Text style={styles.cardBadge}>MẶT TRƯỚC (CÂU HỎI)</Text>
                                    <Text style={styles.flashcardContentText}>{currentQuestion.questionText}</Text>
                                    <Text style={styles.flipHint}>👉 Bấm vào thẻ để xem đáp án ẩn...</Text>
                                </View>
                            ) : (
                                <View style={[styles.flashcardInner, styles.flashcardBack]}>
                                    <Text style={[styles.cardBadge, { backgroundColor: '#4CAF50' }]}>MẶT SAU (ĐÁP ÁN)</Text>
                                    <Text style={styles.flashcardContentText}>{currentQuestion.correctAnswer}</Text>
                                    <Text style={[styles.flipHint, { color: '#eef' }]}>👉 Bấm vào thẻ để xem lại câu hỏi...</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.submitBtn} onPress={() => handleAnswer(currentQuestion.correctAnswer)}>
                            <Text style={styles.submitBtnText}>Đã thuộc lòng câu này! ✓</Text>
                        </TouchableOpacity>                    </View>
                );

            // 7: Nhìn hình đoán chữ (ĐÃ NÂNG CẤP LÊN HÌNH ẢNH URL THẬT)
            case 'PictureQuiz':
                return (
                    <View style={styles.uiContainer}>
                        <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
                        
                        {/* Kiểm tra hiển thị ảnh trực tiếp từ link URL trong Database */}
                        {currentQuestion.imageUrl ? (
                            <Image source={{ uri: currentQuestion.imageUrl }} style={styles.quizImage} />
                        ) : currentQuestion.imageName ? (
                            <Text style={styles.imagePlaceholder}>🖼️ [Ảnh mẫu: {currentQuestion.imageName}]</Text>
                        ) : null}

                        <TextInput 
                            style={styles.input} 
                            placeholder="Nhập tên từ khóa hình ảnh..." 
                            value={textInput} 
                            onChangeText={setTextInput}
                        />
                        <TouchableOpacity style={styles.submitBtn} onPress={() => handleAnswer(textInput)}>
                            <Text style={styles.submitBtnText}>Nộp đáp án</Text>
                        </TouchableOpacity>
                    </View>
                );

            // 5: Từ xáo trộn (Word Scramble)
            case 'WordScramble':
                return (
                    <View style={styles.uiContainer}>
                        <Text style={styles.hintText}>Chủ đề câu hỏi: {currentQuestion.category}</Text>
                        <Text style={styles.scrambledWordText}>🧩 Từ xáo trộn: {currentQuestion.questionText || "EXOP"}</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Sắp xếp lại từ đúng..." 
                            value={textInput} 
                            onChangeText={setTextInput}
                        />
                        <TouchableOpacity style={styles.submitBtn} onPress={() => handleAnswer(textInput)}>
                            <Text style={styles.submitBtnText}>Kiểm tra từ</Text>
                        </TouchableOpacity>
                    </View>
                );

            // Giao diện mặc định cho các trò chơi đặc biệt khác (Matching, OpenBox...)
            default:
                return (
                    <View style={styles.uiContainer}>
                        <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
                        <Text style={styles.infoText}>Trò chơi [{gameType}] yêu cầu tương tác xử lý nâng cao theo nhóm.</Text>
                        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: '#FF9800' }]} onPress={() => handleAnswer(currentQuestion.correctAnswer)}>
                            <Text style={styles.submitBtnText}>Bấm để vượt màn tiếp theo ➔</Text>
                        </TouchableOpacity>
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            {/* Thanh hiển thị tiến độ, Đếm ngược thời gian và Điểm số */}
            <View style={styles.headerRow}>
                <Text style={styles.headerText}>Câu hỏi: {currentIndex + 1}/{questions.length}</Text>
                
                {/* Widget đếm ngược nhấp nháy đỏ khi sắp hết giờ */}
                <View style={styles.timerBadge}>
                    <Text style={[styles.timerText, timeLeft <= 3 ? { color: '#E91E63' } : { color: '#2196F3' }]}>
                        ⏱️ {timeLeft}s
                    </Text>
                </View>

                <Text style={[styles.headerText, { color: '#FF9800' }]}>Điểm: {score}</Text>
            </View>

            {/* Khung nội dung chính của màn chơi */}
            <View style={styles.card}>
                {renderGameUI()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    timerBadge: { backgroundColor: '#fff', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', elevation: 1 },
    timerText: { fontSize: 16, fontWeight: 'bold' },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
    uiContainer: { width: '100%' },
    questionText: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 20, textAlign: 'center' },
    optionBtn: { backgroundColor: '#2196F3', padding: 15, borderRadius: 10, marginBottom: 12 },
    optionText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: '#fafafa', fontSize: 16 },
    submitBtn: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    quizImage: { width: '100%', height: 200, borderRadius: 12, marginVertical: 15, resizeMode: 'contain', backgroundColor: '#eaeaea' },
    imagePlaceholder: { textAlign: 'center', color: '#777', fontStyle: 'italic', padding: 20, backgroundColor: '#eee', borderRadius: 8, marginBottom: 15 },
    hintText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 5 },
    scrambledWordText: { fontSize: 22, fontWeight: 'bold', color: '#E91E63', textAlign: 'center', marginBottom: 20, letterSpacing: 2 },
    infoText: { fontStyle: 'italic', color: '#888', textAlign: 'center', marginBottom: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
    errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginBottom: 20 },
    backBtn: { backgroundColor: '#333', padding: 12, borderRadius: 8 },
    backBtnText: { color: '#fff', fontWeight: 'bold' },
    
    // Khung CSS bổ sung cho giao diện thẻ bài Flashcard
    flashcardContainer: { width: '100%', height: 220, marginBottom: 20 },
    flashcardInner: { flex: 1, backgroundColor: '#2196F3', padding: 20, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#1976D2' },
    flashcardBack: { backgroundColor: '#FF9800', borderColor: '#F57C00' },
    cardBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#1565C0', color: '#fff', fontSize: 10, fontWeight: 'bold', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 5 },
    flashcardContentText: { fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center', paddingHorizontal: 10 },
    flipHint: { position: 'absolute', bottom: 10, fontSize: 12, color: '#dff0ff', fontStyle: 'italic' }
});