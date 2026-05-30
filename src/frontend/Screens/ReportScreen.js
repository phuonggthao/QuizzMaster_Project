import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Colors } from '../Styles/Colors';

const RECENT_TESTS = [
  {
    id: '1',
    title: 'Toán lớp 5 — Phân số',
    date: '12/07/2025',
    students: 28,
    completion: 92,
  },
  {
    id: '2',
    title: 'Ngữ Văn 8 — Truyện Kiều',
    date: '10/07/2025',
    students: 32,
    completion: 75,
  },
  {
    id: '3',
    title: 'Tiếng Anh — Thì hiện tại',
    date: '08/07/2025',
    students: 30,
    completion: 88,
  },
];

// Donut chart dùng View thuần — không cần thư viện ngoài
function DonutChart({ percent }) {
  // Vẽ donut bằng 2 vòng tròn chồng nhau
  const size = 160;
  const thickness = 22;
  const inner = size - thickness * 2;

  return (
    <View style={donutStyles.wrapper}>
      {/* Outer ring background */}
      <View style={[donutStyles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: Colors.border }]} />
      {/* Correct arc — dùng clip trick */}
      <View style={[donutStyles.ring, {
        width: size, height: size, borderRadius: size / 2,
        borderColor: Colors.correct,
        borderTopColor: Colors.correct,
        borderRightColor: Colors.correct,
        borderBottomColor: percent > 50 ? Colors.correct : Colors.border,
        borderLeftColor: Colors.border,
        transform: [{ rotate: '-45deg' }],
        position: 'absolute',
      }]} />
      {/* Inner white circle */}
      <View style={[donutStyles.inner, { width: inner, height: inner, borderRadius: inner / 2 }]}>
        <Text style={donutStyles.percent}>{percent}%</Text>
        <Text style={donutStyles.label}>Trung bình lớp</Text>
      </View>
    </View>
  );
}

const donutStyles = StyleSheet.create({
  wrapper: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 22,
    borderColor: Colors.border,
  },
  inner: {
    backgroundColor: Colors.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percent: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  label: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
});

export default function ReportScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgApp} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Báo cáo & Đánh giá</Text>
          <Text style={styles.headerSubtitle}>Tổng quan hiệu suất lớp học</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchBtn} activeOpacity={0.7}>
            <Text style={styles.searchBtnText}>🔍</Text>
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>GV</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Donut chart card */}
        <View style={styles.donutCard}>
          <Text style={styles.donutCardTitle}>Tỉ lệ trả lời đúng</Text>
          <View style={styles.donutRow}>
            <DonutChart percent={72} />
            <View style={styles.donutLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.correct }]} />
                <Text style={styles.legendText}>Đúng — 72%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.wrong }]} />
                <Text style={styles.legendText}>Sai — 28%</Text>
              </View>
              <Text style={styles.donutNote}>Dựa trên 24 bài kiểm tra gần nhất</Text>
            </View>
          </View>
        </View>

        {/* Stats cards */}
        <View style={styles.statsRow}>
          {/* Card tím */}
          <View style={[styles.statCard, { backgroundColor: Colors.primary }]}>
            <View style={styles.statCardTop}>
              <View>
                <Text style={styles.statCardLabel}>Tổng số bài kiểm tra</Text>
                <Text style={styles.statCardValue}>24</Text>
              </View>
              <Text style={styles.statCardIcon}>📋</Text>
            </View>
            <Text style={styles.statCardNote}>+12% so với tháng trước</Text>
          </View>

          {/* Card xanh */}
          <View style={[styles.statCard, { backgroundColor: '#0891B2' }]}>
            <View style={styles.statCardTop}>
              <View>
                <Text style={styles.statCardLabel}>Học sinh tích cực</Text>
                <Text style={styles.statCardValue}>156</Text>
              </View>
              <Text style={styles.statCardIcon}>🎓</Text>
            </View>
            <Text style={styles.statCardNote}>Đang tham gia 4 lớp học</Text>
          </View>
        </View>

        {/* Recent tests section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bài kiểm tra gần đây</Text>
          <TouchableOpacity style={styles.exportBtn} activeOpacity={0.8}>
            <Text style={styles.exportBtnText}>⬇ Xuất Excel toàn bộ</Text>
          </TouchableOpacity>
        </View>

        {RECENT_TESTS.map((test) => (
          <View key={test.id} style={styles.testItem}>
            <View style={styles.testInfo}>
              <Text style={styles.testTitle}>{test.title}</Text>
              <Text style={styles.testMeta}>
                📅 {test.date}  •  👥 {test.students} học sinh
              </Text>
              {/* Progress bar */}
              <View style={styles.progressRow}>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${test.completion}%` }]} />
                </View>
                <Text style={styles.progressLabel}>Hoàn thành {test.completion}%</Text>
              </View>
            </View>
            <View style={styles.testActions}>
              <TouchableOpacity style={styles.detailBtn} activeOpacity={0.8}>
                <Text style={styles.detailBtnText}>Xem chi tiết</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreBtn} activeOpacity={0.7}>
                <Text style={styles.moreBtnText}>⋮</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgApp },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerLeft: {},
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchBtnText: { fontSize: 16 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  // Donut card
  donutCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  donutCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  donutLegend: {
    flex: 1,
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  donutNote: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    lineHeight: 15,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  statCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  statCardLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
  },
  statCardIcon: { fontSize: 24 },
  statCardNote: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },
  exportBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  exportBtnText: { fontSize: 12, color: Colors.primary, fontWeight: '700' },

  // Test item
  testItem: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  testInfo: { marginBottom: 12 },
  testTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  testMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  progressRow: {
    gap: 6,
  },
  progressBg: {
    height: 6,
    backgroundColor: Colors.bgApp,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  testActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  detailBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.bgApp,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  moreBtnText: { fontSize: 18, color: Colors.textMuted },
});
