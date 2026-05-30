import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, TextInput,
} from 'react-native';
import { Colors } from '../Styles/Colors';
import AppHeader from '../Components/AppHeader';

const CATEGORIES = [
  { id: '1', icon: '⚗️', title: 'Science', desc: 'Explore Biology, Physics & Chemistry', color: '#6C2BD9', bg: '#7C3AED' },
  { id: '2', icon: '🌐', title: 'Languages', desc: 'Master 20+ dialects', color: '#059669', bg: '#059669' },
  { id: '3', icon: '🏆', title: 'Trivia', desc: 'Daily brain teasers', color: '#1E1B4B', bg: '#312E81' },
];

const QUIZZES = [
  { id: '1', title: 'Astrophysics 101: The Solar System', subject: 'Science', subjectColor: '#6C2BD9', subjectBg: Colors.primaryLight, hot: true, questions: 20, time: 15, thumbEmoji: '🌍', thumbBg: '#1E1B4B' },
  { id: '2', title: 'Pop Culture: The 2010s Recap', subject: 'Trivia', subjectColor: '#059669', subjectBg: '#DCFCE7', hot: false, questions: 12, time: 8, thumbEmoji: '🎭', thumbBg: '#4C1D95' },
  { id: '3', title: 'French Basics: Restaurant Etiquette', subject: 'Languages', subjectColor: '#D97706', subjectBg: '#FEF3C7', hot: false, questions: 15, time: 10, thumbEmoji: '🗼', thumbBg: '#92400E' },
];

const MORE_WAYS = [
  { id: '1', icon: '🦆', title: 'Duck Race (Đua vịt)', desc: 'A competitive racing mode', color: Colors.primary, bg: Colors.primaryLight, type: 'TrueFalse' },
  { id: '2', icon: '🎰', title: 'Lucky Draw (Xổ số)', desc: 'A fun random selection game', color: '#059669', bg: '#DCFCE7', type: 'LuckyNumber' },
  { id: '3', icon: '🧩', title: 'Jigsaw Puzzle (Ghép hình)', desc: 'A visual problem-solving mode', color: '#4C1D95', bg: '#EDE9FF', type: 'Flashcard' },
  { id: '4', icon: '🔤', title: 'Word Link (Nối chữ)', desc: 'A vocabulary and logic game', color: Colors.textMuted, bg: Colors.borderLight, type: 'WordScramble' },
];

const FILTERS = ['Popular', 'Newest', 'Recommended'];

export default function ExploreScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Popular');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgCard} />
      <AppHeader navigation={navigation} activeTab="Explore" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Discover your next challenge</Text>
          <Text style={styles.heroSubtitle}>Join thousands of students learning through play. Find quizzes on any topic.</Text>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for Science, Languages, or Trivia..."
              placeholderTextColor={Colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesRow}>
            {/* Large card */}
            <TouchableOpacity
              style={[styles.catCardLarge, { backgroundColor: CATEGORIES[0].bg }]}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('Quiz', { gameType: 'Quiz' })}
            >
              <Text style={styles.catIcon}>{CATEGORIES[0].icon}</Text>
              <Text style={styles.catTitle}>{CATEGORIES[0].title}</Text>
              <Text style={styles.catDesc}>{CATEGORIES[0].desc}</Text>
            </TouchableOpacity>
            {/* Small cards */}
            <View style={styles.catSmallCol}>
              {CATEGORIES.slice(1).map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catCardSmall, { backgroundColor: cat.bg }]}
                  activeOpacity={0.88}
                  onPress={() => navigation.navigate('Quiz', { gameType: 'Quiz' })}
                >
                  <Text style={styles.catIconSm}>{cat.icon}</Text>
                  <Text style={styles.catTitleSm}>{cat.title}</Text>
                  <Text style={styles.catDescSm}>{cat.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Trending Quizzes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Quizzes</Text>
            <View style={styles.filterChips}>
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.chip, activeFilter === f && styles.chipActive]}
                  onPress={() => setActiveFilter(f)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.quizGrid}>
            {QUIZZES.map((quiz) => (
              <View key={quiz.id} style={styles.quizCard}>
                <View style={[styles.quizThumb, { backgroundColor: quiz.thumbBg }]}>
                  <Text style={styles.quizThumbEmoji}>{quiz.thumbEmoji}</Text>
                  <View style={[styles.subjectBadge, { backgroundColor: quiz.subjectBg }]}>
                    <Text style={[styles.subjectBadgeText, { color: quiz.subjectColor }]}>{quiz.subject}</Text>
                  </View>
                  {quiz.hot && (
                    <View style={styles.hotBadge}>
                      <Text style={styles.hotBadgeText}>🔥 Hot</Text>
                    </View>
                  )}
                </View>
                <View style={styles.quizInfo}>
                  <Text style={styles.quizTitle}>{quiz.title}</Text>
                  <Text style={styles.quizMeta}>📋 {quiz.questions} Questions  ⏱ {quiz.time} min</Text>
                  <TouchableOpacity
                    style={styles.startBtn}
                    onPress={() => navigation.navigate('Quiz', { gameType: 'Quiz' })}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.startBtnText}>Start Quiz ▶</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.loadMoreBtn} activeOpacity={0.8} onPress={() => navigation.navigate('Quiz', { gameType: 'Quiz' })}>
            <Text style={styles.loadMoreText}>Load More Quizzes</Text>
          </TouchableOpacity>
        </View>

        {/* More Ways to Play */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Ways to Play</Text>
          <View style={styles.moreWaysGrid}>
            {MORE_WAYS.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[styles.moreCard, { backgroundColor: m.bg }]}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Quiz', { gameType: m.type })}
              >
                <Text style={styles.moreIcon}>{m.icon}</Text>
                <Text style={[styles.moreTitle, { color: m.color }]}>{m.title}</Text>
                <Text style={styles.moreDesc}>{m.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>QuizMates</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
            <Text style={styles.footerLink}>Terms of Service</Text>
            <Text style={styles.footerLink}>Help Center</Text>
          </View>
          <Text style={styles.footerCopy}>© 2024 QuizMates. Keeplearning!</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgApp },
  scroll: { paddingBottom: 40 },

  hero: {
    backgroundColor: Colors.bgCard,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  heroTitle: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  heroSubtitle: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgApp,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },

  section: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary },
  viewAll: { fontSize: 13, color: Colors.primary, fontWeight: '700' },

  // Categories
  categoriesRow: { flexDirection: 'row', gap: 10 },
  catCardLarge: {
    flex: 1.2,
    borderRadius: 16,
    padding: 18,
    minHeight: 160,
    justifyContent: 'flex-end',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  catIcon: { fontSize: 28, marginBottom: 8 },
  catTitle: { fontSize: 16, fontWeight: '900', color: '#fff', marginBottom: 4 },
  catDesc: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  catSmallCol: { flex: 1, gap: 10 },
  catCardSmall: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    justifyContent: 'flex-end',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  catIconSm: { fontSize: 22, marginBottom: 4 },
  catTitleSm: { fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 2 },
  catDescSm: { fontSize: 10, color: 'rgba(255,255,255,0.8)' },

  // Filter chips
  filterChips: { flexDirection: 'row', gap: 6 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
  chipTextActive: { color: '#fff', fontWeight: '700' },

  // Quiz grid
  quizGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  quizCard: {
    width: '47%',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  quizThumb: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  quizThumbEmoji: { fontSize: 40 },
  subjectBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subjectBadgeText: { fontSize: 9, fontWeight: '800' },
  hotBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  hotBadgeText: { fontSize: 9, fontWeight: '700', color: '#fff' },
  quizInfo: { padding: 12 },
  quizTitle: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary, marginBottom: 5, lineHeight: 17 },
  quizMeta: { fontSize: 10, color: Colors.textMuted, marginBottom: 10 },
  startBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  startBtnText: { color: '#fff', fontWeight: '800', fontSize: 12 },

  loadMoreBtn: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
    marginBottom: 8,
  },
  loadMoreText: { fontSize: 13, fontWeight: '700', color: Colors.primary },

  // More ways
  moreWaysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  moreCard: {
    width: '47%',
    borderRadius: 14,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  moreIcon: { fontSize: 28, marginBottom: 8 },
  moreTitle: { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  moreDesc: { fontSize: 11, color: Colors.textMuted },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  footerLogo: { fontSize: 15, fontWeight: '900', color: Colors.primary },
  footerLinks: { flexDirection: 'row', gap: 16 },
  footerLink: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  footerCopy: { fontSize: 11, color: Colors.textMuted },
});
