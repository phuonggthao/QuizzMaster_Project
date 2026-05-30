import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import { useTheme } from '../context/ThemeContext';

// Màu avatar mặc định nếu không có dữ liệu
const AVATAR_COLORS_LIST = [
  '#7C3AED', '#059669', '#0891B2', '#D97706',
  '#DC2626', '#4C1D95', '#DB2777', '#0284C7',
];

function getAvatarColor(index) {
  return AVATAR_COLORS_LIST[index % AVATAR_COLORS_LIST.length];
}

function getInitials(name = '') {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function LeaderboardScreen({ route, navigation }) {
  const { score = 0, total = 10 } = route.params || {};
  const { isDark, theme: C } = useTheme();

  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const res = await fetch(`${BASE_URL}/game/leaderboard`);
        const data = await res.json();
        if (res.ok) {
          setLeaderboard(data);
          // Tìm rank của user hiện tại trong bảng xếp hạng
          if (token && token !== 'GUEST') {
            const meRes = await fetch(`${BASE_URL}/auth/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (meRes.ok) {
              const meData = await meRes.json();
              const me = meData.user;
              const idx = data.findIndex(u => u._id === me._id || u.username === me.username);
              setMyRank({
                rank: idx >= 0 ? idx + 1 : data.length + 1,
                name: me.fullName || me.username,
                score: score > 0 ? score : (me.highScore || 0),
                avatar: getInitials(me.fullName || me.username),
              });
            }
          }
        }
      } catch (e) {
        console.warn('Leaderboard error:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: C.bgApp }]}>
        <StatusBar barStyle="light-content" backgroundColor={C.primary} />
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={[styles.loadingText, { color: C.textMuted }]}>Đang tải bảng xếp hạng...</Text>
      </View>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const rest  = leaderboard.slice(3);

  // Nếu DB rỗng, hiển thị fallback đẹp
  if (leaderboard.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
        <StatusBar barStyle="light-content" backgroundColor={C.primary} />
        <View style={[styles.header, { backgroundColor: C.primary }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>🏆 BẢNG XẾP HẠNG</Text>
          </View>
          <Text style={styles.headerTitle}>Chưa có dữ liệu</Text>
          <Text style={styles.headerSubtitle}>Hãy chơi quiz đầu tiên để lên bảng!</Text>
        </View>
        <View style={[styles.center, { flex: 1, backgroundColor: C.bgApp }]}>
          <Text style={{ fontSize: 48 }}>🎮</Text>
          <Text style={[{ color: C.textMuted, fontSize: 15, marginTop: 12, textAlign: 'center', paddingHorizontal: 32 }]}>
            Chưa có ai trong bảng xếp hạng. Hãy là người đầu tiên!
          </Text>
        </View>
        <View style={[styles.footer, { backgroundColor: C.bgApp }]}>
          <TouchableOpacity
            style={[styles.continueBtn, { backgroundColor: C.primary, shadowColor: C.primary }]}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.88}
          >
            <Text style={styles.continueBtnText}>▶ Chơi ngay</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>🏆 BẢNG XẾP HẠNG TOÀN HỆ THỐNG</Text>
        </View>
        <Text style={styles.headerTitle}>Top người chơi xuất sắc</Text>
        <Text style={styles.headerSubtitle}>
          {leaderboard.length} người chơi  •  Cập nhật tức thì
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top 3 podium */}
        {top3.length >= 3 && (
          <View style={styles.podium}>
            {/* Rank 2 — left */}
            <View style={[styles.podiumSide, { backgroundColor: C.bgCard, borderColor: C.border }]}>
              <View style={[styles.podiumAvatar, styles.podiumAvatarSm, { backgroundColor: getAvatarColor(1) }]}>
                <Text style={styles.podiumAvatarText}>{getInitials(top3[1]?.fullName || top3[1]?.username)}</Text>
              </View>
              <View style={styles.podiumRankBadge}>
                <Text style={styles.podiumRankNum}>2</Text>
              </View>
              <Text style={[styles.podiumName, { color: C.textPrimary }]} numberOfLines={1}>
                {top3[1]?.fullName || top3[1]?.username}
              </Text>
              <Text style={[styles.podiumScore, { color: C.textMuted }]}>{top3[1]?.highScore || 0} đ</Text>
            </View>

            {/* Rank 1 — center */}
            <View style={styles.podiumCenter}>
              <Text style={styles.crown}>👑</Text>
              <View style={[styles.podiumAvatar, styles.podiumAvatarLg, { backgroundColor: getAvatarColor(0) }]}>
                <Text style={styles.podiumAvatarTextLg}>{getInitials(top3[0]?.fullName || top3[0]?.username)}</Text>
              </View>
              <View style={[styles.podiumRankBadge, styles.podiumRankBadge1]}>
                <Text style={styles.podiumRankNum}>1</Text>
              </View>
              <Text style={[styles.podiumName, styles.podiumName1, { color: C.textPrimary }]} numberOfLines={1}>
                {top3[0]?.fullName || top3[0]?.username}
              </Text>
              <Text style={[styles.podiumScore, styles.podiumScore1, { color: C.primary }]}>
                {top3[0]?.highScore || 0} đ
              </Text>
              <View style={[styles.comboBadge, { backgroundColor: C.primaryLight }]}>
                <Text style={[styles.comboBadgeText, { color: C.primary }]}>Lv.{top3[0]?.level || 1}</Text>
              </View>
            </View>

            {/* Rank 3 — right */}
            <View style={[styles.podiumSide, { backgroundColor: C.bgCard, borderColor: C.border }]}>
              <View style={[styles.podiumAvatar, styles.podiumAvatarSm, { backgroundColor: getAvatarColor(2) }]}>
                <Text style={styles.podiumAvatarText}>{getInitials(top3[2]?.fullName || top3[2]?.username)}</Text>
              </View>
              <View style={styles.podiumRankBadge}>
                <Text style={styles.podiumRankNum}>3</Text>
              </View>
              <Text style={[styles.podiumName, { color: C.textPrimary }]} numberOfLines={1}>
                {top3[2]?.fullName || top3[2]?.username}
              </Text>
              <Text style={[styles.podiumScore, { color: C.textMuted }]}>{top3[2]?.highScore || 0} đ</Text>
            </View>
          </View>
        )}

        {/* List from rank 4 */}
        {rest.map((item, idx) => (
          <View key={item._id} style={[styles.listItem, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={[styles.listRank, { color: C.textMuted }]}>{idx + 4}</Text>
            <View style={[styles.listAvatar, { backgroundColor: getAvatarColor(idx + 3) }]}>
              <Text style={styles.listAvatarText}>{getInitials(item.fullName || item.username)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.listName, { color: C.textPrimary }]}>{item.fullName || item.username}</Text>
              <Text style={[{ fontSize: 10, color: C.textMuted }]}>Lv.{item.level || 1}</Text>
            </View>
            <Text style={[styles.listScore, { color: C.primary }]}>{item.highScore || 0} đ</Text>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky "Bạn" card */}
      {myRank && (
        <View style={styles.myCard}>
          <View style={styles.myCardLeft}>
            <Text style={styles.myRank}>#{myRank.rank}</Text>
            <View style={[styles.listAvatar, { backgroundColor: C.primary }]}>
              <Text style={styles.listAvatarText}>{myRank.avatar}</Text>
            </View>
            <View>
              <Text style={styles.myName}>{myRank.name}</Text>
              <Text style={styles.myScore}>{myRank.score} điểm</Text>
            </View>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: C.bgApp }]}>
        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: C.primary, shadowColor: C.primary }]}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.88}
        >
          <Text style={styles.continueBtnText}>▶ Tiếp tục Quiz</Text>
        </TouchableOpacity>
        <Text style={[styles.viewersText, { color: C.textMuted }]}>👥 {leaderboard.length} người tham gia</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 15 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // Header
  header: {
    paddingTop: 20, paddingBottom: 24, paddingHorizontal: 20,
    alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 2,
    marginBottom: 8,
  },
  backBtnText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 22,
    fontWeight: '700',
  },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14,
    paddingVertical: 6, borderRadius: 20, marginBottom: 12,
  },
  headerBadgeText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 6 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },

  // Podium
  podium: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center',
    paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20, gap: 12,
  },
  podiumCenter: { alignItems: 'center', flex: 1.2 },
  podiumSide: {
    alignItems: 'center', flex: 1, borderRadius: 16, padding: 14,
    borderWidth: 1, elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6,
  },
  crown: { fontSize: 28, marginBottom: 4 },
  podiumAvatar: { borderRadius: 999, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  podiumAvatarLg: { width: 80, height: 80 },
  podiumAvatarSm: { width: 60, height: 60 },
  podiumAvatarText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  podiumAvatarTextLg: { color: '#fff', fontWeight: '900', fontSize: 20 },
  podiumRankBadge: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#9CA3AF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  podiumRankBadge1: { backgroundColor: '#22C55E' },
  podiumRankNum: { color: '#fff', fontWeight: '900', fontSize: 12 },
  podiumName: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  podiumName1: { fontSize: 14, fontWeight: '900' },
  podiumScore: { fontSize: 12, fontWeight: '600' },
  podiumScore1: { fontSize: 14, fontWeight: '800' },
  comboBadge: { marginTop: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  comboBadgeText: { fontSize: 11, fontWeight: '800' },

  // List items
  listItem: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 20,
    marginBottom: 8, borderRadius: 14, padding: 14, borderWidth: 1, gap: 12,
    elevation: 1, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4,
  },
  listRank: { width: 24, fontSize: 14, fontWeight: '800', textAlign: 'center' },
  listAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  listAvatarText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  listName: { fontSize: 14, fontWeight: '700' },
  listScore: { fontSize: 14, fontWeight: '800' },

  // My card (sticky)
  myCard: {
    position: 'absolute', bottom: 80, left: 20, right: 20,
    backgroundColor: '#0891B2', borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    elevation: 8, shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10,
  },
  myCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  myRank: { fontSize: 16, fontWeight: '900', color: '#fff' },
  myName: { fontSize: 14, fontWeight: '800', color: '#fff' },
  myScore: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  // Footer
  footer: {
    paddingHorizontal: 20, paddingBottom: 16, paddingTop: 8,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  continueBtn: {
    flex: 1, borderRadius: 14, paddingVertical: 15, alignItems: 'center',
    elevation: 4, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8,
  },
  continueBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  viewersText: { fontSize: 12, fontWeight: '600' },
});
