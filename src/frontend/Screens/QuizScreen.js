import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, ActivityIndicator, StyleSheet,
  TouchableOpacity, Alert,
  SafeAreaView, StatusBar, ScrollView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import { useQuiz } from '../Hooks/useQuiz';
import { useTheme } from '../context/ThemeContext';
import QuizGame from './games/QuizGame';
import TrueFalseGame from './games/TrueFalseGame';
import FlashcardGame from './games/FlashcardGame';
import WordScrambleGame from './games/WordScrambleGame';
import FillInBlankGame from './games/FillInBlankGame';

export default function QuizScreen({ route, navigation }) {
  const { gameType } = route.params || { gameType: 'Quiz' };
  const { questions, loading, error, fetchQuestions } = useQuiz(gameType);
  const { isDark, theme: C, powerUpsEnabled, powerUpCounts } = useTheme();

  // ── State chung ─────────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCorrectThisTurn, setIsCorrectThisTurn] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(39);
  const timerRef = useRef(null);

  // Refs để onNext luôn đọc được giá trị mới nhất (tránh stale closure)
  const scoreRef = useRef(0);
  const correctCountRef = useRef(0);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { correctCountRef.current = correctCount; }, [correctCount]);

  // ── Power-up state ───────────────────────────────────────────────────────────
  const [doublePoints, setDoublePoints] = useState(false);
  // Khởi tạo từ powerUpCounts trong ThemeContext (đã load từ AsyncStorage / PowerUpsScreen)
  const [sessionCounts, setSessionCounts] = useState(() => ({
    doublePoints: powerUpCounts?.doublePoints ?? 2,
    freeze: powerUpCounts?.freeze ?? 1,
    eliminate: powerUpCounts?.eliminate ?? 1,
  }));

  // Đồng bộ lại sessionCounts khi powerUpCounts thay đổi (ví dụ sau khi settings load xong)
  const sessionInitialized = useRef(false);
  useEffect(() => {
    if (!sessionInitialized.current && (powerUpCounts.doublePoints !== undefined)) {
      setSessionCounts({
        doublePoints: powerUpCounts.doublePoints,
        freeze: powerUpCounts.freeze,
        eliminate: powerUpCounts.eliminate,
      });
      sessionInitialized.current = true;
    }
  }, [powerUpCounts]);
  const [frozen, setFrozen] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState([]);
  // Lưu điểm thực tế đã cộng trong lượt này để hiển thị đúng trong feedback
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  const [submitting, setSubmitting] = useState(false); // FIX #11: tránh submit nhiều lần

  // ── Lifecycle ────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchQuestions();
    return () => clearInterval(timerRef.current);
  }, [fetchQuestions]);

  useEffect(() => {
    if (questions.length === 0 || loading) return;
    setTimeLeft(39);
    if (currentIndex === 0) {
      setAnswered(false);
      setSelectedAnswer(null);
    }
    // LuckyNumber không cần timer
    if (gameType === 'LuckyNumber') return;
    if (timerRef.current) clearInterval(timerRef.current);
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
    return () => clearInterval(timerRef.current);
  }, [currentIndex, questions, loading]);

  // ── Hết giờ ──────────────────────────────────────────────────────────────────
  const handleTimeOut = () => {
    if (answered) return;
    setAnswered(true);
    setIsTimeOut(true);
    setIsCorrectThisTurn(false);
    setCombo(0);
  };

  // ── Power-ups ────────────────────────────────────────────────────────────────
  const handleDoublePoints = () => {
    if (!powerUpsEnabled || answered || sessionCounts.doublePoints <= 0) return;
    setDoublePoints(true);
    setSessionCounts((prev) => ({ ...prev, doublePoints: prev.doublePoints - 1 }));
    Alert.alert('×2 Nhân đôi điểm!', 'Câu này sẽ được tính 20 điểm nếu đúng!');
  };

  const handleFreeze = () => {
    if (!powerUpsEnabled || answered || frozen || sessionCounts.freeze <= 0) return;
    setFrozen(true);
    setSessionCounts((prev) => ({ ...prev, freeze: prev.freeze - 1 }));
    clearInterval(timerRef.current);
    Alert.alert('❄ Đóng băng!', 'Đồng hồ dừng trong 5 giây!');
    setTimeout(() => {
      setFrozen(false);
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
    }, 5000);
  };

  // Cây bút thần — loại 2 đáp án sai ngẫu nhiên
  const handleEliminate = () => {
    if (!powerUpsEnabled || answered || sessionCounts.eliminate <= 0) return;
    if (gameType !== 'Quiz') {
      Alert.alert('Cây bút thần', 'Vật phẩm này chỉ dùng được trong chế độ Quiz trắc nghiệm.');
      return;
    }
    const options = currentQuestion?.options || [];
    const correct = String(currentQuestion?.correctAnswer).trim().toLowerCase();
    // Lấy các đáp án sai
    const wrongOptions = options.filter(
      (opt) => String(opt).trim().toLowerCase() !== correct && !eliminatedOptions.includes(opt)
    );
    if (wrongOptions.length < 2) {
      Alert.alert('Cây bút thần', 'Không đủ đáp án sai để loại bỏ!');
      return;
    }
    // Chọn ngẫu nhiên 2 đáp án sai để loại
    const shuffled = wrongOptions.sort(() => Math.random() - 0.5);
    const toEliminate = shuffled.slice(0, 2);
    setEliminatedOptions(toEliminate);
    setSessionCounts((prev) => ({ ...prev, eliminate: prev.eliminate - 1 }));
  };

  // ── Xử lý đáp án ─────────────────────────────────────────────────────────────
  /**
   * Kiểm tra đáp án đúng/sai theo từng loại game.
   * Các game dùng textInput (FillInBlank, WordScramble, LuckyNumber) truyền
   * userAnswer = textInput từ state; các game còn lại truyền giá trị đã chọn.
   */
  const handleAnswer = (userAnswer) => {
    if (answered) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setAnswered(true);
    setSelectedAnswer(userAnswer);

    const normalizeTF = (val) => {
      const s = String(val).trim().toLowerCase();
      if (s === 'đúng' || s === 'true' || s === 'yes' || s === 'y' || s === '1' || s === 'đ') return 'true';
      if (s === 'sai' || s === 'false' || s === 'no' || s === 'n' || s === '0' || s === 's') return 'false';
      return s;
    };

    const correct = String(currentQuestion.correctAnswer).trim().toLowerCase();
    const given = String(userAnswer ?? textInput).trim().toLowerCase();

    let isCorrect = false;
    if (gameType === 'TrueFalse') {
      isCorrect = normalizeTF(given) === normalizeTF(correct);
    } else {
      isCorrect = given === correct;
    }

    setIsCorrectThisTurn(isCorrect);

    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;
    const newCombo = isCorrect ? combo + 1 : 0;
    const bonus = newCombo >= 3 ? 5 : 0;
    const basePoints = doublePoints ? 20 : 10;
    const pointsEarned = isCorrect ? basePoints + bonus : 0;
    const newScore = isCorrect ? score + pointsEarned : score;

    setLastPointsEarned(pointsEarned); // lưu để hiển thị đúng trong feedback
    setDoublePoints(false);            // reset sau khi đã tính điểm

    if (isCorrect) {
      setScore(newScore);
      setCombo(newCombo);
      setCorrectCount(newCorrectCount);
    } else {
      setCombo(0);
    }
  };

  // Shortcut cho các game dùng textInput
  const handleTextAnswer = () => handleAnswer(textInput);

  // ── Câu tiếp theo / kết thúc ─────────────────────────────────────────────────
  const nextQuestion = async (currentScore, finalCorrectCount) => {
    setAnswered(false);
    setSelectedAnswer(null);
    setTextInput('');
    setIsTimeOut(false);
    setIsCorrectThisTurn(false);
    setEliminatedOptions([]);
    setLastPointsEarned(0);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (submitting) return; // FIX #11: chặn submit nhiều lần
      setSubmitting(true);
      if (timerRef.current) clearInterval(timerRef.current);
      try {
        const token = await AsyncStorage.getItem('userToken');
        const res = await fetch(`${BASE_URL}/game/game-over`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && token !== 'GUEST' ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            gameType,
            correctAnswersCount: finalCorrectCount,
            score: currentScore, // FIX #4: truyền điểm thực từ frontend
          }),
        });
        // FIX #12: token hết hạn → redirect về Login
        if (res.status === 401) {
          await AsyncStorage.multiRemove(['userToken', 'userId', 'userInfo']);
          navigation.replace('Login');
          return;
        }
      } catch (err) {
        console.warn('Lỗi lưu kết quả game:', err.message);
      } finally {
        setSubmitting(false);
      }
      navigation.navigate('Leaderboard', { score: currentScore, total: questions.length });
    }
  };

  // ── Loading / Error ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: C.bgApp }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgApp} />
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.loadingText, { color: C.textMuted }]}>Loading questions...</Text>
      </View>
    );
  }

  if (error || questions.length === 0) {
    // FIX #12: token hết hạn → về Login
    if (error === 'TOKEN_EXPIRED') {
      AsyncStorage.multiRemove(['userToken', 'userId', 'userInfo']).then(() => {
        navigation.replace('Login');
      });
      return null;
    }
    return (
      <View style={[styles.center, { backgroundColor: C.bgApp }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgApp} />
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={[styles.errorText, { color: C.textPrimary }]}>
          {error || `No questions for [${gameType}]`}
        </Text>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: C.primary }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.backBtnText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Dữ liệu câu hỏi hiện tại ─────────────────────────────────────────────────
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = (currentIndex + 1) / totalQuestions;
  const timerColor = timeLeft <= 5 ? C.wrong : timeLeft <= 10 ? C.warning : C.accent;
  const timerBg = timeLeft <= 5 ? '#FEE2E2' : timeLeft <= 10 ? '#FEF3C7' : C.accentLight;
  const timerStr = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`;

  // ── Render game component theo gameType ──────────────────────────────────────
  const renderGameUI = () => {
    switch (gameType) {
      case 'Quiz':
        return (
          <QuizGame
            question={currentQuestion}
            answered={answered}
            selectedAnswer={selectedAnswer}
            onAnswer={handleAnswer}
            eliminatedOptions={eliminatedOptions}
          />
        );
      case 'TrueFalse':
        return (
          <TrueFalseGame
            question={currentQuestion}
            answered={answered}
            selectedAnswer={selectedAnswer}
            onAnswer={handleAnswer}
          />
        );
      case 'Flashcard':
        return (
          <FlashcardGame
            question={currentQuestion}
            answered={answered}
            onAnswer={handleAnswer}
            onNext={() => nextQuestion(scoreRef.current, correctCountRef.current)}
          />
        );
      case 'WordScramble':
        return (
          <WordScrambleGame
            question={currentQuestion}
            answered={answered}
            textInput={textInput}
            onChangeText={setTextInput}
            onAnswer={handleTextAnswer}
          />
        );
      case 'FillInBlank':
        return (
          <FillInBlankGame
            question={currentQuestion}
            answered={answered}
            textInput={textInput}
            onChangeText={setTextInput}
            onAnswer={handleTextAnswer}
          />
        );
      default:
        return (
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: C.primary }]}
            onPress={() => handleAnswer(currentQuestion.correctAnswer)}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>Continue →</Text>
          </TouchableOpacity>
        );
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgApp} />

      {/* ── Sub-header ── */}
      <View style={[styles.subHeader, { backgroundColor: C.bgCard, borderBottomColor: C.border }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: C.bgApp, borderColor: C.border }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={[styles.backBtnText, { color: C.textMuted }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressInfo}>
          <Text style={[styles.questionCount, { color: C.textPrimary }]}>
            Question {currentIndex + 1} of {totalQuestions}
          </Text>
          <Text style={[styles.progressPct, { color: C.textMuted }]}>
            {Math.round(progress * 100)}% Complete
          </Text>
          <View style={[styles.progressBarBg, { backgroundColor: C.borderLight }]}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: C.primary }]} />
          </View>
        </View>
        <View style={[styles.timerBadge, { backgroundColor: timerBg }]}>
          <Text style={[styles.timerText, { color: timerColor }]}>
            {frozen ? '❄ Frozen' : `⏱ ${timerStr}`}
          </Text>
        </View>
        <View style={styles.scoreArea}>
          <Text style={[styles.scoreLabel, { color: C.textMuted }]}>CURRENT SCORE</Text>
          <Text style={[styles.scoreValue, { color: C.primary }]}>{score.toLocaleString()}</Text>
          {combo >= 2 && (
            <View style={[styles.comboBadge, { backgroundColor: C.accentLight }]}>
              <Text style={[styles.comboText, { color: C.accent }]}>🌿 {combo} Streak</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Main 3-column area ── */}
      <View style={styles.mainArea}>
        {/* Left: power-ups */}
        <View style={styles.powerUpsCol}>
          {/* Nhân đôi điểm */}
          <TouchableOpacity
            style={[
              styles.powerBtn,
              { backgroundColor: C.bgCard, borderColor: C.border },
              (!powerUpsEnabled || answered || sessionCounts.doublePoints <= 0) && styles.powerBtnDisabled,
            ]}
            onPress={handleDoublePoints}
            activeOpacity={0.8}
            disabled={!powerUpsEnabled || answered || sessionCounts.doublePoints <= 0}
          >
            <Text style={[styles.powerBtnText, { color: C.primary }]}>×2</Text>
            <View style={[styles.powerBadgeRed, { backgroundColor: C.wrong }]}>
              <Text style={styles.powerBadgeRedText}>{sessionCounts.doublePoints}</Text>
            </View>
          </TouchableOpacity>

          {/* Đóng băng */}
          <TouchableOpacity
            style={[
              styles.powerBtn,
              { backgroundColor: frozen ? '#DBEAFE' : C.bgCard, borderColor: frozen ? '#3B82F6' : C.border },
              (!powerUpsEnabled || answered || frozen || sessionCounts.freeze <= 0) && styles.powerBtnDisabled,
            ]}
            onPress={handleFreeze}
            activeOpacity={0.8}
            disabled={!powerUpsEnabled || answered || frozen || sessionCounts.freeze <= 0}
          >
            <Text style={styles.powerBtnIcon}>❄</Text>
            <View style={[styles.powerBadgeRed, { backgroundColor: C.wrong }]}>
              <Text style={styles.powerBadgeRedText}>{sessionCounts.freeze}</Text>
            </View>
          </TouchableOpacity>

          {/* Cây bút thần */}
          <TouchableOpacity
            style={[
              styles.powerBtn,
              { backgroundColor: C.bgCard, borderColor: C.border },
              (!powerUpsEnabled || answered || sessionCounts.eliminate <= 0 || gameType !== 'Quiz') && styles.powerBtnDisabled,
            ]}
            onPress={handleEliminate}
            activeOpacity={0.8}
            disabled={!powerUpsEnabled || answered || sessionCounts.eliminate <= 0 || gameType !== 'Quiz'}
          >
            <Text style={styles.powerBtnIcon}>✏</Text>
            <View style={[styles.powerBadgeRed, { backgroundColor: C.wrong }]}>
              <Text style={styles.powerBadgeRedText}>{sessionCounts.eliminate}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Center: question card */}
        <View style={styles.questionCol}>
          <View style={[styles.questionCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={[styles.questionText, { color: C.textPrimary }]}>
              {currentQuestion.questionText}
            </Text>
            <View style={[styles.questionDivider, { backgroundColor: C.borderLight }]} />
          </View>
        </View>

        {/* Right: progress info */}
        <View style={styles.liveCol}>
          <View style={[styles.liveAvatar, { backgroundColor: C.primary }]}>
            <Text style={styles.liveAvatarText}>{totalQuestions - currentIndex}</Text>
          </View>
          <View style={[styles.liveLine, { backgroundColor: C.border }]} />
          <Text style={styles.liveIcon}>📝</Text>
          <Text style={[styles.liveCount, { color: C.textMuted }]}>Còn lại</Text>
        </View>
      </View>

      {/* ── Answer area ── */}
      <ScrollView
        style={styles.answerScroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.answerScrollContent,
          answered && { paddingBottom: 100 },
        ]}
      >
        {renderGameUI()}
      </ScrollView>

      {/* ── Feedback Banner — ẩn với LuckyNumber và Flashcard (tự quản lý luồng) ── */}
      {answered && gameType !== 'Flashcard' && (
        <View
          style={[
            styles.feedbackBanner,
            {
              backgroundColor: isTimeOut ? '#FEF3C7' : isCorrectThisTurn ? '#F0FDF4' : '#FEF2F2',
              borderTopColor: isTimeOut ? '#FDE68A' : isCorrectThisTurn ? '#DCFCE7' : '#FEE2E2',
            },
          ]}
        >
          <View style={styles.feedbackInfo}>
            <Text
              style={[
                styles.feedbackTitle,
                { color: isTimeOut ? '#B45309' : isCorrectThisTurn ? '#166534' : '#991B1B' },
              ]}
            >
              {isTimeOut ? '⏳ Hết giờ!' : isCorrectThisTurn ? '🎉 Chính xác!' : '❌ Sai rồi!'}
            </Text>
            <Text
              style={[
                styles.feedbackDesc,
                { color: isTimeOut ? '#D97706' : isCorrectThisTurn ? '#15803D' : '#B91C1C' },
              ]}
            >
              {isTimeOut
                ? `Đáp án đúng: ${currentQuestion.correctAnswer}`
                : isCorrectThisTurn
                  ? combo >= 3
                    ? `+${lastPointsEarned} điểm (🔥 Combo x${combo})`
                    : `+${lastPointsEarned} điểm`
                  : `Đáp án đúng: ${currentQuestion.correctAnswer}`}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.feedbackBtn,
              {
                backgroundColor: isTimeOut
                  ? '#F59E0B'
                  : isCorrectThisTurn
                    ? '#22C55E'
                    : '#EF4444',
              },
            ]}
            onPress={() => nextQuestion(scoreRef.current, correctCountRef.current)}
            activeOpacity={0.85}
          >
            <Text style={styles.feedbackBtnText}>
              {submitting ? 'Đang lưu...' : 'Tiếp tục →'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: 16 },
  errorEmoji: { fontSize: 52, marginBottom: 12 },
  errorText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: { fontWeight: '700', fontSize: 16, lineHeight: 18 },

  subHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, gap: 10,
  },
  progressInfo: { flex: 1 },
  questionCount: { fontSize: 12, fontWeight: '800', marginBottom: 1 },
  progressPct: { fontSize: 10, marginBottom: 4 },
  progressBarBg: { height: 4, borderRadius: 2 },
  progressBarFill: { height: 4, borderRadius: 2 },
  timerBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  timerText: { fontSize: 13, fontWeight: '800' },
  scoreArea: { alignItems: 'flex-end' },
  scoreLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  scoreValue: { fontSize: 18, fontWeight: '900' },
  comboBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8, marginTop: 2 },
  comboText: { fontSize: 9, fontWeight: '800' },

  mainArea: {
    flexDirection: 'row', paddingHorizontal: 12,
    paddingVertical: 14, gap: 10, alignItems: 'flex-start',
  },
  powerUpsCol: { width: 44, gap: 8, alignItems: 'center' },
  powerBtn: {
    width: 40, height: 40, borderRadius: 10, borderWidth: 1,
    justifyContent: 'center', alignItems: 'center',
    position: 'relative', elevation: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 3,
  },
  powerBtnDisabled: { opacity: 0.4 },
  powerBtnText: { fontSize: 12, fontWeight: '900' },
  powerBtnIcon: { fontSize: 16 },
  powerBadgeRed: {
    position: 'absolute', top: -4, right: -4,
    width: 16, height: 16, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  powerBadgeRedText: { color: '#fff', fontSize: 9, fontWeight: '900' },

  questionCol: { flex: 1 },
  questionCard: {
    borderRadius: 18, padding: 18, borderWidth: 1,
    elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8,
  },
  questionText: {
    fontSize: 15, fontWeight: '800',
    textAlign: 'center', lineHeight: 22, marginBottom: 10,
  },
  questionDivider: { height: 2, borderRadius: 1, marginTop: 4 },

  liveCol: { width: 44, alignItems: 'center', gap: 4 },
  liveAvatar: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  liveAvatarText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  liveLine: { width: 2, height: 20, borderRadius: 1 },
  liveIcon: { fontSize: 16 },
  liveCount: { fontSize: 9, fontWeight: '700', textAlign: 'center' },

  answerScroll: { flex: 1 },
  answerScrollContent: { paddingHorizontal: 12, paddingBottom: 24 },

  submitBtn: {
    borderRadius: 14, paddingVertical: 14, alignItems: 'center',
    elevation: 3, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6,
  },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  feedbackBanner: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    zIndex: 9999,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderTopWidth: 2, elevation: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 6,
  },
  feedbackInfo: { flex: 1, marginRight: 12 },
  feedbackTitle: { fontSize: 16, fontWeight: '900', marginBottom: 2 },
  feedbackDesc: { fontSize: 13, fontWeight: '700' },
  feedbackBtn: {
    paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 12, justifyContent: 'center', alignItems: 'center',
  },
  feedbackBtnText: { color: '#fff', fontSize: 14, fontWeight: '900' },
});
