// CategoryScreen.js — Danh sách bộ câu hỏi theo category
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GAME_META = {
  Quiz:        { emoji: '💻', label: 'Classic Quiz',   desc: 'Trắc nghiệm nhiều lựa chọn' },
  TrueFalse:   { emoji: '⚖️', label: 'True or False',  desc: 'Đúng hay sai nhanh' },
  LuckyNumber: { emoji: '🎰', label: 'Lucky Draw',     desc: 'Quay số may mắn' },
  Flashcard:   { emoji: '🎴', label: 'Flashcards',     desc: 'Thẻ học lật mặt' },
  WordScramble:{ emoji: '🔤', label: 'Word Scramble',  desc: 'Sắp xếp chữ cái' },
  FillInBlank: { emoji: '✏️', label: 'Fill in Blank',  desc: 'Điền vào chỗ trống' },
};

// Dữ liệu mẫu cho GUEST theo category
const GUEST_CATEGORY_DATA = {
  'Khoa học': [
    { _id: 'Quiz',      count: 5, label: 'Classic Quiz' },
    { _id: 'TrueFalse', count: 3, label: 'True or False' },
    { _id: 'Flashcard', count: 4, label: 'Flashcards' },
  ],
  'Địa lý': [
    { _id: 'Quiz',      count: 4, label: 'Classic Quiz' },
    { _id: 'TrueFalse', count: 2, label: 'True or False' },
  ],
  'Tiếng Anh': [
    { _id: 'Flashcard',   count: 6, label: 'Flashcards' },
    { _id: 'WordScramble',count: 4, label: 'Word Scramble' },
    { _id: 'FillInBlank', count: 3, label: 'Fill in Blank' },
  ],
  'Toán học': [
    { _id: 'Quiz',      count: 5, label: 'Classic Quiz' },
    { _id: 'TrueFalse', count: 3, label: 'True or False' },
  ],
};

export default function CategoryScreen({ route, navigation }) {
  const { category, icon, color, bg } = route.params;
  const { isDark, theme: C } = useTheme();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');

        if (token === 'GUEST') {
          // Dùng dữ liệu mẫu cho khách
          const guestData = GUEST_CATEGORY_DATA[category] || [];
          setQuizzes(guestData);
          return;
        }

        const res = await fetch(
          `${BASE_URL}/explore/category/${encodeURIComponent(category)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setQuizzes(data);
        }
      } catch (e) {
        console.warn('CategoryScreen fetch error:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [category]);

  const handlePlay = (gameType) => {
    if (gameType === 'LuckyNumber') {
      navigation.navigate('LuckyNumber');
    } else {
      navigation.navigate('Quiz', { gameType, category });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgApp} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.bgCard, borderBottomColor: C.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Text style={[styles.backBtnText, { color: C.textMuted }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerIcon}>{icon}</Text>
          <Text style={[styles.headerTitle, { color: C.textPrimary }]}>{category}</Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      {/* Hero banner */}
      <View style={[styles.heroBanner, { backgroundColor: bg || C.primaryLight }]}>
        <Text style={styles.heroIcon}>{icon}</Text>
        <View style={styles.heroText}>
          <Text style={[styles.heroTitle, { color: color || C.primary }]}>{category}</Text>
          <Text style={[styles.heroSub, { color: C.textMuted }]}>
            {loading ? 'Đang tải...' : `${quizzes.reduce((s, q) => s + (q.count || 0), 0)} câu hỏi • ${quizzes.length} chế độ chơi`}
          </Text>
        </View>
      </View>

      {/* Danh sách bộ câu hỏi */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Chọn chế độ chơi</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={C.primary} />
            <Text style={[styles.loadingText, { color: C.textMuted }]}>Đang tải bộ câu hỏi...</Text>
          </View>
        ) : quizzes.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={[styles.emptyText, { color: C.textMuted }]}>
              Chưa có câu hỏi nào trong danh mục này
            </Text>
          </View>
        ) : (
          quizzes.map((quiz) => {
            const meta = GAME_META[quiz._id] || { emoji: '🎮', label: quiz._id, desc: '' };
            return (
              <TouchableOpacity
                key={quiz._id}
                style={[styles.quizCard, { backgroundColor: C.bgCard, borderColor: C.border }]}
                onPress={() => handlePlay(quiz._id)}
                activeOpacity={0.85}
              >
                <View style={[styles.quizIconWrap, { backgroundColor: bg || C.primaryLight }]}>
                  <Text style={styles.quizIcon}>{meta.emoji}</Text>
                </View>
                <View style={styles.quizInfo}>
                  <Text style={[styles.quizTitle, { color: C.textPrimary }]}>{meta.label}</Text>
                  <Text style={[styles.quizDesc, { color: C.textMuted }]}>{meta.desc}</Text>
                  <Text style={[styles.quizCount, { color: color || C.primary }]}>
                    📋 {quiz.count} câu hỏi
                  </Text>
                </View>
                <View style={[styles.playBtn, { backgroundColor: color || C.primary }]}>
                  <Text style={styles.playBtnText}>▶</Text>
                </View>
              </TouchableOpacity>
            );
          })
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 36, alignItems: 'flex-start' },
  backBtnText: { fontSize: 22, fontWeight: '700' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  headerIcon: { fontSize: 20 },
  headerTitle: { fontSize: 17, fontWeight: '900' },

  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  heroIcon: { fontSize: 48 },
  heroText: { flex: 1 },
  heroTitle: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
  heroSub: { fontSize: 13 },

  scroll: { padding: 20, gap: 12, paddingBottom: 40 },

  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 4 },

  center: { paddingVertical: 40, alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 13 },

  emptyBox: {
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    gap: 10,
  },
  emptyIcon: { fontSize: 36 },
  emptyText: { fontSize: 13, textAlign: 'center' },

  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  quizIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizIcon: { fontSize: 28 },
  quizInfo: { flex: 1, gap: 3 },
  quizTitle: { fontSize: 15, fontWeight: '800' },
  quizDesc: { fontSize: 12 },
  quizCount: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtnText: { color: '#fff', fontSize: 14, fontWeight: '900' },
});
