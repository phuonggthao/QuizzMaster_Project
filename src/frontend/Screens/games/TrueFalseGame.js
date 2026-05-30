// games/TrueFalseGame.js — 🦆 Duck Race (Đua vịt)
// Luồng:
//  - 4 con vịt đua trên đường đua (player + 3 bot)
//  - Trả lời Đúng/Sai → đúng thì vịt player tiến, sai thì đứng yên
//  - Sau mỗi câu, các bot tiến ngẫu nhiên
//  - Thanh đua hiển thị vị trí realtime
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const TOTAL_STEPS = 10; // số bước để về đích

const DUCKS = [
  { id: 'player', label: 'Bạn',   emoji: '🦆', color: '#7C3AED' },
  { id: 'bot1',   label: 'Bot 1', emoji: '🐥', color: '#D97706' },
  { id: 'bot2',   label: 'Bot 2', emoji: '🐤', color: '#059669' },
  { id: 'bot3',   label: 'Bot 3', emoji: '🐣', color: '#DC2626' },
];

/**
 * Props:
 *  - question      : object câu hỏi hiện tại
 *  - answered      : boolean đã trả lời chưa
 *  - selectedAnswer: giá trị đã chọn
 *  - onAnswer(val) : callback khi chọn đáp án
 */
export default function TrueFalseGame({ question, answered, selectedAnswer, onAnswer }) {
  const { theme: C } = useTheme();

  // positions[id] = số bước đã đi (0 → TOTAL_STEPS)
  const [positions, setPositions] = useState({
    player: 0, bot1: 0, bot2: 0, bot3: 0,
  });

  // Animated values cho từng vịt
  const animValues = useRef({
    player: new Animated.Value(0),
    bot1:   new Animated.Value(0),
    bot2:   new Animated.Value(0),
    bot3:   new Animated.Value(0),
  }).current;

  const [showResult, setShowResult] = useState(null); // null | 'correct' | 'wrong'

  // Reset khi câu hỏi mới
  useEffect(() => {
    setShowResult(null);
  }, [question?._id]);

  // Khi answered → di chuyển bot ngẫu nhiên
  useEffect(() => {
    if (!answered) return;

    const isCorrect = selectedAnswer !== null &&
      String(selectedAnswer).trim().toLowerCase() ===
      String(question?.correctAnswer).trim().toLowerCase();

    setShowResult(isCorrect ? 'correct' : 'wrong');

    // Tính bước mới
    setPositions(prev => {
      const next = { ...prev };

      // Player tiến nếu đúng
      if (isCorrect) {
        next.player = Math.min(prev.player + 1, TOTAL_STEPS);
      }

      // Bot tiến ngẫu nhiên 0 hoặc 1 bước
      ['bot1', 'bot2', 'bot3'].forEach(id => {
        const step = Math.random() > 0.45 ? 1 : 0;
        next[id] = Math.min(prev[id] + step, TOTAL_STEPS);
      });

      // Animate
      Object.keys(next).forEach(id => {
        Animated.spring(animValues[id], {
          toValue: next[id] / TOTAL_STEPS,
          friction: 6,
          tension: 40,
          useNativeDriver: false,
        }).start();
      });

      return next;
    });
  }, [answered]);

  const options = question?.options || ['Đúng', 'Sai'];

  const getBtnStyle = (item) => {
    if (!answered) {
      return [styles.tfBtn, { backgroundColor: C.bgCard, borderColor: C.border }];
    }
    const isCorrect = String(item).trim().toLowerCase() ===
      String(question?.correctAnswer).trim().toLowerCase();
    if (isCorrect) return [styles.tfBtn, styles.tfCorrect];
    if (item === selectedAnswer) return [styles.tfBtn, styles.tfWrong];
    return [styles.tfBtn, styles.tfDimmed, { backgroundColor: C.bgCard, borderColor: C.border }];
  };

  return (
    <View style={styles.container}>

      {/* ── Đường đua ── */}
      <View style={[styles.raceTrack, { backgroundColor: C.bgCard, borderColor: C.border }]}>
        <Text style={[styles.raceTitle, { color: C.textPrimary }]}>🏁 Đường đua</Text>

        {DUCKS.map((duck) => {
          const pos = animValues[duck.id];
          return (
            <View key={duck.id} style={styles.laneRow}>
              {/* Tên vịt */}
              <Text style={[styles.laneLabel, { color: duck.id === 'player' ? duck.color : C.textMuted }]}>
                {duck.label}
              </Text>

              {/* Track */}
              <View style={[styles.lane, { backgroundColor: C.bgApp }]}>
                {/* Vạch đích */}
                <View style={styles.finishLine}>
                  <Text style={styles.finishFlag}>🏁</Text>
                </View>

                {/* Con vịt */}
                <Animated.View
                  style={[
                    styles.duckOnTrack,
                    {
                      left: pos.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '82%'],
                      }),
                    },
                  ]}
                >
                  <Text style={styles.duckEmoji}>{duck.emoji}</Text>
                  {duck.id === 'player' && (
                    <View style={[styles.playerDot, { backgroundColor: duck.color }]} />
                  )}
                </Animated.View>
              </View>

              {/* Số bước */}
              <Text style={[styles.stepCount, { color: duck.color }]}>
                {positions[duck.id]}/{TOTAL_STEPS}
              </Text>
            </View>
          );
        })}
      </View>

      {/* ── Kết quả câu vừa trả lời ── */}
      {showResult && (
        <View style={[
          styles.resultBadge,
          { backgroundColor: showResult === 'correct' ? '#dcfce7' : '#fee2e2' },
        ]}>
          <Text style={[
            styles.resultText,
            { color: showResult === 'correct' ? '#16a34a' : '#dc2626' },
          ]}>
            {showResult === 'correct'
              ? '🦆 Vịt của bạn tiến 1 bước!'
              : `❌ Sai! Đáp án: "${question?.correctAnswer}"`}
          </Text>
        </View>
      )}

      {/* ── Nút Đúng / Sai ── */}
      <View style={styles.btnRow}>
        {options.map((item, idx) => {
          const val = String(item).trim().toLowerCase();
          const isTrue = val === 'đúng' || val === 'true';
          return (
            <TouchableOpacity
              key={idx}
              style={getBtnStyle(item)}
              onPress={() => onAnswer(item)}
              activeOpacity={0.85}
              disabled={answered}
            >
              <Text style={styles.tfEmoji}>{isTrue ? '✅' : '❌'}</Text>
              <Text style={[styles.tfText, { color: C.textPrimary }]}>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },

  // ── Đường đua ──
  raceTrack: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  raceTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },

  laneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  laneLabel: {
    width: 38,
    fontSize: 11,
    fontWeight: '700',
  },
  lane: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  finishLine: {
    position: 'absolute',
    right: 4,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  finishFlag: { fontSize: 18 },

  duckOnTrack: {
    position: 'absolute',
    alignItems: 'center',
  },
  duckEmoji: { fontSize: 22, lineHeight: 28 },
  playerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 1,
  },

  stepCount: {
    width: 32,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'right',
  },

  // ── Result badge ──
  resultBadge: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  resultText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },

  // ── Nút Đúng/Sai ──
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tfBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 2,
    paddingVertical: 16,
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tfCorrect: { backgroundColor: '#F0FDF4', borderColor: '#16a34a' },
  tfWrong:   { backgroundColor: '#FEF2F2', borderColor: '#dc2626' },
  tfDimmed:  { opacity: 0.4 },
  tfEmoji: { fontSize: 24 },
  tfText:  { fontSize: 16, fontWeight: '800' },
});
