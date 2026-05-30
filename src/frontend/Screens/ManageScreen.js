import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../Components/AppHeader';
import BASE_URL from '../config';

const IMPORT_OPTIONS = [
  { id: '1', emoji: '📊', title: 'Nhập từ Excel', desc: 'Tải file .xlsx hoặc .csv có sẵn' },
  { id: '2', emoji: '📝', title: 'Nhập từ Google Forms', desc: 'Đồng bộ câu hỏi từ biểu mẫu của bạn' },
];

const DIFFICULTY_COLOR = {
  Easy:   { color: '#059669', bg: '#DCFCE7' },
  Medium: { color: '#D97706', bg: '#FEF3C7' },
  Hard:   { color: '#DC2626', bg: '#FEE2E2' },
};

const GAME_EMOJI = {
  Quiz: '💻', TrueFalse: '🦆', Flashcard: '🎴', WordScramble: '🔤',
  LuckyNumber: '🎰', PictureQuiz: '🖼️', Matching: '🔗',
  OpenBox: '🎁', SimpleSpin: '🌀', FindMatch: '🔍',
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

        // Kiểm tra có phải admin không
        const meRes = await fetch(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user?.role === 'Admin') {
            setIsAdmin(true);
            // Lấy danh sách câu hỏi thật
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

  const handleDelete = async (id, title) => {
    Alert.alert('Xóa câu hỏi', `Bạn có chắc muốn xóa câu hỏi này không?`, [
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgCard} />
      <AppHeader navigation={navigation} activeTab="Manage" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* AI Banner */}
        <View style={[styles.aiBanner, { backgroundColor: C.primaryDark }]}>
          <View style={styles.aiBannerTop}>
            <Text style={styles.aiIcon}>✨</Text>
            <Text style={styles.aiLabel}>QUIZMATES AI ASSISTANT</Text>
          </View>
          <Text style={styles.aiTitle}>Sáng tạo nội dung trong tích tắc</Text>
          <Text style={styles.aiSubtitle}>
            Tạo bộ câu hỏi chuyên nghiệp chỉ trong vài giây với sức mạnh AI
          </Text>
          <TouchableOpacity style={styles.aiBtn} activeOpacity={0.85} onPress={() => navigation.navigate('QuestionType')}>
            <Text style={styles.aiBtnText}>⊕ Tạo với Quizizz AI</Text>
          </TouchableOpacity>
        </View>

        {/* Import options */}
        <View style={[styles.importCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
          {IMPORT_OPTIONS.map((opt, idx) => (
            <View key={opt.id}>
              <TouchableOpacity
                style={styles.importItem}
                activeOpacity={0.8}
                onPress={() => Alert.alert('Thông báo', opt.id === '1' ? 'Tính năng nhập Excel đang phát triển' : 'Tính năng nhập Google Forms đang phát triển')}
              >
                <Text style={styles.importEmoji}>{opt.emoji}</Text>
                <View style={styles.importInfo}>
                  <Text style={[styles.importTitle, { color: C.textPrimary }]}>{opt.title}</Text>
                  <Text style={[styles.importDesc, { color: C.textMuted }]}>{opt.desc}</Text>
                </View>
                <Text style={[styles.importArrow, { color: C.textMuted }]}>›</Text>
              </TouchableOpacity>
              {idx < IMPORT_OPTIONS.length - 1 && <View style={[styles.divider, { backgroundColor: C.border }]} />}
            </View>
          ))}
        </View>

        {/* Questions section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>
              {isAdmin ? 'Câu hỏi trong Database' : 'Bộ câu hỏi của tôi'}
            </Text>
            {isAdmin && !loading && (
              <Text style={[{ fontSize: 12, color: C.textMuted, marginTop: 2 }]}>
                {questions.length} câu hỏi tổng cộng
              </Text>
            )}
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('QuestionType')}>
            <Text style={[styles.seeAll, { color: C.primary }]}>+ Thêm mới</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={C.primary} />
            <Text style={[{ color: C.textMuted, marginTop: 12, fontSize: 13 }]}>Đang kết nối MongoDB...</Text>
          </View>
        ) : !isAdmin ? (
          // Non-admin: hiển thị thông báo và hướng dẫn
          <View style={[styles.noAdminBox, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🔐</Text>
            <Text style={[styles.noAdminTitle, { color: C.textPrimary }]}>Cần quyền Admin</Text>
            <Text style={[styles.noAdminDesc, { color: C.textMuted }]}>
              Chức năng quản lý câu hỏi chỉ dành cho tài khoản Admin. Hãy liên hệ quản trị viên để được cấp quyền.
            </Text>
          </View>
        ) : questions.length === 0 ? (
          <View style={[styles.noAdminBox, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📭</Text>
            <Text style={[styles.noAdminTitle, { color: C.textPrimary }]}>Chưa có câu hỏi</Text>
            <Text style={[styles.noAdminDesc, { color: C.textMuted }]}>
              Database chưa có câu hỏi nào. Hãy thêm câu hỏi mới hoặc chạy seed script.
            </Text>
          </View>
        ) : (
          questions.map((q) => {
            const diff = DIFFICULTY_COLOR[q.difficulty] || DIFFICULTY_COLOR.Easy;
            const emoji = GAME_EMOJI[q.gameType] || '🎮';
            return (
              <View key={q._id} style={[styles.quizItem, { backgroundColor: C.bgCard, borderColor: C.border }]}>
                {/* Thumbnail */}
                <View style={[styles.quizThumb, { backgroundColor: C.primaryDark }]}>
                  <Text style={styles.quizThumbEmoji}>{emoji}</Text>
                </View>

                {/* Info */}
                <View style={styles.quizInfo}>
                  <Text style={[styles.quizTitle, { color: C.textPrimary }]} numberOfLines={1}>
                    {q.questionText || `[${q.gameType}] Câu hỏi`}
                  </Text>
                  <View style={styles.quizMetaRow}>
                    <View style={[styles.statusBadge, { backgroundColor: diff.bg }]}>
                      <Text style={[styles.statusText, { color: diff.color }]}>{q.difficulty || 'Easy'}</Text>
                    </View>
                    <Text style={[styles.quizMeta, { color: C.textMuted }]}>
                      {q.gameType}  •  {q.category}
                    </Text>
                  </View>
                  <Text style={[{ fontSize: 10, color: C.textMuted, marginTop: 2 }]}>
                    📅 {formatDate(q.createdAt)}
                  </Text>
                </View>

                {/* Actions */}
                <View style={styles.quizActions}>
                  {deleting === q._id ? (
                    <ActivityIndicator size="small" color={C.wrong} />
                  ) : (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: isDark ? '#450A0A' : '#FEE2E2' }]}
                      activeOpacity={0.7}
                      onPress={() => handleDelete(q._id, q.questionText)}
                    >
                      <Text style={styles.actionBtnText}>🗑️</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: C.primary, shadowColor: C.primary }]}
        onPress={() => navigation.navigate('QuestionType')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  aiBanner: { marginHorizontal: 20, marginBottom: 20, borderRadius: 20, padding: 22 },
  aiBannerTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  aiIcon: { fontSize: 18 },
  aiLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.75)', letterSpacing: 1 },
  aiTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 8, lineHeight: 26 },
  aiSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 18, marginBottom: 18 },
  aiBtn: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, alignSelf: 'flex-start' },
  aiBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  importCard: { marginHorizontal: 20, marginBottom: 24, borderRadius: 16, borderWidth: 1, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
  importItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  importEmoji: { fontSize: 26 },
  importInfo: { flex: 1 },
  importTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  importDesc: { fontSize: 12 },
  importArrow: { fontSize: 24, fontWeight: '300' },
  divider: { height: 1, marginHorizontal: 16 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '800' },
  seeAll: { fontSize: 13, fontWeight: '700' },

  noAdminBox: { borderRadius: 16, marginHorizontal: 20, padding: 32, alignItems: 'center', borderWidth: 1 },
  noAdminTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  noAdminDesc: { fontSize: 13, textAlign: 'center', lineHeight: 18 },

  quizItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, marginHorizontal: 20, marginBottom: 12, padding: 14, borderWidth: 1, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, gap: 12 },
  quizThumb: { width: 60, height: 60, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  quizThumbEmoji: { fontSize: 28 },
  quizInfo: { flex: 1 },
  quizTitle: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  quizMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  quizMeta: { fontSize: 11 },
  quizActions: { flexDirection: 'row', gap: 4 },
  actionBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { fontSize: 16 },

  fab: { position: 'absolute', bottom: 80, right: 20, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
});
