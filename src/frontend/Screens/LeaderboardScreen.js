import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Colors } from '../Styles/Colors';

const LEADERBOARD = [
  { rank: 1, name: 'Minh Anh', score: 980, combo: 12, avatar: 'MA' },
  { rank: 2, name: 'Bảo Châu', score: 920, combo: 8, avatar: 'BC' },
  { rank: 3, name: 'Tuấn Kiệt', score: 870, combo: 5, avatar: 'TK' },
  { rank: 4, name: 'Hồng Nhung', score: 840, combo: 4, avatar: 'HN' },
  { rank: 5, name: 'Quốc Bảo', score: 810, combo: 3, avatar: 'QB' },
  { rank: 6, name: 'Lan Anh', score: 790, combo: 2, avatar: 'LA' },
  { rank: 7, name: 'Đức Minh', score: 760, combo: 1, avatar: 'ĐM' },
  { rank: 8, name: 'Phương Linh', score: 740, combo: 0, avatar: 'PL' },
  { rank: 9, name: 'Văn Hùng', score: 720, combo: 0, avatar: 'VH' },
  { rank: 10, name: 'Thùy Dung', score: 700, combo: 0, avatar: 'TD' },
];

const MY_RANK = { rank: 14, name: 'Bạn', score: 620, combo: 2, avatar: 'BN' };

const AVATAR_COLORS = [
  Colors.primary, '#059669', '#0891B2', '#D97706',
  '#DC2626', '#7C3AED', '#DB2777', '#0284C7',
];

function getAvatarColor(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export default function LeaderboardScreen({ route, navigation }) {
  const { score = 0, total = 10 } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>🏆 BẢNG XẾP HẠNG TRỰC TIẾP</Text>
        </View>
        <Text style={styles.headerTitle}>Đang diễn ra: Quiz Toán lớp 5</Text>
        <Text style={styles.headerSubtitle}>
          Câu hỏi 12/20  •  Cập nhật ngay lập tức
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top 3 podium */}
        <View style={styles.podium}>
          {/* Rank 2 — left */}
          <View style={styles.podiumSide}>
            <View style={[styles.podiumAvatar, styles.podiumAvatarSm, { backgroundColor: getAvatarColor(1) }]}>
              <Text style={styles.podiumAvatarText}>{LEADERBOARD[1].avatar}</Text>
            </View>
            <View style={styles.podiumRankBadge}>
              <Text style={styles.podiumRankNum}>2</Text>
            </View>
            <Text style={styles.podiumName}>{LEADERBOARD[1].name}</Text>
            <Text style={styles.podiumScore}>{LEADERBOARD[1].score} đ</Text>
          </View>

          {/* Rank 1 — center */}
          <View style={styles.podiumCenter}>
            <Text style={styles.crown}>👑</Text>
            <View style={[styles.podiumAvatar, styles.podiumAvatarLg, { backgroundColor: getAvatarColor(0) }]}>
              <Text style={styles.podiumAvatarTextLg}>{LEADERBOARD[0].avatar}</Text>
            </View>
            <View style={[styles.podiumRankBadge, styles.podiumRankBadge1]}>
              <Text style={styles.podiumRankNum}>1</Text>
            </View>
            <Text style={[styles.podiumName, styles.podiumName1]}>{LEADERBOARD[0].name}</Text>
            <Text style={[styles.podiumScore, styles.podiumScore1]}>{LEADERBOARD[0].score} đ</Text>
            {LEADERBOARD[0].combo > 0 && (
              <View style={styles.comboBadge}>
                <Text style={styles.comboBadgeText}>Chuỗi x{LEADERBOARD[0].combo}</Text>
              </View>
            )}
          </View>

          {/* Rank 3 — right */}
          <View style={styles.podiumSide}>
            <View style={[styles.podiumAvatar, styles.podiumAvatarSm, { backgroundColor: getAvatarColor(2) }]}>
              <Text style={styles.podiumAvatarText}>{LEADERBOARD[2].avatar}</Text>
            </View>
            <View style={styles.podiumRankBadge}>
              <Text style={styles.podiumRankNum}>3</Text>
            </View>
            <Text style={styles.podiumName}>{LEADERBOARD[2].name}</Text>
            <Text style={styles.podiumScore}>{LEADERBOARD[2].score} đ</Text>
          </View>
        </View>

        {/* List from rank 4 */}
        {LEADERBOARD.slice(3).map((item, idx) => (
          <View key={item.rank} style={styles.listItem}>
            <Text style={styles.listRank}>{item.rank}</Text>
            <View style={[styles.listAvatar, { backgroundColor: getAvatarColor(idx + 3) }]}>
              <Text style={styles.listAvatarText}>{item.avatar}</Text>
            </View>
            <Text style={styles.listName}>{item.name}</Text>
            <View style={styles.listRight}>
              {item.combo > 0 && (
                <View style={styles.listComboBadge}>
                  <Text style={styles.listComboBadgeText}>🔥 x{item.combo}</Text>
                </View>
              )}
              <Text style={styles.listScore}>{item.score} đ</Text>
            </View>
          </View>
        ))}

        {/* Spacer for sticky card */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky "Bạn" card */}
      <View style={styles.myCard}>
        <View style={styles.myCardLeft}>
          <Text style={styles.myRank}>#{MY_RANK.rank}</Text>
          <View style={[styles.listAvatar, { backgroundColor: Colors.primary }]}>
            <Text style={styles.listAvatarText}>{MY_RANK.avatar}</Text>
          </View>
          <View>
            <Text style={styles.myName}>{MY_RANK.name}</Text>
            <Text style={styles.myScore}>{score || MY_RANK.score} điểm</Text>
          </View>
        </View>
        {MY_RANK.combo > 0 && (
          <View style={styles.myCombo}>
            <Text style={styles.myComboText}>🔥 x{MY_RANK.combo}</Text>
          </View>
        )}
      </View>

      {/* Continue button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('Quiz', { gameType: 'Quiz' })}
          activeOpacity={0.88}
        >
          <Text style={styles.continueBtnText}>▶ Tiếp tục Quiz</Text>
        </TouchableOpacity>
        <Text style={styles.viewersText}>👁 42 người đang xem...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgApp },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // Header
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },

  // Podium
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 12,
  },
  podiumCenter: {
    alignItems: 'center',
    flex: 1.2,
  },
  podiumSide: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  crown: { fontSize: 28, marginBottom: 4 },
  podiumAvatar: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  podiumAvatarLg: { width: 80, height: 80 },
  podiumAvatarSm: { width: 60, height: 60 },
  podiumAvatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  podiumAvatarTextLg: { color: '#fff', fontWeight: '900', fontSize: 22 },
  podiumRankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  podiumRankBadge1: { backgroundColor: Colors.accent },
  podiumRankNum: { color: '#fff', fontWeight: '900', fontSize: 12 },
  podiumName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  podiumName1: { fontSize: 15, fontWeight: '900', color: Colors.textPrimary },
  podiumScore: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  podiumScore1: { fontSize: 14, color: Colors.primary, fontWeight: '800' },
  comboBadge: {
    marginTop: 6,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  comboBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.primary },

  // List items
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  listRank: {
    width: 24,
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listAvatarText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  listName: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  listRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  listComboBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  listComboBadgeText: { fontSize: 11, fontWeight: '700', color: '#D97706' },
  listScore: { fontSize: 14, fontWeight: '800', color: Colors.primary },

  // My card (sticky)
  myCard: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#0891B2',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  myCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  myRank: { fontSize: 16, fontWeight: '900', color: '#fff' },
  myName: { fontSize: 14, fontWeight: '800', color: '#fff' },
  myScore: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  myCombo: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  myComboText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: Colors.bgApp,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  continueBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  continueBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  viewersText: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
});
