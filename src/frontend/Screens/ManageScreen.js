import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../Components/AppHeader';
import BASE_URL from '../config';

const DIFFICULTY_COLOR = {
  Easy:   { color: '#059669', bg: '#DCFCE7' },
  Medium: { color: '#D97706', bg: '#FEF3C7' },
  Hard:   { color: '#DC2626', bg: '#FEE2E2' },
};

const GAME_EMOJI = {
  Quiz: '💻', TrueFalse: '🦆', Flashcard: '🎴', WordScramble: '🔤',
  LuckyNumber: '🎰', PictureQuiz: '🖼️', Matching: '🔗',
  OpenBox: '🎁', SimpleSpin: '🌀', FindMatch: '🔍', default: '🎮',
};

export default function ManageScreen({ navigation }) {
  const { isDark, theme: C } = useTheme();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token || token === 'GUEST') {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const meRes = await fetch(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user?.role === 'Admin') {
            setIsAdmin(true);
            const qRes = await fetch(`${BASE_URL}/manage/questions`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (qRes.ok) {
              const qData = await qRes.json();
              setQuestions(qData);
            }
          }
        }
      } catch (e) {
        console.warn('Manage fetch error:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert('Xóa câu hỏi', 'Bạn có chắc muốn xóa câu hỏi này không?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(id);
            const token = await AsyncStorage.getItem('userToken');
            const res = await fetch(`${BASE_URL}/manage/questions/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              setQuestions(prev => prev.filter(q => q._id !== id));
              Alert.alert('✅ Thành công', 'Đã xóa câu hỏi khỏi database');
            } else {
              Alert.alert('Lỗi', 'Không thể xóa câu hỏi');
            }
          } catch (e) {
            Alert.alert('Lỗi mạng', e.message);
          } finally {
            setDeleting(null);
          }
        },
      },
    ]);
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  // Đếm theo gameType
  const gameTypeCounts = questions.reduce((acc, q) => {
    acc[q.gameType] = (acc[q.gameType] || 0) + 1;
    return acc;
  }, {});

  const totalGameTypes = Object.keys(gameTypeCounts).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgCard} />
      <AppHeader navigation={navigation} activeTab="Manage" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page title — giống ReportScreen */}
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderLeft}>
            <Text style={[styles.pageTitle, { color: C.textPrimary }]}>Quản lý câu hỏi</Text>
            <Text style={[styles.pageSubtitle, { color: C.textMuted }]}>
              {isAdmin ? 'Quản lý toàn bộ câu hỏi trong database' : 'Tổng quan nội dung hệ thống'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: C.bgCard, borderColor: C.border }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('QuestionType')}
          >
            <Text style={styles.addBtnText}>＋</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ paddingVertical: 60, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={C.primary} />
            <Text style={[{ color: C.textMuted, marginTop: 12, fontSize: 13 }]}>Đang kết nối MongoDB...</Text>
          </View>
        ) : !isAdmin ? (
          <View style={[styles.noAdminBox, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🔐</Text>
            <Text style={[styles.noAdminTitle, { color: C.textPrimary }]}>Cần quyền Admin</Text>
            <Text style={[styles.noAdminDesc, { color: C.textMuted }]}>
              Chức năng quản lý câu hỏi chỉ dành cho tài khoản Admin. Hãy liên hệ quản trị viên để được cấp quyền.
            </Text>
          </View>
        ) : (
          <>
            {/* Stats cards — giống ReportScreen */}
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: C.primary }]}>
                <View style={styles.statCardTop}>
                  <View>
                    <Text style={styles.statCardLabel}>Tổng câu hỏi</Text>
                    <Text style={styles.statCardValue}>{questions.length}</Text>
                  </View>
                  <Text style={styles.statCardIcon}>📚</Text>
                </View>
                <Text style={styles.statCardNote}>Trong database</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#0891B2' }]}>
                <View style={styles.statCardTop}>
                  <View>
                    <Text style={styles.statCardLabel}>Loại game</Text>
                    <Text style={styles.statCardValue}>{totalGameTypes}</Text>
                  </View>
                  <Text style={styles.statCardIcon}>🎮</Text>
                </View>
                <Text style={styles.statCardNote}>Game types khác nhau</Text>
              </View>
            </View>

            {/* Section header — giống ReportScreen */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Danh sách câu hỏi</Text>
              <TouchableOpacity
                style={[styles.newBtn, { backgroundColor: C.primaryLight }]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('QuestionType')}
              >
                <Text style={[styles.newBtnText, { color: C.primary }]}>＋ Thêm mới</Text>
              </TouchableOpacity>
            </View>

            {questions.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: C.bgCard, borderColor: C.border }]}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>📭</Text>
                <Text style={[{ color: C.textMuted, fontSize: 13, textAlign: 'center' }]}>
                  Chưa có câu hỏi nào trong database
                </Text>
              </View>
            ) : (
              questions.map((q) => {
                const diff = DIFFICULTY_COLOR[q.difficulty] || DIFFICULTY_COLOR.Easy;
                const emoji = GAME_EMOJI[q.gameType] || GAME_EMOJI.default;
                return (
                  <View
                    key={q._id}
                    style={[styles.questionItem, { backgroundColor: C.bgCard, borderColor: C.border }]}
                  >
                    <View style={styles.questionInfo}>
                      {/* Row 1: emoji + title */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                        <Text style={{ fontSize: 20 }}>{emoji}</Text>
                        <Text style={[styles.questionTitle, { color: C.textPrimary }]} numberOfLines={1}>
                          {q.questionText || `[${q.gameType}] Câu hỏi`}
                        </Text>
                      </View>
                      {/* Row 2: meta */}
                      <Text style={[styles.questionMeta, { color: C.textMuted }]}>
                        🎮 {q.gameType}{'  '}📂 {q.category}{'  '}📅 {formatDate(q.createdAt)}
                      </Text>
                      {/* Row 3: progress bar (difficulty) */}
                      <View style={styles.progressRow}>
                        <View style={[styles.progressBg, { backgroundColor: C.bgApp }]}>
                          <View style={[styles.progressFill, {
                            width: q.difficulty === 'Easy' ? '33%' : q.difficulty === 'Medium' ? '66%' : '100%',
                            backgroundColor: diff.color,
                          }]} />
                        </View>
                        <Text style={[styles.progressLabel, { color: C.textMuted }]}>
                          {q.difficulty || 'Easy'}
                        </Text>
                      </View>
                    </View>

                    {/* Action — score chip style */}
                    <View style={styles.questionActions}>
                      {deleting === q._id ? (
                        <ActivityIndicator size="small" color={C.wrong} />
                      ) : (
                        <TouchableOpacity
                          style={[styles.deleteChip, { backgroundColor: isDark ? '#450A0A' : '#FEE2E2' }]}
                          activeOpacity={0.7}
                          onPress={() => handleDelete(q._id)}
                        >
                          <Text style={styles.deleteChipText}>🗑️</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  // Page header — giống ReportScreen
  pageHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14,
  },
  pageHeaderLeft: {},
  pageTitle: { fontSize: 20, fontWeight: '900' },
  pageSubtitle: { fontSize: 12, marginTop: 2 },
  addBtn: {
    width: 38, height: 38, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
  },
  addBtnText: { fontSize: 20, lineHeight: 24 },

  // No admin box
  noAdminBox: {
    borderRadius: 20, marginHorizontal: 20, padding: 40,
    alignItems: 'center', borderWidth: 1,
  },
  noAdminTitle: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
  noAdminDesc: { fontSize: 13, textAlign: 'center', lineHeight: 19 },

  // Stats cards — giống ReportScreen
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1, borderRadius: 18, padding: 16,
    elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 8,
  },
  statCardTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 10,
  },
  statCardLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: 4 },
  statCardValue: { fontSize: 32, fontWeight: '900', color: '#fff' },
  statCardIcon: { fontSize: 24 },
  statCardNote: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },

  // Section header — giống ReportScreen
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 14, flexWrap: 'wrap', gap: 8,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800' },
  newBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  newBtnText: { fontSize: 12, fontWeight: '700' },

  // Empty box
  emptyBox: {
    borderRadius: 14, marginHorizontal: 20, padding: 32,
    alignItems: 'center', borderWidth: 1,
  },

  // Question item — giống testItem trong ReportScreen
  questionItem: {
    borderRadius: 16, marginHorizontal: 20, marginBottom: 12, padding: 16,
    borderWidth: 1, elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  questionInfo: { flex: 1 },
  questionTitle: { fontSize: 14, fontWeight: '700', flex: 1 },
  questionMeta: { fontSize: 11, marginBottom: 10 },
  progressRow: { gap: 6 },
  progressBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  progressLabel: { fontSize: 11, fontWeight: '600' },

  questionActions: { alignItems: 'center' },
  deleteChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  deleteChipText: { fontSize: 16 },

  // FAB (removed)

});
