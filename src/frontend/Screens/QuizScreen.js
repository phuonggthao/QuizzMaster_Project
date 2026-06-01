import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View, Text, ActivityIndicator, StyleSheet,
    TouchableOpacity, TextInput, Platform, Alert, StatusBar, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuiz } from '../Hooks/useQuiz';
import { Colors } from '../Styles/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import BASE_URL from '../config';

const OPTION_COLORS = [Colors.optionA, Colors.optionB, Colors.optionC, Colors.optionD];


export default function QuizScreen({ route, navigation }) {
    const { gameType } = route.params || { gameType: 'Quiz' };
    const { questions, loading, error } = useQuiz(gameType);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [textInput, setTextInput] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10);
    const [scrambledWord, setScrambledWord] = useState("");
    
    const timerRef = useRef(null);
    const currentIndexRef = useRef(0);

    useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

    // Cleanup khi component unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            // Logic reset game khi màn hình được focus
            // Ví dụ: setCurrentIndex(0); setScore(0);
            
            return () => { 
                // Logic cleanup khi rời khỏi màn hình
            };
        }, [])
    );

    const scramble = (word) => {
        if (!word) return "";
        let arr = word.toUpperCase().split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    };

    const updateScoreOnServer = async (finalScore) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            await fetch(`${BASE_URL}/auth/update-score`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ score: finalScore })
            });
        } catch (error) { console.error("Lỗi cập nhật điểm:", error); }
    };

    const nextQuestion = useCallback(async (currentScore) => {
        if (!questions) return;
        const nextIndex = currentIndexRef.current + 1;
        if (nextIndex < questions.length) {
            setAnswered(false); 
            setSelectedAnswer(null); 
            setTextInput('');
            setIsFlipped(false); 
            setTimeLeft(10); 
            setCurrentIndex(nextIndex);
        } else {
            await updateScoreOnServer(currentScore);
            Alert.alert("🏁 Kết Thúc!", `Điểm của bạn: ${currentScore}`, [
                { text: "Về trang chủ", onPress: () => navigation.replace('Home') }
            ]);
        }
    }, [questions, navigation]);

    const handleTimeOut = useCallback(() => {
        if (answered) return;
        setAnswered(true);
        Alert.alert("⏳ Hết Giờ!", `Đáp án: ${questions[currentIndex]?.correctAnswer}`, [
            { text: "Tiếp tục", onPress: () => nextQuestion(score) }
        ]);
    }, [answered, currentIndex, questions, score, nextQuestion]);

    useEffect(() => {
        if (questions.length > 0 && !loading && !answered) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) { 
                        clearInterval(timerRef.current); 
                        handleTimeOut(); 
                        return 0; 
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [currentIndex, questions, loading, answered, handleTimeOut]);

    useEffect(() => {
        if (questions[currentIndex] && gameType === 'WordScramble') {
            setScrambledWord(scramble(questions[currentIndex].correctAnswer));
        }
    }, [currentIndex, questions, gameType]);

    const handleAnswer = (userAnswer) => {
        // 1. Kiểm tra an toàn dữ liệu
        const currentQ = questions[currentIndex];
        if (answered || !currentQ) return;
        
        // 2. Dừng timer ngay lập tức
        if (timerRef.current) clearInterval(timerRef.current);
        
        setAnswered(true);
        // Ưu tiên sử dụng userAnswer được truyền vào từ UI
        const selected = userAnswer !== undefined ? userAnswer : textInput;
        setSelectedAnswer(selected);
        
        const correct = String(currentQ.correctAnswer).trim().toLowerCase();
        const input = String(selected).trim().toLowerCase();
        const isCorrect = input === correct;
        
        const newScore = isCorrect ? score + 10 : score;
        if (isCorrect) setScore(newScore);
        
        // 3. Sử dụng delay để người dùng nhìn thấy màu sắc (nếu cần) trước khi Alert bật lên
        setTimeout(() => {
            Alert.alert(
                isCorrect ? "🎉 Chính Xác!" : "❌ Sai rồi!", 
                isCorrect ? "+10 điểm" : `Đáp án: ${currentQ.correctAnswer}`, 
                [{ text: "Tiếp theo", onPress: () => nextQuestion(newScore) }],
                { cancelable: false } // Ngăn người dùng tắt Alert bằng cách chạm ra ngoài
            );
        }, 300);
    };

    const currentQuestion = questions[currentIndex];
    const progress = (currentIndex + 1) / questions.length;
    const timerColor = timeLeft <= 3 ? Colors.wrong : timeLeft <= 6 ? Colors.warning : Colors.correct;

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
    if (error) return <View style={styles.center}><Text style={styles.errorText}>Lỗi: {error}</Text></View>;
    
    // Nếu vẫn chưa có câu hỏi sau khi loading kết thúc
    if (!currentQuestion) {
    return (
        <View style={styles.center}>
            <Text style={styles.errorText}>Không tìm thấy câu hỏi nào cho thể loại này!</Text>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.backBtnText}>Quay lại</Text>
            </TouchableOpacity>
        </View>
    );
}

    

    const renderGameUI = () => {
       console.log("DEBUG: Dữ liệu câu hỏi hiện tại:", JSON.stringify(currentQuestion, null, 2)); 
        switch (gameType) {
            case 'Quiz':
            return (
                <View style={styles.uiContainer}>
                    <View style={styles.questionCard}>
                        <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
                    </View>

                    {/* Container cha cho lưới 2x2 */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
                        {currentQuestion.options && currentQuestion.options.map((option, index) => {
                            // Mảng màu sắc cho 4 ô
                            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']; // Đỏ, Xanh ngọc, Xanh dương, Cam
                            
                            const isCorrect = String(option).toLowerCase() === String(currentQuestion.correctAnswer).toLowerCase();
                            const isSelected = selectedAnswer === option;

                            // Logic màu sắc: dùng màu cố định nếu chưa trả lời, 
                            // dùng màu đúng/sai nếu đã trả lời
                            let btnColor = colors[index % colors.length]; // Lấy màu theo index
                            if (answered) {
                                if (isCorrect) btnColor = '#2ECC71'; // Xanh lá nếu đúng
                                else if (isSelected) btnColor = '#E74C3C'; // Đỏ nếu chọn sai
                                else btnColor = '#BDC3C7'; // Xám nếu không chọn
                            }

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionBtn, 
                                        { 
                                            width: '48%', // Chia đôi màn hình cho 2 cột
                                            aspectRatio: 2, // Tạo hình chữ nhật cân đối
                                            backgroundColor: btnColor,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }
                                    ]}
                                    onPress={() => handleAnswer(option)}
                                    disabled={answered}
                                >
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            );
            case 'Matching':
    return (
        <View style={styles.uiContainer}>
            <View style={styles.questionCard}>
                <Text style={styles.questionText}>Hãy nối các cặp từ sau:</Text>
            </View>

            {/* Render danh sách các cặp từ mảng pairs */}
            <View style={{ gap: 10 }}>
                {currentQuestion.pairs && currentQuestion.pairs.map((item, index) => (
                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={[styles.optionBtn, { backgroundColor: Colors.primary, width: '45%' }]}>
                            <Text style={{ color: '#fff' }}>{item.term}</Text>
                        </View>
                        <View style={[styles.optionBtn, { backgroundColor: Colors.accent, width: '45%' }]}>
                            <Text style={{ color: '#fff' }}>{item.definition}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );

            case 'Flashcard':
                return (
                    <View style={styles.uiContainer}>
                        <View style={styles.questionCard}>
                            <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.flashcard, isFlipped && styles.flashcardFlipped]}
                            onPress={() => setIsFlipped(!isFlipped)}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.flashcardLabel}>
                                {isFlipped ? '✅ ĐÁP ÁN' : '❓ CÂU HỎI — Bấm để lật'}
                            </Text>
                            <Text style={styles.flashcardContent}>
                                {isFlipped ? currentQuestion.correctAnswer : currentQuestion.questionText}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={() => handleAnswer(currentQuestion.correctAnswer)}
                        >
                            <Text style={styles.submitBtnText}>✓ Đã thuộc — Câu tiếp theo</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'PictureQuiz':
                return (
                    <View style={styles.uiContainer}>
                        <View style={styles.questionCard}>
                            <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
                        </View>
                        // Thay currentQuestion.imageUrl thành currentQuestion.image?.url
                            {currentQuestion.image?.url ? (
                                <Image source={{ uri: currentQuestion.image.url }} style={styles.quizImage} />
                            ) : currentQuestion.imageName ? (
                            <View style={styles.imagePlaceholder}>
                                <Text style={styles.imagePlaceholderText}>🖼️ {currentQuestion.imageName}</Text>
                            </View>
                        ) : null}
                        <TextInput
                            style={styles.textInput}
                            placeholder="Nhập đáp án..."
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={textInput}
                            onChangeText={setTextInput}
                        />
                        <TouchableOpacity style={styles.submitBtn} onPress={() => handleAnswer(textInput)}>
                            <Text style={styles.submitBtnText}>Nộp đáp án →</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'WordScramble':
    return (
        <View style={styles.uiContainer}>
            <View style={styles.questionCard}>
                <Text style={styles.scrambleLabel}>Sắp xếp lại từ này:</Text>
                {/* SỬA CHỖ NÀY: dùng scrambledWord thay vì questionText */}
                <Text style={styles.scrambleWord}>{scrambledWord}</Text> 
                <Text style={styles.scrambleHint}>Chủ đề: {currentQuestion.category}</Text>
            </View>
            <TextInput
                style={styles.textInput}
                placeholder="Nhập từ đúng..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={textInput}
                onChangeText={setTextInput}
                autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.submitBtn} onPress={() => handleAnswer(textInput)}>
                <Text style={styles.submitBtnText}>Kiểm tra →</Text>
            </TouchableOpacity>
        </View>
    );

            default:
                return (
                    <View style={styles.uiContainer}>
                        <View style={styles.questionCard}>
                            <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
                            <Text style={styles.defaultHint}>Trò chơi [{gameType}] đang được phát triển.</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.submitBtn, { backgroundColor: Colors.accent }]}
                            onPress={() => handleAnswer(currentQuestion.correctAnswer)}
                        >
                            <Text style={styles.submitBtnText}>Tiếp tục →</Text>
                        </TouchableOpacity>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {/* StatusBar cũng nên thiết lập translucent để hiển thị đúng */}
        <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} translucent={true} />

        {/* Progress bar */}
        <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.questionCount}>{currentIndex + 1}/{questions.length}</Text>
                    <Text style={styles.gameTypeLabel}>{gameType}</Text>
                </View>

                {/* Timer */}
                <View style={[styles.timerCircle, { borderColor: timerColor }]}>
                    <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}</Text>
                </View>

                {/* Score */}
                <View style={styles.scoreBox}>
                    <Text style={styles.scoreLabel}>ĐIỂM</Text>
                    <Text style={styles.scoreValue}>{score}</Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {renderGameUI()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    
    container: { flex: 1, backgroundColor: Colors.bgDark },
    center: {
        flex: 1, backgroundColor: Colors.bgDark,
        justifyContent: 'center', alignItems: 'center', padding: 24,
    },
    loadingText: { color: Colors.textMuted, marginTop: 12, fontSize: 16 },
    errorEmoji: { fontSize: 52, marginBottom: 12 },
    errorText: { color: Colors.textLight, fontSize: 16, textAlign: 'center', marginBottom: 20 },
    backBtn: {
        backgroundColor: Colors.primary, paddingHorizontal: 24,
        paddingVertical: 12, borderRadius: 12,
    },
    backBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

    // Progress
    progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)' },
    progressBarFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 14,
        marginTop: Platform.OS === 'android' ? 10 : 0,
    },
    headerLeft: {},
    questionCount: { fontSize: 18, fontWeight: '900', color: Colors.textLight },
    gameTypeLabel: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
    timerCircle: {
        width: 54, height: 54, borderRadius: 27,
        borderWidth: 3, justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    timerText: { fontSize: 20, fontWeight: '900' },
    scoreBox: { alignItems: 'flex-end' },
    scoreLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '700', letterSpacing: 1 },
    scoreValue: { fontSize: 22, fontWeight: '900', color: Colors.accent },

    // Content
    content: { flex: 1, paddingHorizontal: 16, paddingBottom: 16 },
    uiContainer: { flex: 1 },

    // Question card
    questionCard: {
        backgroundColor: Colors.bgCard,
        borderRadius: 20, padding: 22,
        marginBottom: 16, borderWidth: 1, borderColor: Colors.border,
        minHeight: 100, justifyContent: 'center',
    },
    questionText: {
        fontSize: 18, fontWeight: '800',
        color: Colors.textLight, textAlign: 'center', lineHeight: 26,
    },

    // Options grid — 2 cột như Quizizz
    optionsGrid: {
        flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'space-between', gap: 10,
    },
    optionBtn: {
        width: '48%', borderRadius: 16,
        paddingVertical: 18, paddingHorizontal: 12,
        alignItems: 'center', justifyContent: 'center',
        minHeight: 80, elevation: 4,
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3, shadowRadius: 5,
    },
    optionCorrect: { borderWidth: 3, borderColor: Colors.correct },
    optionWrong:   { borderWidth: 3, borderColor: Colors.wrong, opacity: 0.7 },
    optionDimmed:  { opacity: 0.45 },
    optionShape: { fontSize: 18, marginBottom: 6, color: 'rgba(255,255,255,0.8)' },
    optionText: {
        color: '#fff', fontSize: 15, fontWeight: '800',
        textAlign: 'center', lineHeight: 20,
    },

    // Flashcard
    flashcard: {
        backgroundColor: Colors.primary, borderRadius: 20,
        padding: 28, alignItems: 'center', justifyContent: 'center',
        minHeight: 160, marginBottom: 16,
        borderWidth: 1, borderColor: Colors.border,
        elevation: 6,
    },
    flashcardFlipped: { backgroundColor: Colors.correct },
    flashcardLabel: {
        fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.7)',
        marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1,
    },
    flashcardContent: {
        fontSize: 20, fontWeight: '800', color: '#fff', textAlign: 'center',
    },

    // Text input
    textInput: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 14, paddingHorizontal: 18, paddingVertical: 16,
        fontSize: 17, color: Colors.textLight,
        borderWidth: 1, borderColor: Colors.border,
        marginBottom: 14,
    },

    // Submit button
    submitBtn: {
        backgroundColor: Colors.primary, borderRadius: 14,
        paddingVertical: 16, alignItems: 'center',
        elevation: 5, shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4, shadowRadius: 8,
    },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

    // Image
    quizImage: {
        width: '100%', height: 180, borderRadius: 16,
        marginBottom: 14, resizeMode: 'contain',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    imagePlaceholder: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 14,
    },
    imagePlaceholderText: { color: Colors.textMuted, fontSize: 15 },

    // Word scramble
    scrambleLabel: {
        fontSize: 13, color: Colors.textMuted, textAlign: 'center',
        marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1,
    },
    scrambleWord: {
        fontSize: 32, fontWeight: '900', color: Colors.accent,
        textAlign: 'center', letterSpacing: 6, marginBottom: 8,
    },
    scrambleHint: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },

    defaultHint: {
        fontSize: 13, color: Colors.textMuted,
        textAlign: 'center', marginTop: 10, fontStyle: 'italic',
    },
});
