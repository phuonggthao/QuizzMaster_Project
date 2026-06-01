// games/WordScrambleGame.js — Sắp xếp chữ cái bị xáo trộn
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

/**
 * Xáo trộn từ (Fisher-Yates) — đảm bảo kết quả khác từ gốc
 */
function scrambleWord(word) {
  if (!word) return '';
  let arr = word.toUpperCase().split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join('');
  return result === word.toUpperCase() && word.length > 1 ? scrambleWord(word) : result;
}

/**
 * Props:
 *  - question      : object câu hỏi hiện tại
 *  - answered      : boolean đã trả lời chưa
 *  - textInput     : giá trị input hiện tại
 *  - onChangeText  : callback cập nhật input
 *  - onAnswer()    : callback submit đáp án
 */
export default function WordScrambleGame({ question, answered, textInput, onChangeText, onAnswer }) {
  const { theme: C } = useTheme();
  const [scrambled, setScrambled] = useState('');

  useEffect(() => {
    if (question?.correctAnswer) {
      setScrambled(scrambleWord(question.correctAnswer));
    }
  }, [question]);

  return (
    <View style={styles.container}>
      {/* Hiển thị từ bị xáo trộn */}
      <View style={[styles.scrambleBox, { backgroundColor: C.accentLight, borderColor: C.accent }]}>
        <Text style={[styles.scrambleLabel, { color: C.textMuted }]}>Từ bị xáo trộn:</Text>
        <Text style={[styles.scrambleWord, { color: C.accent }]}>{scrambled}</Text>
      </View>

      {/* Ô nhập đáp án */}
      <TextInput
        style={[
          styles.input,
          { backgroundColor: C.bgCard, borderColor: C.border, color: C.textPrimary },
        ]}
        placeholder="Nhập từ đúng thứ tự..."
        placeholderTextColor={C.textMuted}
        value={textInput}
        onChangeText={onChangeText}
        autoCapitalize="none"
        editable={!answered}
      />

      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: C.primary }, answered && styles.btnDisabled]}
        onPress={onAnswer}
        activeOpacity={0.85}
        disabled={answered}
      >
        <Text style={styles.submitBtnText}>Xác nhận đáp án →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  scrambleBox: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    alignItems: 'center',
  },
  scrambleLabel: { fontSize: 11, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 },
  scrambleWord: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
    flexShrink: 1,
    textAlign: 'center',
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1.5,
  },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6,
  },
  btnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
