// LuckyNumberScreen.js — Màn hình Random Number độc lập
// Không có điểm, không có bảng xếp hạng, không có câu hỏi.
// Chỉ là công cụ random số kiểu Google.
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated, SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function LuckyNumberScreen({ navigation }) {
  const { isDark, theme: C } = useTheme();

  const [minVal, setMinVal]         = useState('1');
  const [maxVal, setMaxVal]         = useState('10');
  const [result, setResult]         = useState(null);
  const [rolling, setRolling]       = useState(false);
  const [displayNum, setDisplayNum] = useState('?');
  const [history, setHistory]       = useState([]); // lịch sử các số đã tạo

  const scaleAnim   = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  const isRangeValid = () => {
    const min = parseInt(minVal, 10);
    const max = parseInt(maxVal, 10);
    return !isNaN(min) && !isNaN(max) && min < max;
  };

  const handleGenerate = () => {
    if (rolling || !isRangeValid()) return;

    const min = parseInt(minVal, 10);
    const max = parseInt(maxVal, 10);

    setResult(null);
    setRolling(true);
    scaleAnim.setValue(0.5);
    opacityAnim.setValue(0);

    // Hiệu ứng lăn số
    let count = 0;
    const totalTicks = 14;
    intervalRef.current = setInterval(() => {
      const fake = Math.floor(Math.random() * (max - min + 1)) + min;
      setDisplayNum(String(fake));
      count++;

      if (count >= totalTicks) {
        clearInterval(intervalRef.current);
        const final = Math.floor(Math.random() * (max - min + 1)) + min;
        setDisplayNum(String(final));
        setResult(final);
        setRolling(false);

        // Lưu vào lịch sử (tối đa 10 số gần nhất)
        setHistory(prev => [final, ...prev].slice(0, 10));

        // Pop-in animation
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1, friction: 4, tension: 120, useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1, duration: 180, useNativeDriver: true,
          }),
        ]).start();
      }
    }, 60);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgApp} />

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: C.bgCard, borderBottomColor: C.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Text style={[styles.backBtnText, { color: C.textMuted }]}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.textPrimary }]}>🎲 Random Number</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Card chính (giống Google) ── */}
        <View style={[styles.card, { backgroundColor: C.bgCard, borderColor: C.border }]}>

          {/* Số kết quả — to ở góc trái */}
          <View style={styles.resultArea}>
            {rolling ? (
              <Text style={[styles.resultNumber, { color: C.textPrimary }]}>{displayNum}</Text>
            ) : result !== null ? (
              <Animated.Text
                style={[
                  styles.resultNumber,
                  { color: C.primary, transform: [{ scale: scaleAnim }], opacity: opacityAnim },
                ]}
              >
                {result}
              </Animated.Text>
            ) : (
              <Text style={[styles.resultPlaceholder, { color: C.textMuted }]}>?</Text>
            )}
          </View>

          {/* Cột phải: input min / max */}
          <View style={styles.inputCol}>
            <Text style={[styles.inputLabel, { color: C.textMuted }]}>Tối thiểu</Text>
            <TextInput
              style={[styles.input, { color: C.textPrimary, borderColor: C.border }]}
              value={minVal}
              onChangeText={setMinVal}
              keyboardType="numeric"
              selectTextOnFocus
            />
            <Text style={[styles.inputLabel, { color: C.textMuted, marginTop: 14 }]}>Tối đa</Text>
            <TextInput
              style={[styles.input, { color: C.textPrimary, borderColor: C.border }]}
              value={maxVal}
              onChangeText={setMaxVal}
              keyboardType="numeric"
              selectTextOnFocus
            />
          </View>
        </View>

        {/* ── Nút TẠO (dính sát card) ── */}
        <TouchableOpacity
          style={[
            styles.generateBtn,
            { backgroundColor: '#A8C7FA' },
            (!isRangeValid() || rolling) && styles.btnDisabled,
          ]}
          onPress={handleGenerate}
          activeOpacity={0.85}
          disabled={rolling || !isRangeValid()}
        >
          <Text style={styles.generateBtnText}>
            {rolling ? 'Đang tạo...' : 'TẠO'}
          </Text>
        </TouchableOpacity>

        {/* ── Lỗi range ── */}
        {!isRangeValid() && minVal !== '' && maxVal !== '' && (
          <Text style={[styles.errorText, { color: C.wrong }]}>
            ⚠ Tối thiểu phải nhỏ hơn Tối đa
          </Text>
        )}

        {/* ── Lịch sử các số đã tạo ── */}
        {history.length > 0 && (
          <View style={[styles.historyBox, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <View style={styles.historyHeader}>
              <Text style={[styles.historyTitle, { color: C.textPrimary }]}>Lịch sử</Text>
              <TouchableOpacity onPress={() => setHistory([])} activeOpacity={0.7}>
                <Text style={[styles.historyClear, { color: C.textMuted }]}>Xóa</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.historyChips}>
              {history.map((num, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.historyChip,
                    { backgroundColor: idx === 0 ? C.primaryLight : C.bgApp, borderColor: idx === 0 ? C.primary : C.border },
                  ]}
                >
                  <Text style={[styles.historyChipText, { color: idx === 0 ? C.primary : C.textMuted }]}>
                    {num}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 80 },
  backBtnText: { fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '900', textAlign: 'center' },

  scroll: {
    padding: 20,
    gap: 0,
  },

  // Card chính
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 20,
  },
  resultArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: 90,
  },
  resultNumber: {
    fontSize: 72,
    fontWeight: '300',
    lineHeight: 82,
  },
  resultPlaceholder: {
    fontSize: 72,
    fontWeight: '300',
    lineHeight: 82,
  },
  inputCol: { width: 140 },
  inputLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  input: {
    borderBottomWidth: 1.5,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 2,
    fontSize: 16,
    fontWeight: '500',
  },

  // Nút TẠO
  generateBtn: {
    borderRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnDisabled: { opacity: 0.55 },
  generateBtnText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#1A1A2E',
  },

  errorText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },

  // Lịch sử
  historyBox: {
    marginTop: 20,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: { fontSize: 14, fontWeight: '800' },
  historyClear: { fontSize: 12, fontWeight: '600' },
  historyChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  historyChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  historyChipText: { fontSize: 14, fontWeight: '700' },
});
