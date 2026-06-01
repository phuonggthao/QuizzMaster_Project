import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, Alert,
  ActivityIndicator, TextInput, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../Components/AppHeader';
import BASE_URL from '../config';

// ─── Constants ───────────────────────────────────────────────────────────────

const DIFFICULTY_STYLE = {
  Easy:   { color: '#059669', bg: '#DCFCE7', label: 'Dễ' },
  Medium: { color: '#D97706', bg: '#FEF3C7', label: 'TB' },
  Hard:   { color: '#DC2626', bg: '#FEE2E2', label: 'Khó' },
};

const GAME_EMOJI = {
  Quiz: '💻', TrueFalse: '🦆', Flashcard: '🎴',
  WordScramble: '🔤', LuckyNumber: '🎰', PictureQuiz: '🖼️',
  Matching: '🔗', OpenBox: '🎁', SimpleSpin: '🌀',
  FindMatch: '🔍', FillInBlank: '✏️', default: '🎮',
};

const GAME_COLORS = {
  Quiz: '#6C2BD9', TrueFalse: '#0891B2', Flashcard: '#7C3AED',
  WordScramble: '#059669', LuckyNumber: '#D97706', PictureQuiz: '#DB2777',
  FillInBlank: '#2563EB', default: '#6B7280',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ManageScreen({ navigation }) {
  const { isDark, theme: C } = useTheme();
  const [questions, setQuestions]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [isAdmin, setIsAdmin]       = useState(false);
  const [deleting, setDeleting]     = useState(null);
  const [search, setSearch]         = useState('');
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token || token === 'GUEST') { setLoading(false); return; }

        const meRes = await fetch(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) { setLoading(false); return; }

        const meData = await meRes.json();
        if (meData.user?.role === 'Admin') {
          setIsAdmin(true);
          const qRes = await fetch(`${BASE_URL}/manage/questions`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (qRes.ok) setQuestions(await qRes.json());
        }
      } catch (e) {
        console.warn('Manage fetch error:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = (id) => {
    const performDelete = async () => {
      try {
        setDeleting(id);
        const token = await AsyncStorage.getItem('userToken');
        const res = await fetch(`${BASE_URL}/manage/questions/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setQuestions(prev => prev.filter(q => q._id !== id));
        } else {
          Alert.alert('Lỗi', 'Không thể xóa câu hỏi');
        }
      } catch (e) {
        Alert.alert('Lỗi mạng', e.message);
      } finally {
        setDeleting(null);
      }
    };

    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm('Bạn có chắc muốn xóa câu hỏi này không?');
      if (confirmDelete) {
        performDelete();
      }
    } else {
      Alert.alert('Xóa câu hỏi', 'Bạn có chắc muốn xóa câu hỏi này không?', [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xóa', style: 'destructive',
          onPress: performDelete,
        },
      ]);
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const gameTypes = useMemo(() => {
    const types = [...new Set(questions.map(q => q.gameType).filter(Boolean))];
    return ['Tất cả', ...types];
  }, [questions]);

  const filtered = useMemo(() => {
    let list = questions;
    if (activeFilter !== 'Tất cả') list = list.filter(q => q.gameType === activeFilter);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(q =>
        (q.questionText || '').toLowerCase().includes(s) ||
        (q.category || '').toLowerCase().includes(s) ||
        (q.gameType || '').toLowerCase().includes(s)
      );
    }
    return list;
  }, [questions, activeFilter, search]);

  const gameTypeCounts = useMemo(() =>
    questions.reduce((acc, q) => {
      acc[q.gameType] = (acc[q.gameType] || 0) + 1;
      return acc;
    }, {}),
  [questions]);

  const diffCounts = useMemo(() => ({
    Easy:   questions.filter(q => q.difficulty === 'Easy').length,
    Medium: questions.filter(q => q.difficulty === 'Medium').length,
    Hard:   questions.filter(q => q.difficulty === 'Hard').length,
  }), [questions]);

  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={C.bgCard}
      />
      <AppHeader navigation={navigation} activeTab="Manage" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Page header ── */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={[styles.pageTitle, { color: C.textPrimary }]}>Quản lý câu hỏi</Text>
            <Text style={[styles.pageSubtitle, { color: C.textMuted }]}>
              {isAdmin ? 'Toàn bộ câu hỏi trong database' : 'Tổng quan nội dung hệ thống'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: C.primary }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('QuestionType')}
          >
            <Text style={styles.addBtnText}>＋ Thêm</Text>
          </TouchableOpacity>
        </View>

        {/* ── Loading ── */}
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={C.primary} />
            <Text style={[styles.loadingText, { color: C.textMuted }]}>Đang tải dữ liệu...</Text>
          </View>
        ) : !isAdmin ? (
          /* ── No admin ── */
          <View style={[styles.noAdminBox, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={styles.noAdminIcon}>🔐</Text>
            <Text style={[styles.noAdminTitle, { color: C.textPrimary }]}>Cần quyền Admin</Text>
            <Text style={[styles.noAdminDesc, { color: C.textMuted }]}>
              Chức năng này chỉ dành cho tài khoản Admin.
            </Text>
          </View>
        ) : (
          <>
            {/* ── Stats row ── */}
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: C.primary }]}>
                <Text style={styles.statIcon}>📚</Text>
                <Text style={styles.statValue}>{questions.length}</Text>
                <Text style={styles.statLabel}>Tổng câu hỏi</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#0891B2' }]}>
                <Text style={styles.statIcon}>🎮</Text>
                <Text style={styles.statValue}>{Object.keys(gameTypeCounts).length}</Text>
                <Text style={styles.statLabel}>Loại game</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#059669' }]}>
                <Text style={styles.statIcon}>✅</Text>
                <Text style={styles.statValue}>{diffCounts.Easy}</Text>
                <Text style={styles.statLabel}>Câu dễ</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#DC2626' }]}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={styles.statValue}>{diffCounts.Hard}</Text>
                <Text style={styles.statLabel}>Câu khó</Text>
              </View>
            </View>

            {/* ── Search bar ── */}
            <View style={[styles.searchBar, { backgroundColor: C.bgCard, borderColor: C.border }]}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={[styles.searchInput, { color: C.textPrimary }]}
                placeholder="Tìm câu hỏi, danh mục..."
                placeholderTextColor={C.textMuted}
                value={search}
                onChangeText={setSearch}
                returnKeyType="search"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
                  <Text style={[styles.clearBtn, { color: C.textMuted }]}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ── Filter chips ── */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {gameTypes.map((type) => {
                const isActive = activeFilter === type;
                const color = GAME_COLORS[type] || GAME_COLORS.default;
                const count = type === 'Tất cả' ? questions.length : (gameTypeCounts[type] || 0);
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterChip,
                      isActive
                        ? { backgroundColor: color, borderColor: color }
                        : { backgroundColor: C.bgCard, borderColor: C.border },
                    ]}
                    onPress={() => setActiveFilter(type)}
                    activeOpacity={0.75}
                  >
                    {type !== 'Tất cả' && (
                      <Text style={styles.filterEmoji}>{GAME_EMOJI[type] || GAME_EMOJI.default}</Text>
                    )}
                    <Text style={[
                      styles.filterLabel,
                      { color: isActive ? '#fff' : C.textSecondary },
                    ]}>
                      {type}
                    </Text>
                    <View style={[
                      styles.filterCount,
                      { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : C.bgApp },
                    ]}>
                      <Text style={[
                        styles.filterCountText,
                        { color: isActive ? '#fff' : C.textMuted },
                      ]}>
                        {count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* ── Section header ── */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>
                {filtered.length} câu hỏi
                {activeFilter !== 'Tất cả' ? ` · ${activeFilter}` : ''}
                {search ? ` · "${search}"` : ''}
              </Text>
            </View>

            {/* ── Empty state ── */}
            {filtered.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: C.bgCard, borderColor: C.border }]}>
                <Text style={styles.emptyIcon}>{search ? '🔍' : '📭'}</Text>
                <Text style={[styles.emptyText, { color: C.textMuted }]}>
                  {search ? `Không tìm thấy kết quả cho "${search}"` : 'Chưa có câu hỏi nào'}
                </Text>
              </View>
            ) : (
              /* ── Question list ── */
              filtered.map((q) => {
                const diff = DIFFICULTY_STYLE[q.difficulty] || DIFFICULTY_STYLE.Easy;
                const emoji = GAME_EMOJI[q.gameType] || GAME_EMOJI.default;
                const gameColor = GAME_COLORS[q.gameType] || GAME_COLORS.default;
                return (
                  <View
                    key={q._id}
                    style={[styles.qItem, { backgroundColor: C.bgCard, borderColor: C.border }]}
                  >
                    {/* Left accent bar */}
                    <View style={[styles.qAccent, { backgroundColor: gameColor }]} />

                    {/* Emoji badge */}
                    <View style={[styles.qEmojiBadge, { backgroundColor: gameColor + '18' }]}>
                      <Text style={styles.qEmoji}>{emoji}</Text>
                    </View>

                    {/* Content */}
                    <View style={styles.qContent}>
                      <Text
                        style={[styles.qTitle, { color: C.textPrimary }]}
                        numberOfLines={2}
                      >
                        {q.questionText || `[${q.gameType}] Câu hỏi`}
                      </Text>
                      <View style={styles.qMeta}>
                        {/* Difficulty badge */}
                        <View style={[styles.diffBadge, { backgroundColor: diff.bg }]}>
                          <Text style={[styles.diffText, { color: diff.color }]}>{diff.label}</Text>
                        </View>
                        {/* Category */}
                        {q.category ? (
                          <View style={[styles.catBadge, { backgroundColor: C.bgApp, borderColor: C.border }]}>
                            <Text style={[styles.catText, { color: C.textMuted }]} numberOfLines={1}>
                              📂 {q.category}
                            </Text>
                          </View>
                        ) : null}
                        {/* Date */}
                        <Text style={[styles.qDate, { color: C.textMuted }]}>
                          {formatDate(q.createdAt)}
                        </Text>
                      </View>
                    </View>

                    {/* Delete button */}
                    <View style={styles.qActions}>
                      {deleting === q._id ? (
                        <ActivityIndicator size="small" color={C.wrong} />
                      ) : (
                        <TouchableOpacity
                          style={[styles.deleteBtn, {
                            backgroundColor: isDark ? '#450A0A' : '#FEF2F2',
                            borderColor: isDark ? '#7F1D1D' : '#FECACA',
                          }]}
                          onPress={() => handleDelete(q._id)}
                          activeOpacity={0.75}
                        >
                          <Text style={styles.deleteBtnText}>🗑</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })
            )}

            {/* Bottom padding */}
            <View style={{ height: 32 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:    { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Page header
  pageHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 18, paddingBottom: 16,
  },
  pageTitle:   { fontSize: 22, fontWeight: '900' },
  pageSubtitle:{ fontSize: 12, marginTop: 3 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 12, gap: 4,
  },
  addBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  // Loading / no-admin
  centerBox: { paddingVertical: 80, alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 13 },
  noAdminBox: {
    borderRadius: 20, marginHorizontal: 20, padding: 40,
    alignItems: 'center', borderWidth: 1, marginTop: 20,
  },
  noAdminIcon:  { fontSize: 48, marginBottom: 12 },
  noAdminTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  noAdminDesc:  { fontSize: 13, textAlign: 'center', lineHeight: 19 },

  // Stats row — 4 mini cards
  statsRow: {
    flexDirection: 'row', paddingHorizontal: 20,
    gap: 10, marginBottom: 20,
  },
  statCard: {
    flex: 1, borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', gap: 4,
    elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 6,
  },
  statIcon:  { fontSize: 18 },
  statValue: { fontSize: 20, fontWeight: '900', color: '#fff' },
  statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: '700', textAlign: 'center' },

  // Search bar
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 14,
    borderRadius: 14, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 10, gap: 10,
  },
  searchIcon:  { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
  clearBtn:    { fontSize: 14, paddingHorizontal: 4 },

  // Filter chips
  filterRow: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1.5, gap: 5,
  },
  filterEmoji:     { fontSize: 13 },
  filterLabel:     { fontSize: 13, fontWeight: '700' },
  filterCount: {
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 10, minWidth: 22, alignItems: 'center',
  },
  filterCountText: { fontSize: 11, fontWeight: '800' },

  // Section header
  sectionHeader: {
    paddingHorizontal: 20, marginBottom: 10,
  },
  sectionTitle: { fontSize: 13, fontWeight: '700' },

  // Empty state
  emptyBox: {
    borderRadius: 16, marginHorizontal: 20, padding: 36,
    alignItems: 'center', borderWidth: 1,
  },
  emptyIcon: { fontSize: 36, marginBottom: 10 },
  emptyText: { fontSize: 13, textAlign: 'center' },

  // Question item
  qItem: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 10,
    borderRadius: 16, borderWidth: 1,
    overflow: 'hidden',
    elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4,
  },
  qAccent: { width: 4, alignSelf: 'stretch' },
  qEmojiBadge: {
    width: 48, height: 48, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 12, marginVertical: 14,
  },
  qEmoji:   { fontSize: 22 },
  qContent: { flex: 1, paddingVertical: 14, paddingHorizontal: 12 },
  qTitle:   { fontSize: 13, fontWeight: '700', lineHeight: 18, marginBottom: 7 },
  qMeta:    { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },

  diffBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 8,
  },
  diffText: { fontSize: 11, fontWeight: '800' },

  catBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 8, borderWidth: 1,
    maxWidth: 120,
  },
  catText: { fontSize: 11, fontWeight: '600' },

  qDate: { fontSize: 11 },

  // Delete button
  qActions: {
    paddingHorizontal: 14, paddingVertical: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  deleteBtn: {
    width: 38, height: 38, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1,
  },
  deleteBtnText: { fontSize: 16 },
});
