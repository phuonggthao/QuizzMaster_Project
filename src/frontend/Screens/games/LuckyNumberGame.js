// games/LuckyNumberGame.js — Random Number (kiểu Google)
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function LuckyNumberGame({ onNext }) {
  const { theme: C } = useTheme();

  const [minVal, setMinVal]         = useState('1');
  const [maxVal, setMaxVal]         = useState('100');
  const [result, setResult]         = useState(null);
  const [rolling, setRolling]       = useState(false);
  const [displayNum, setDisplayNum] = useState('?');
  const [generated, setGenerated]   = useState(false);

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
    setGenerated(false);
    setRolling(true);
    scaleAnim.setValue(0.5);
    opacityAnim.setValue(0);

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
        setGenerated(true);
        Animated.parallel([
          Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
        ]).start();
      }
    }, 60);
  };

  // fontSize co lại nếu số nhiều chữ số (tránh tràn)
  const numStr = result !== null ? String(result) : displayNum;
  const numFontSize = numStr.length > 5 ? 36 : numStr.length > 3 ? 52 : 68;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, { backgroundColor: C.bgCard, borderColor: C.border }]}>

        {/* Số kết quả */}
        <View style={styles.resultArea}>
          {rolling ? (
            <Text style={[styles.resultNumber, { color: C.textPrimary, fontSize: numFontSize }]}>
              {displayNum}
            </Text>
          ) : result !== null ? (
            <Animated.Text style={[styles.resultNumber, {
              color: C.primary,
              fontSize: numFontSize,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }]}>
              {result}
            </Animated.Text>
          ) : (
            <Text style={[styles.resultPlaceholder, { color: C.textMuted }]}>?</Text>
          )}
        </View>

        {/* Input min / max — flex thay vì width cố định */}
        <View style={styles.inputCol}>
          <Text style={[styles.inputLabel, { color: C.textMuted }]}>Tối thiểu</Text>
          <TextInput
            style={[styles.input, { color: C.textPrimary, borderColor: C.border }]}
            value={minVal}
            onChangeText={(v) => { setMinVal(v); setGenerated(false); }}
            keyboardType="numeric"
            selectTextOnFocus
          />
          <Text style={[styles.inputLabel, { color: C.textMuted, marginTop: 12 }]}>Tối đa</Text>
          <TextInput
            style={[styles.input, { color: C.textPrimary, borderColor: C.border }]}
            value={maxVal}
            onChangeText={(v) => { setMaxVal(v); setGenerated(false); }}
            keyboardType="numeric"
            selectTextOnFocus
          />
        </View>
      </View>

      {/* Nút TẠO */}
      <TouchableOpacity
        style={[styles.generateBtn, { backgroundColor: '#A8C7FA' }, (!isRangeValid() || rolling) && styles.btnDisabled]}
        onPress={handleGenerate}
        activeOpacity={0.85}
        disabled={rolling || !isRangeValid()}
      >
        <Text style={styles.generateBtnText}>{rolling ? 'Đang tạo...' : 'TẠO'}</Text>
      </TouchableOpacity>

      {!isRangeValid() && minVal !== '' && maxVal !== '' && (
        <Text style={[styles.errorText, { color: C.wrong }]}>⚠ Tối thiểu phải nhỏ hơn Tối đa</Text>
      )}

      {generated && (
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: C.primary }]}
          onPress={onNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>Tạo số tiếp theo →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 0 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
  },
  resultArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: 80,
  },
  resultNumber: {
    fontWeight: '300',
  },
  resultPlaceholder: {
    fontSize: 68,
    fontWeight: '300',
  },
  inputCol: { flex: 0.55 },
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
  generateBtn: {
    borderRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.55 },
  generateBtnText: { fontSize: 15, fontWeight: '700', letterSpacing: 1.5, color: '#1A1A2E' },
  errorText: { fontSize: 12, fontWeight: '600', textAlign: 'center', marginTop: 8 },
  nextBtn: {
    marginTop: 14,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  nextBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
