// games/FlashcardGame.js — Thẻ học lật mặt (Flashcard) với animation 3D flip + ô điền đáp án
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, TextInput, Keyboard,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

/**
 * Luồng:
 *  1. Mặt trước (câu hỏi)  → nhấn thẻ → lật sang mặt sau (đáp án)  [lần 1]
 *  2. Mặt sau (đáp án)      → nhấn thẻ → lật úp lại                  [lần 2, lần cuối]
 *  3. Sau khi úp → hiện ô điền chữ → nhập → kiểm tra → sang câu tiếp
 *
 * Props:
 *  - question   : object câu hỏi hiện tại
 *  - answered   : boolean đã trả lời chưa
 *  - onAnswer() : callback khi xác nhận đáp án
 */
export default function FlashcardGame({ question, answered, onAnswer, onNext }) {
  const { theme: C } = useTheme();

  // phase: 'front' | 'back' | 'input'
  const [phase, setPhase] = useState('front');
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState(null); // null | 'correct' | 'wrong'

  const flipAnim = useRef(new Animated.Value(0)).current;
  const isFlipping = useRef(false);

  // Reset toàn bộ state khi sang câu mới
  useEffect(() => {
    setPhase('front');
    setUserInput('');
    setResult(null);
    isFlipping.current = false;
    flipAnim.setValue(0);
  }, [question?._id]);

  // Chạy animation lật, gọi callback ở giữa (lúc thẻ quay 90°)
  const runFlip = (toValue, onMidpoint) => {
    if (isFlipping.current) return;
    isFlipping.current = true;

    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => {
      isFlipping.current = false;
    });

    setTimeout(onMidpoint, 150);
  };

  const handleCardPress = () => {
    if (phase === 'front') {
      // Lật sang mặt sau — cho phép
      runFlip(1, () => setPhase('back'));
    } else if (phase === 'back') {
      // Lật úp lại — lần cuối, sau đó hiện ô nhập
      runFlip(2, () => setPhase('input'));
    }
    // phase === 'input': không lật nữa
  };

  const handleCheck = () => {
    Keyboard.dismiss();
    const correct = userInput.trim().toLowerCase() === question?.correctAnswer?.trim().toLowerCase();
    const newResult = correct ? 'correct' : 'wrong';
    setResult(newResult);
    // Báo QuizScreen tính điểm ngay, nhưng chưa chuyển câu
    onAnswer(correct ? question.correctAnswer : '');
  };

  // ── Interpolations ──
  // front: 0→1 quay từ 0° → 180°
  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  // back: 0→1 quay từ 180° → 360° (0°)
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0.49, 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0.49, 0.5],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Màu viền ô nhập theo kết quả
  const inputBorderColor = result === 'correct'
    ? (C.correct ?? '#16a34a')
    : result === 'wrong'
      ? (C.wrong ?? '#dc2626')
      : C.border;

  return (
    <View style={styles.container}>

      {/* ── Thẻ lật 3D ── */}
      <TouchableOpacity
        onPress={handleCardPress}
        activeOpacity={phase === 'input' ? 1 : 0.9}
        disabled={phase === 'input'}
        style={styles.cardWrapper}
      >
        {/* Mặt trước — câu hỏi */}
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: C.primary },
            {
              transform: [{ perspective: 1000 }, { rotateY: frontRotate }],
              opacity: frontOpacity,
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
            },
          ]}
        >
          <Text style={styles.cardHint}>❓ Nhấn để xem đáp án</Text>
          <Text style={styles.cardContent}>{question?.questionText}</Text>
        </Animated.View>

        {/* Mặt sau — đáp án */}
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: C.correct ?? '#16a34a' },
            {
              transform: [{ perspective: 1000 }, { rotateY: backRotate }],
              opacity: backOpacity,
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
            },
          ]}
        >
          <Text style={styles.cardHint}>✅ ĐÁP ÁN — Nhấn để úp lại</Text>
          <Text style={styles.cardContent}>{question?.correctAnswer}</Text>
        </Animated.View>

        {/* Mặt úp (phase = input) — thẻ trống */}
        {phase === 'input' && (
          <View style={[styles.card, { backgroundColor: C.bgCard, borderWidth: 2, borderColor: C.border }]}>
            <Text style={[styles.cardHint, { color: C.textMuted }]}>🃏 Thẻ đã úp</Text>
            <Text style={[styles.cardContent, { color: C.textMuted, fontSize: 40 }]}>?</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ── Ô điền đáp án (chỉ hiện sau khi úp) ── */}
      {phase === 'input' && (
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: C.textPrimary }]}>
            Bạn còn nhớ đáp án không? Điền vào đây:
          </Text>

          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: C.bgCard,
                color: C.textPrimary,
                borderColor: inputBorderColor,
              },
            ]}
            placeholder="Nhập đáp án..."
            placeholderTextColor={C.textMuted}
            value={userInput}
            onChangeText={setUserInput}
            editable={!result}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={!result ? handleCheck : undefined}
          />

          {/* Nút kiểm tra (chỉ hiện khi chưa có kết quả) */}
          {!result && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: C.primary },
                !userInput.trim() && styles.btnDisabled,
              ]}
              onPress={handleCheck}
              disabled={!userInput.trim() || answered}
              activeOpacity={0.85}
            >
              <Text style={styles.actionBtnText}>Kiểm tra →</Text>
            </TouchableOpacity>
          )}

          {/* Kết quả + nút tiếp theo gộp chung */}
          {result === 'correct' && (
            <TouchableOpacity
              style={styles.correctBadgeBtn}
              onPress={onNext}
              activeOpacity={0.85}
            >
              <Text style={styles.correctBadgeText}>🎉 Chính xác!</Text>
              <Text style={styles.correctBadgeNext}>Câu tiếp theo →</Text>
            </TouchableOpacity>
          )}

          {result === 'wrong' && (
            <View style={styles.wrongBadge}>
              <Text style={styles.wrongBadgeText}>
                ❌ Sai rồi! Đáp án đúng: "{question?.correctAnswer}"
              </Text>
              <TouchableOpacity
                style={styles.wrongNextBtn}
                onPress={onNext}
                activeOpacity={0.85}
              >
                <Text style={styles.wrongNextBtnText}>Câu tiếp theo →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },

  cardWrapper: {
    minHeight: 160,
    position: 'relative',
  },

  card: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    backfaceVisibility: 'hidden',
  },

  cardHint: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  cardContent: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
  },

  // ── Input section ──
  inputSection: {
    gap: 10,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },

  textInput: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '600',
  },

  resultBadge: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  resultText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },

  actionBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  btnDisabled: { opacity: 0.4 },
  actionBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // Badge đúng — xanh lá, nhấn được để sang câu tiếp
  correctBadgeBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    gap: 2,
  },
  correctBadgeText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
  correctBadgeNext: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '700',
  },

  // Badge sai — đỏ, không nhấn được, có nút nhỏ bên trong
  wrongBadge: {
    backgroundColor: '#fee2e2',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 10,
  },
  wrongBadgeText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  wrongNextBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  wrongNextBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
});
