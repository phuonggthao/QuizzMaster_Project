// games/FillInBlankGame.js — Điền vào chỗ trống
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

/**
 * Props:
 *  - question      : object câu hỏi hiện tại
 *  - answered      : boolean đã trả lời chưa
 *  - textInput     : giá trị input hiện tại
 *  - onChangeText  : callback cập nhật input
 *  - onAnswer()    : callback submit đáp án
 */
export default function FillInBlankGame({ question, answered, textInput, onChangeText, onAnswer }) {
  const { theme: C } = useTheme();

  // Tách câu hỏi thành phần trước và sau dấu ___
  const parts = (question?.questionText || '').split('___');
  const hasBlanks = parts.length > 1;

  return (
    <View style={styles.container}>
      {/* Hiển thị câu có chỗ trống nếu có dấu ___ */}
      {hasBlanks && (
        <View style={[styles.sentenceBox, { backgroundColor: C.bgCard, borderColor: C.border }]}>
          <Text style={[styles.sentenceText, { color: C.textPrimary }]}>
            {parts[0]}
            <Text style={[styles.blankHighlight, { color: C.primary }]}>
              {textInput || '______'}
            </Text>
            {parts[1]}
          </Text>
        </View>
      )}

      {/* Ô nhập đáp án */}
      <TextInput
        style={[
          styles.input,
          { backgroundColor: C.bgCard, borderColor: C.border, color: C.textPrimary },
        ]}
        placeholder="Điền câu trả lời vào đây..."
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
  sentenceBox: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
  },
  sentenceText: { fontSize: 15, lineHeight: 24, fontWeight: '600' },
  blankHighlight: { fontWeight: '900', textDecorationLine: 'underline' },
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
