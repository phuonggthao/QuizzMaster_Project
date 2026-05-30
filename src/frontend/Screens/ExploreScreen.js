import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../Components/AppHeader';
import BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Danh mục cố định (UI)
const CATEGORIES = [
  { id: '1', icon: '⚗️', title: 'Science',   desc: 'Explore Biology, Physics & Chemistry', color: '#6C2BD9', bg: '#7C3AED',  category: 'Khoa Học' },
  { id: '2', icon: '🌐', title: 'Languages', desc: 'Master 20+ dialects',                  color: '#059669', bg: '#059669',  category: 'Tiếng Anh' },
  { id: '3', icon: '🏆', title: 'Trivia',    desc: 'Daily brain teasers',                  color: '#1E1B4B', bg: '#312E81',  category: 'Địa lý' },
];

const FILTERS = ['Popular', 'Newest', 'A-Z'];

// Map gameType → emoji và màu
const GAME_META = {
  Quiz:        { emoji: '💻', color: '#7C3AED', bg: '#EDE9FF', label: 'Classic Quiz' },
  TrueFalse:   { emoji: '⚖️', color: '#059669', bg: '#DCFCE7', label: 'True or False' },
  LuckyNumber: { emoji: '🎰', color: '#D97706', bg: '#FEF3C7', label: 'Lucky Draw' },
  Flashcard:   { emoji: '🎴', color: '#4C1D95', bg: '#EDE9FF', label: 'Flashcards' },
  WordScramble:{ emoji: '🔤', color: '#0891B2', bg: '#E0F2FE', label: 'Word Scramble' },
  FillInBlank: { emoji: '✏️', color: '#7C3AED', bg: '#EDE9FF', label: 'Fill in Blank' },
  PictureQuiz: { emoji: '🖼️', color: '#DC2626', bg: '#FEE2E2', label: 'Picture Quiz' },
  Matching:    { emoji: '🔗', color: '#7C3AED', bg: '#EDE9FF', label: 'Matching Pairs' },
  OpenBox:     { emoji: '🎁', color: '#D97706', bg: '#FEF3C7', label: 'Open the Box' },
  SimpleSpin:  { emoji: '🌀', color: '#0891B2', bg: '#E0F2FE', label: 'Simple Spin' },
  FindMatch:   { emoji: '🔍', color: '#059669', bg: '#DCFCE7', label: 'Find the Match' },
};

// Dữ liệu mẫu cho GUEST
const GUEST_QUIZZES = [
  { _id: 'Quiz',        count: 5,  categories: ['Địa lý', 'Toán học'], latestCreated: '2024-01-01' },
  { _id: 'TrueFalse',   count: 3,  categories: ['Khoa học', 'Địa lý'], latestCreated: '2024-01-02' },
  { _id: 'Flashcard',   count: 3,  categories: ['Tiếng Anh'],          latestCreated: '2024-01-03' },
  { _id: 'WordScramble',count: 3,  categories: ['Tiếng Anh'],          latestCreated: '2024-01-04' },
  { _id: 'LuckyNumber', count: 3,  categories: ['May mắn'],            latestCreated: '2024-01-05' },
  { _id: 'FillInBlank', count: 3,  categories: ['Địa lý', 'Khoa học'], latestCreated: '2024-01-06' },
];

export default function ExploreScreen({ navigation }) {
  const { isDark, theme: C } = useTheme();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Popular');
  const [quizzes, setQuizzes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token === 'GUEST') {
          setQuizzes(GUEST_QUIZZES);
          setFiltered(GUEST_QUIZZES);
          setLoading(false);
          return;
        }
        const res = await fetch(`${BASE_URL}/explore/quizzes`);
        if (res.ok) {
          const data = await res.json();
          setQuizzes(data);
          setFiltered(data);
        }
      } catch (e) {
        console.warn('Explore fetch error:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // Filter + search
  useEffect(() => {
    let result = [...quizzes];

    // Search
    if (search.trim()) {
      result = result.filter(q =>
        (GAME_META[q._id]?.label || q._id).toLowerCase().includes(search.toLowerCase()) ||
        (q.categories || []).join(' ').toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    if (activeFilter === 'Popular') {
      result.sort((a, b) => b.count - a.count);
    } else if (activeFilter === 'Newest') {
      result.sort((a, b) => new Date(b.latestCreated) - new Date(a.latestCreated));
    } else if (activeFilter === 'A-Z') {
      result.sort((a, b) => (GAME_META[a._id]?.label || a._id).localeCompare(GAME_META[b._id]?.label || b._id));
    }

    setFiltered(result);
  }, [search, activeFilter, quizzes]);

  const MORE_WAYS = [
    { id: '1', icon: '🦆', title: 'Duck Race (Đua vịt)', desc: 'A competitive racing mode', color: C.primary, bg: C.primaryLight, type: 'TrueFalse' },
    { id: '2', icon: '🎰', title: 'Lucky Draw (Xổ số)', desc: 'A fun random selection game', color: '#059669', bg: '#DCFCE7', type: 'LuckyNumber' },
    { id: '3', icon: '🎴', title: 'Flashcards (Thẻ học)', desc: 'Classic study card method. Flip front/back cards to memorize definitions, vocabulary and facts.', color: '#4C1D95', bg: '#EDE9FF', type: 'Flashcard' },
    { id: '4', icon: '🔤', title: 'Word Link (Nối chữ)', desc: 'A vocabulary and logic game', color: C.textMuted, bg: C.borderLight, type: 'WordScramble' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgCard} />
      <AppHeader navigation={navigation} activeTab="Explore" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: C.bgCard, borderBottomColor: C.border }]}>
          <Text style={[styles.heroTitle, { color: C.textPrimary }]}>Discover your next challenge</Text>
          <Text style={[styles.heroSubtitle, { color: C.textMuted }]}>
            {loading ? 'Đang tải dữ liệu từ database...' : `${quizzes.reduce((s, q) => s + q.count, 0)} câu hỏi trên ${quizzes.length} loại trò chơi`}
          </Text>
          <View style={[styles.searchBar, { backgroundColor: C.bgApp, borderColor: C.border }]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: C.textPrimary }]}
              placeholder="Search for quiz types, categories..."
              placeholderTextColor={C.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Categories (UI cố định) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Categories</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => Alert.alert('Thông báo', 'Đang tải thêm danh mục...')}>
              <Text style={[styles.viewAll, { color: C.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesRow}>
            <TouchableOpacity
              style={[styles.catCardLarge, { backgroundColor: CATEGORIES[0].bg }]}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('Category', {
                category: CATEGORIES[0].category,
                icon: CATEGORIES[0].icon,
                color: CATEGORIES[0].color,
                bg: CATEGORIES[0].bg + '33',
              })}
            >
              <Text style={styles.catIcon}>{CATEGORIES[0].icon}</Text>
              <Text style={styles.catTitle}>{CATEGORIES[0].title}</Text>
              <Text style={styles.catDesc}>{CATEGORIES[0].desc}</Text>
            </TouchableOpacity>
            <View style={styles.catSmallCol}>
              {CATEGORIES.slice(1).map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catCardSmall, { backgroundColor: cat.bg }]}
                  activeOpacity={0.88}
                  onPress={() => navigation.navigate('Category', {
                    category: cat.category,
                    icon: cat.icon,
                    color: cat.color,
                    bg: cat.bg + '33',
                  })}
                >
                  <Text style={styles.catIconSm}>{cat.icon}</Text>
                  <Text style={styles.catTitleSm}>{cat.title}</Text>
                  <Text style={styles.catDescSm}>{cat.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Quiz types */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>
              {loading ? 'Đang tải...' : `Trò chơi (${filtered.length})`}
            </Text>
            <View style={styles.filterChips}>
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.chip,
                    { backgroundColor: C.bgCard, borderColor: C.border },
                    activeFilter === f && { backgroundColor: C.primary, borderColor: C.primary }
                  ]}
                  onPress={() => setActiveFilter(f)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.chipText, { color: C.textMuted },
                    activeFilter === f && { color: '#fff', fontWeight: '700' }
                  ]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {loading ? (
            <View style={{ paddingVertical: 32, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={C.primary} />
            </View>
          ) : filtered.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: C.bgCard, borderColor: C.border }]}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
              <Text style={[{ color: C.textMuted, fontSize: 13, textAlign: 'center' }]}>
                {search ? `Không tìm thấy kết quả cho "${search}"` : 'Chưa có dữ liệu'}
              </Text>
            </View>
          ) : (
            <View style={styles.quizGrid}>
              {filtered.map((quiz, idx) => {
                const meta = GAME_META[quiz._id] || { emoji: '🎮', color: C.primary, bg: C.primaryLight, label: quiz._id };
                const cats = (quiz.categories || []).slice(0, 2).join(', ');
                return (
                  <View key={quiz._id} style={[styles.quizCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
                    <View style={[styles.quizThumb, { backgroundColor: meta.bg }]}>
                      <Text style={styles.quizThumbEmoji}>{meta.emoji}</Text>
                      <View style={[styles.subjectBadge, { backgroundColor: C.primaryLight }]}>
                        <Text style={[styles.subjectBadgeText, { color: C.primary }]}>{quiz.count} câu</Text>
                      </View>
                      {idx === 0 && (
                        <View style={styles.hotBadge}>
                          <Text style={styles.hotBadgeText}>🔥 Hot</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.quizInfo}>
                      <Text style={[styles.quizTitle, { color: C.textPrimary }]}>{meta.label}</Text>
                      <Text style={[styles.quizMeta, { color: C.textMuted }]}>
                        📋 {quiz.count} Câu hỏi{cats ? `  •  ${cats}` : ''}
                      </Text>
                      <TouchableOpacity
                        style={[styles.startBtn, { backgroundColor: C.primary }]}
                        onPress={() => {
                          if (quiz._id === 'LuckyNumber') navigation.navigate('LuckyNumber');
                          else navigation.navigate('Quiz', { gameType: quiz._id });
                        }}
                        activeOpacity={0.88}
                      >
                        <Text style={styles.startBtnText}>Start ▶</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
        {/* More Ways to Play */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>More Ways to Play</Text>
          <View style={styles.moreWaysGrid}>
            {MORE_WAYS.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[styles.moreCard, { backgroundColor: m.bg }]}
                activeOpacity={0.85}
                onPress={() => {
                  if (m.type === 'LuckyNumber') {
                    navigation.navigate('LuckyNumber');
                  } else {
                    navigation.navigate('Quiz', { gameType: m.type });
                  }
                }}
              >
                <Text style={styles.moreIcon}>{m.icon}</Text>
                <Text style={[styles.moreTitle, { color: m.color }]}>{m.title}</Text>
                <Text style={[styles.moreDesc, { color: C.textMuted }]}>{m.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: C.border }]}>
          <Text style={[styles.footerLogo, { color: C.primary }]}>QuizMates</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => Alert.alert('Thông báo', 'Tính năng đang được phát triển')} activeOpacity={0.7}>
              <Text style={[styles.footerLink, { color: C.textMuted }]}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Thông báo', 'Tính năng đang được phát triển')} activeOpacity={0.7}>
              <Text style={[styles.footerLink, { color: C.textMuted }]}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Thông báo', 'Tính năng đang được phát triển')} activeOpacity={0.7}>
              <Text style={[styles.footerLink, { color: C.textMuted }]}>Help Center</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.footerCopy, { color: C.textMuted }]}>© 2024 QuizMates. Keep learning!</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },

  hero: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 28, alignItems: 'center', borderBottomWidth: 1 },
  heroTitle: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  heroSubtitle: { fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, width: '100%', gap: 8 },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14 },

  section: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '900' },
  viewAll: { fontSize: 13, fontWeight: '700' },

  categoriesRow: { flexDirection: 'row', gap: 10 },
  catCardLarge: { flex: 1.2, borderRadius: 16, padding: 18, minHeight: 160, justifyContent: 'flex-end', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 8 },
  catIcon: { fontSize: 28, marginBottom: 8 },
  catTitle: { fontSize: 16, fontWeight: '900', color: '#fff', marginBottom: 4 },
  catDesc: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  catSmallCol: { flex: 1, gap: 10 },
  catCardSmall: { flex: 1, borderRadius: 14, padding: 14, justifyContent: 'flex-end', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
  catIconSm: { fontSize: 22, marginBottom: 4 },
  catTitleSm: { fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 2 },
  catDescSm: { fontSize: 10, color: 'rgba(255,255,255,0.8)' },

  filterChips: { flexDirection: 'row', gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '600' },

  emptyBox: { borderRadius: 14, padding: 32, alignItems: 'center', borderWidth: 1 },

  quizGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  quizCard: { width: '47%', borderRadius: 14, overflow: 'hidden', borderWidth: 1, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
  quizThumb: { height: 110, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  quizThumbEmoji: { fontSize: 40 },
  subjectBadge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  subjectBadgeText: { fontSize: 9, fontWeight: '800' },
  hotBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  hotBadgeText: { fontSize: 9, fontWeight: '700', color: '#fff' },
  quizInfo: { padding: 12 },
  quizTitle: { fontSize: 13, fontWeight: '800', marginBottom: 5, lineHeight: 17 },
  quizMeta: { fontSize: 10, marginBottom: 10 },
  startBtn: { borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  startBtnText: { color: '#fff', fontWeight: '800', fontSize: 12 },

  moreWaysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  moreCard: { width: '47%', borderRadius: 14, padding: 16, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  moreIcon: { fontSize: 28, marginBottom: 8 },
  moreTitle: { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  moreDesc: { fontSize: 11 },

  footer: { paddingHorizontal: 20, paddingTop: 24, borderTopWidth: 1, alignItems: 'center', gap: 6, marginTop: 16 },
  footerLogo: { fontSize: 15, fontWeight: '900' },
  footerLinks: { flexDirection: 'row', gap: 16 },
  footerLink: { fontSize: 11, fontWeight: '600' },
  footerCopy: { fontSize: 11 },
});
