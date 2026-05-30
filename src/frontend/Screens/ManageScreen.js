import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Colors } from '../Styles/Colors';

const MY_QUIZZES = [
  {
    id: '1',
    emoji: '🔢',
    thumbColor: Colors.primary,
    title: 'Toán lớp 5 — Phân số',
    status: 'Đã xuất bản',
    statusColor: Colors.correct,
    statusBg: '#DCFCE7',
    questions: 20,
    plays: '1.2k lượt',
  },
  {
    id: '2',
    emoji: '📖',
    thumbColor: '#059669',
    title: 'Ngữ Văn 8 — Truyện Kiều',
    status: 'Bản nháp',
    statusColor: Colors.textMuted,
    statusBg: Colors.border,
    questions: 15,
    plays: '0 lượt',
  },
  {
    id: '3',
    emoji: '🌍',
    thumbColor: '#0891B2',
    title: 'Tiếng Anh — Thì hiện tại',
    status: 'Đã xuất bản',
    statusColor: Colors.correct,
    statusBg: '#DCFCE7',
    questions: 25,
    plays: '856 lượt',
  },
];

const IMPORT_OPTIONS = [
  {
    id: '1',
    emoji: '📊',
    title: 'Nhập từ Excel',
    desc: 'Tải file .xlsx hoặc .csv có sẵn',
  },
  {
    id: '2',
    emoji: '📝',
    title: 'Nhập từ Google Forms',
    desc: 'Đồng bộ câu hỏi từ biểu mẫu của bạn',
  },
];

export default function ManageScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgApp} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>QuizMates</Text>
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.8}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>GV</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* AI Banner */}
        <View style={styles.aiBanner}>
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
        <View style={styles.importCard}>
          {IMPORT_OPTIONS.map((opt, idx) => (
            <View key={opt.id}>
              <TouchableOpacity style={styles.importItem} activeOpacity={0.8}>
                <Text style={styles.importEmoji}>{opt.emoji}</Text>
                <View style={styles.importInfo}>
                  <Text style={styles.importTitle}>{opt.title}</Text>
                  <Text style={styles.importDesc}>{opt.desc}</Text>
                </View>
                <Text style={styles.importArrow}>›</Text>
              </TouchableOpacity>
              {idx < IMPORT_OPTIONS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* My quizzes section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bộ câu hỏi của tôi</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {MY_QUIZZES.map((quiz) => (
          <View key={quiz.id} style={styles.quizItem}>
            {/* Thumbnail */}
            <View style={[styles.quizThumb, { backgroundColor: quiz.thumbColor }]}>
              <Text style={styles.quizThumbEmoji}>{quiz.emoji}</Text>
            </View>

            {/* Info */}
            <View style={styles.quizInfo}>
              <Text style={styles.quizTitle} numberOfLines={1}>{quiz.title}</Text>
              <View style={styles.quizMetaRow}>
                <View style={[styles.statusBadge, { backgroundColor: quiz.statusBg }]}>
                  <Text style={[styles.statusText, { color: quiz.statusColor }]}>
                    {quiz.status}
                  </Text>
                </View>
                <Text style={styles.quizMeta}>
                  {quiz.questions} câu  •  {quiz.plays}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.quizActions}>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Text style={styles.actionBtnText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Text style={styles.actionBtnText}>⋮</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('QuestionType')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgApp },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  logo: { fontSize: 22, fontWeight: '900', color: Colors.primary },
  avatarBtn: {},
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  // AI Banner
  aiBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    padding: 22,
  },
  aiBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  aiIcon: { fontSize: 18 },
  aiLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 26,
  },
  aiSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 18,
    marginBottom: 18,
  },
  aiBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  aiBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  // Import card
  importCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  importItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  importEmoji: { fontSize: 26 },
  importInfo: { flex: 1 },
  importTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  importDesc: { fontSize: 12, color: Colors.textMuted },
  importArrow: { fontSize: 24, color: Colors.textMuted, fontWeight: '300' },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '700' },

  // Quiz item
  quizItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    gap: 12,
  },
  quizThumb: {
    width: 60,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizThumbEmoji: { fontSize: 28 },
  quizInfo: { flex: 1 },
  quizTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  quizMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  quizMeta: { fontSize: 11, color: Colors.textMuted },
  quizActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.bgApp,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: { fontSize: 16 },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
});
