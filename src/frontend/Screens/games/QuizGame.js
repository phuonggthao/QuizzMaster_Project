// games/QuizGame.js — Trắc nghiệm nhiều lựa chọn (MCQ)
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

/**
 * Props:
 *  - question     : object câu hỏi hiện tại
 *  - answered     : boolean đã trả lời chưa
 *  - selectedAnswer: giá trị đã chọn
 *  - onAnswer(item): callback khi chọn đáp án
 */
export default function QuizGame({ question, answered, selectedAnswer, onAnswer }) {
  const { theme: C } = useTheme();

  const options = question?.options || [];
  const rows = [options.slice(0, 2), options.slice(2, 4)];

  const getOptionStyle = (item) => {
    if (!answered) return [styles.optionBtn, { backgroundColor: C.bgCard, borderColor: C.border }];
    const isCorrect =
      String(item).trim().toLowerCase() ===
      String(question.correctAnswer).trim().toLowerCase();
    if (isCorrect) return [styles.optionBtn, styles.optionCorrect, { borderColor: C.correct }];
    if (item === selectedAnswer) return [styles.optionBtn, styles.optionWrong, { borderColor: C.wrong }];
    return [styles.optionBtn, styles.optionDimmed, { backgroundColor: C.bgCard, borderColor: C.border }];
  };

  const getLabelStyle = (item) => {
    if (!answered) return [styles.optionLabel, { backgroundColor: C.primaryLight }];
    const isCorrect =
      String(item).trim().toLowerCase() ===
      String(question.correctAnswer).trim().toLowerCase();
    if (isCorrect) return [styles.optionLabel, { backgroundColor: C.correct }];
    if (item === selectedAnswer) return [styles.optionLabel, { backgroundColor: C.wrong }];
    return [styles.optionLabel, { backgroundColor: C.primaryLight }];
  };

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((item, colIdx) => {
            const idx = rowIdx * 2 + colIdx;
            return (
              <TouchableOpacity
                key={idx}
                style={getOptionStyle(item)}
                onPress={() => onAnswer(item)}
                activeOpacity={0.85}
                disabled={answered}
              >
                <View style={getLabelStyle(item)}>
                  <Text style={[styles.labelText, { color: C.primary }]}>
                    {OPTION_LABELS[idx]}
                  </Text>
                </View>
                <Text style={[styles.optionText, { color: C.textPrimary }]} numberOfLines={2}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  optionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, borderWidth: 1.5,
    padding: 12, gap: 10, minHeight: 56,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 3,
  },
  optionCorrect: { backgroundColor: '#F0FDF4' },
  optionWrong: { backgroundColor: '#FEF2F2' },
  optionDimmed: { opacity: 0.45 },
  optionLabel: {
    width: 28, height: 28, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  labelText: { fontSize: 12, fontWeight: '900' },
  optionText: { flex: 1, fontSize: 13, fontWeight: '700' },
});
