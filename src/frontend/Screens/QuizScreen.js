import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ActivityIndicator, StyleSheet,
  TouchableOpacity, TextInput, Alert,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { useQuiz } from '../Hooks/useQuiz';
import { Colors } from '../Styles/Colors';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizScreen({ route, navigation }) {
  const { gameType } = route.params || { gameType: 'Quiz' };
  const { questions, loading, error, fetchQuestions } = useQuiz(gameType);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(1250);
  const [combo, setCombo] = useState(3);
  const [textInput, setTextInput] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(39);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (questions.length > 0 && !loading) {
      setTimeLeft(39);
      // Chỉ reset timer — state đã được reset trong nextQuestion()
      // Lần đầu load (currentIndex === 0) thì reset đầy đủ
      if (currentIndex === 0) {
        setAnswered(false);
        setSelectedAnswer(null);
      }
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
    }
    return () => clearInterval(timerRef.current);
  }, [currentIndex, questions, loading]);

  const handleTimeOut = () => {
    if (answered) return;
    setAnswered(true);
    setCombo(0);
    setTimeout(() => {
      Alert.alert('⏳ Time Up!', `Correct answer: ${questions[currentIndex]?.correctAnswer}`, [
        { text: 'Continue', onPress: () => nextQuestion(score) },
      ]);
    }, 300);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.bgApp} />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (error || questions.length === 0) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.bgApp} />
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>{error || `No questions for [${gameType}]`}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={styles.backBtnText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = (currentIndex + 1) / totalQuestions;
  const timerColor = timeLeft <= 5 ? Colors.wrong : timeLeft <= 10 ? Colors.warning : Colors.accent;
  const timerBg = timeLeft <= 5 ? '#FEE2E2' : timeLeft <= 10 ? '#FEF3C7' : Colors.accentLight;

  const handleAnswer = (userAnswer) => {
    if (answered) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setAnswered(true);
    setSelectedAnswer(userAnswer);

    let isCorrect = false;
    if (gameType === 'Quiz' || gameType === 'TrueFalse') {
      isCorrect =
        String(userAnswer).trim().toLowerCase() ===
        String(currentQuestion.correctAnswer).trim().toLowerCase();
    } else if (gameType === 'FillInBlank' || gameType === 'WordScramble') {
      isCorrect =
        String(textInput).trim().toLowerCase() ===
        String(currentQuestion.correctAnswer).trim().toLowerCase();
    } else {
      isCorrect = true;
    }

    const newCombo = isCorrect ? combo + 1 : 0;
    const bonus = newCombo >= 3 ? 5 : 0;
    const newScore = isCorrect ? score + 10 + bonus : score;
    if (isCorrect) {
      setScore(newScore);
      setCombo(newCombo);
    } else {
      setCombo(0);
    }

    setTimeout(() => {
      if (isCorrect) {
        const msg = bonus > 0 ? `+10 pts  🔥 Combo x${newCombo} (+${bonus} bonus)` : '+10 pts';
        Alert.alert('🎉 Correct!', msg, [
          { text: 'Next →', onPress: () => nextQuestion(newScore) },
        ]);
      } else {
        Alert.alert('❌ Wrong!', `Correct answer: ${currentQuestion.correctAnswer}`, [
          { text: 'Next →', onPress: () => nextQuestion(score) },
        ]);
      }
    }, 400);
  };

  const nextQuestion = (currentScore) => {
    // Reset state TRƯỚC khi chuyển câu — tránh câu mới bị lock do answered = true
    setAnswered(false);
    setSelectedAnswer(null);
    setTextInput('');
    setIsFlipped(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      navigation.navigate('Leaderboard', { score: currentScore, total: questions.length });
    }
  };

  const getOptionStyle = (item) => {
    if (!answered) return styles.optionBtn;
    const isCorrectOpt =
      String(item).trim().toLowerCase() ===
      String(currentQuestion.correctAnswer).trim().toLowerCase();
    if (isCorrectOpt) return [styles.optionBtn, styles.optionCorrect];
    if (item === selectedAnswer) return [styles.optionBtn, styles.optionWrong];
    return [styles.optionBtn, styles.optionDimmed];
  };

  const getOptionLabelStyle = (item) => {
    if (!answered) return styles.optionLabel;
    const isCorrectOpt =
      String(item).trim().toLowerCase() ===
      String(currentQuestion.correctAnswer).trim().toLowerCase();
    if (isCorrectOpt) return [styles.optionLabel, { backgroundColor: Colors.correct }];
    if (item === selectedAnswer) return [styles.optionLabel, { backgroundColor: Colors.wrong }];
    return styles.optionLabel;
  };

  const renderQuizUI = () => {
    const options = currentQuestion.options || [];
    // Render 2x2 grid
    const rows = [options.slice(0, 2), options.slice(2, 4)];
    return (
      <View style={styles.answerGrid}>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.answerRow}>
            {row.map((item, colIdx) => {
              const idx = rowIdx * 2 + colIdx;
              return (
                <TouchableOpacity
                  key={idx}
                  style={getOptionStyle(item)}
                  onPress={() => handleAnswer(item)}
                  activeOpacity={0.85}
                  disabled={answered}
                >
                  <View style={getOptionLabelStyle(item)}>
                    <Text style={styles.optionLabelText}>{OPTION_LABELS[idx]}</Text>
                  </View>
                  <Text style={styles.optionText} numberOfLines={2}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const renderFlashcard = () => (
    <View style={styles.answerGrid}>
      <TouchableOpacity
        style={[styles.flashcard, isFlipped && styles.flashcardFlipped]}
        onPress={() => setIsFlipped(!isFlipped)}
        activeOpacity={0.9}
      >
        <Text style={styles.flashcardLabel}>
          {isFlipped ? '✅ ANSWER' : '❓ Tap to flip'}
        </Text>
        <Text style={styles.flashcardContent}>
          {isFlipped ? currentQuestion.correctAnswer : currentQuestion.questionText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => handleAnswer(currentQuestion.correctAnswer)}
        activeOpacity={0.85}
      >
        <Text style={styles.submitBtnText}>✓ Got it — Next question</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTextInput = (placeholder) => (
    <View style={styles.answerGrid}>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        value={textInput}
        onChangeText={setTextInput}
      />
      <TouchableOpacity style={styles.submitBtn} onPress={() => handleAnswer(textInput)} activeOpacity={0.85}>
        <Text style={styles.submitBtnText}>Submit Answer →</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGameUI = () => {
    switch (gameType) {
      case 'Quiz':
      case 'TrueFalse':
        return renderQuizUI();
      case 'Flashcard':
        return renderFlashcard();
      case 'WordScramble':
        return renderTextInput('Type the correct word...');
      default:
        return (
          <View style={styles.answerGrid}>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => handleAnswer(currentQuestion.correctAnswer)}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>Continue →</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  const timerStr = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgApp} />

      {/* ── Sub-header ── */}
      <View style={styles.subHeader}>
        {/* Progress info */}
        <View style={styles.progressInfo}>
          <Text style={styles.questionCount}>Question {currentIndex + 1} of {totalQuestions}</Text>
          <Text style={styles.progressPct}>{Math.round(progress * 100)}% Complete</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* Timer */}
        <View style={[styles.timerBadge, { backgroundColor: timerBg }]}>
          <Text style={[styles.timerText, { color: timerColor }]}>⏱ {timerStr}</Text>
        </View>

        {/* Score */}
        <View style={styles.scoreArea}>
          <Text style={styles.scoreLabel}>CURRENT SCORE</Text>
          <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
          {combo >= 2 && (
            <View style={styles.comboBadge}>
              <Text style={styles.comboText}>🌿 {combo} Streak</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Main 3-column area ── */}
      <View style={styles.mainArea}>
        {/* Left: power-ups */}
        <View style={styles.powerUpsCol}>
          <TouchableOpacity style={styles.powerBtn} activeOpacity={0.8}>
            <Text style={styles.powerBtnText}>+1</Text>
            <View style={styles.powerBadgeRed}>
              <Text style={styles.powerBadgeRedText}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.powerBtn} activeOpacity={0.8}>
            <Text style={styles.powerBtnIcon}>❄</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.powerBtn} activeOpacity={0.8}>
            <Text style={styles.powerBtnIcon}>⏩</Text>
          </TouchableOpacity>
        </View>

        {/* Center: question card */}
        <View style={styles.questionCol}>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
            <View style={styles.questionDivider} />
          </View>
        </View>

        {/* Right: live players */}
        <View style={styles.liveCol}>
          <View style={styles.liveAvatar}>
            <Text style={styles.liveAvatarText}>A</Text>
          </View>
          <View style={styles.liveLine} />
          <Text style={styles.liveIcon}>👥</Text>
          <Text style={styles.liveCount}>128 Live</Text>
        </View>
      </View>

      {/* ── Answer area ── */}
      <ScrollView
        style={styles.answerScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.answerScrollContent}
      >
        {renderGameUI()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgApp },
  center: {
    flex: 1, backgroundColor: Colors.bgApp,
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  loadingText: { color: Colors.textMuted, marginTop: 12, fontSize: 16 },
  errorEmoji: { fontSize: 52, marginBottom: 12 },
  errorText: { color: Colors.textPrimary, fontSize: 16, textAlign: 'center', marginBottom: 20 },
  backBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: 24,
    paddingVertical: 12, borderRadius: 12,
  },
  backBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Sub-header
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  progressInfo: { flex: 1 },
  questionCount: { fontSize: 12, fontWeight: '800', color: Colors.textPrimary, marginBottom: 1 },
  progressPct: { fontSize: 10, color: Colors.textMuted, marginBottom: 4 },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  timerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: { fontSize: 13, fontWeight: '800' },
  scoreArea: { alignItems: 'flex-end' },
  scoreLabel: { fontSize: 9, color: Colors.textMuted, fontWeight: '700', letterSpacing: 0.8 },
  scoreValue: { fontSize: 18, fontWeight: '900', color: Colors.primary },
  comboBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
  },
  comboText: { fontSize: 9, fontWeight: '800', color: '#166534' },

  // Main 3-column
  mainArea: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 10,
    alignItems: 'flex-start',
  },

  // Power-ups column
  powerUpsCol: {
    width: 44,
    gap: 8,
    alignItems: 'center',
  },
  powerBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  powerBtnText: { fontSize: 12, fontWeight: '900', color: Colors.primary },
  powerBtnIcon: { fontSize: 16 },
  powerBadgeRed: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.wrong,
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerBadgeRedText: { color: '#fff', fontSize: 9, fontWeight: '900' },

  // Question column
  questionCol: { flex: 1 },
  questionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  questionText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 10,
  },
  questionDivider: {
    height: 2,
    backgroundColor: Colors.borderLight,
    borderRadius: 1,
    marginTop: 4,
  },

  // Live column
  liveCol: {
    width: 44,
    alignItems: 'center',
    gap: 4,
  },
  liveAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveAvatarText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  liveLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.border,
    borderRadius: 1,
  },
  liveIcon: { fontSize: 16 },
  liveCount: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, textAlign: 'center' },

  // Answer scroll
  answerScroll: { flex: 1 },
  answerScrollContent: { paddingHorizontal: 12, paddingBottom: 24 },

  // Answer grid (2x2)
  answerGrid: { gap: 8 },
  answerRow: { flexDirection: 'row', gap: 8 },
  optionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 12,
    gap: 10,
    minHeight: 56,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  optionCorrect: {
    borderColor: Colors.correct,
    backgroundColor: '#F0FDF4',
  },
  optionWrong: {
    borderColor: Colors.wrong,
    backgroundColor: '#FEF2F2',
  },
  optionDimmed: { opacity: 0.45 },
  optionLabel: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabelText: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  // Flashcard
  flashcard: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    marginBottom: 10,
    elevation: 3,
  },
  flashcardFlipped: { backgroundColor: Colors.correct },
  flashcardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  flashcardContent: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },

  // Text input
  textInput: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 10,
  },

  // Submit button
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
