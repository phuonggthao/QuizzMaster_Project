import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../Components/AppHeader';

// Emoji game type
const GAME_EMOJI = {
  Quiz: '💻', TrueFalse: '🦆', Flashcard: '🎴',
  WordScramble: '🔤', LuckyNumber: '🎰', default: '🎮',
};

const BADGES = ['⭐', '🎯', '📍', '+'];

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalPlays: 0, totalPoints: 0 });
  const [loginStreak, setLoginStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const { isDark, theme: C, setIsAdmin } = useTheme();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token === 'GUEST') {
          setIsGuest(true);
          setUser({ fullName: 'Khách', username: 'guest', highScore: 0, level: 1, tierName: 'Đồng' });
          setLoginStreak(0);
          setLoading(false);
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Lấy thông tin user
        const meRes = await fetch(`${BASE_URL}/auth/me`, { headers });
        const meData = await meRes.json();
        if (meRes.ok) {
          setUser(meData.user);
          setLoginStreak(meData.user?.loginStreak || 0);
        } else if (meRes.status === 401) {
          // Token hết hạn → về Login
          await AsyncStorage.multiRemove(['userToken', 'userId', 'userInfo']);
          navigation.replace('Login');
          return;
        } else {
          throw new Error('Không tải được hồ sơ');
        }

        // Lấy stats thật (tổng lượt chơi, tổng điểm)
        const statsRes = await fetch(`${BASE_URL}/user/stats`, { headers });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats({ totalPlays: statsData.totalPlays || 0, totalPoints: statsData.totalPoints || 0 });
        }

        // Lấy lịch sử chơi thật
        const histRes = await fetch(`${BASE_URL}/user/history`, { headers });
        if (histRes.ok) {
          const histData = await histRes.json();
          setHistory(histData);
        }
      } catch (e) {
        Alert.alert('Lỗi mạng', 'Không thể kết nối đến máy chủ.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Đăng xuất', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          setIsAdmin(false);
          navigation.replace('Login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: C.bgApp }]}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  const displayName = user?.fullName || 'Alex';
  const avatarLetter = isGuest ? '👤' : displayName.charAt(0).toUpperCase();
  const levelProgress = Math.min(((user?.highScore || 0) % 100) / 100, 1);

  // Format ngày tháng từ ISO string
  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const formatTimeAgo = (iso) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours}h trước`;
    return `${days} ngày trước`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgCard} />
      <AppHeader navigation={navigation} activeTab="Profile" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Profile header */}
        <View style={[styles.profileHeader, { backgroundColor: C.bgCard, borderBottomColor: C.border }]}>
          <View style={styles.avatarWrap}>
            <View style={[styles.avatar, { backgroundColor: C.primaryLight, borderColor: C.primary }]}>
              <Text style={[styles.avatarText, { color: C.primary }]}>{avatarLetter}</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakBadgeText}>Lv.{user?.level || 1} {user?.tierName || 'Đồng'}</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.greeting, { color: C.textPrimary }]}>Hey, {displayName}! 👋</Text>
            <Text style={[styles.greetingDesc, { color: C.textMuted }]}>
              {isGuest
                ? 'Đăng nhập để lưu tiến trình và nhận phần thưởng!'
                : "You're on fire this week. Keep up the great work and reach your goal!"}
            </Text>
            <View style={styles.badgesRow}>
              <View style={[styles.infoBadge, { backgroundColor: C.bgApp, borderColor: C.border }]}>
                <Text style={[styles.infoBadgeText, { color: C.textSecondary }]}>🎓 {user?.tierName || 'Đồng'}</Text>
              </View>
              <View style={[styles.infoBadge, { backgroundColor: C.bgApp, borderColor: C.border }]}>
                <Text style={[styles.infoBadgeText, { color: C.textSecondary }]}>🎮 {stats.totalPlays} lượt chơi</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {/* Quizzes completed */}
          <View style={[styles.statCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={[styles.statLabel, { color: C.textMuted }]}>LƯỢT CHƠI</Text>
            <Text style={[styles.statValue, { color: C.textPrimary }]}>{stats.totalPlays}</Text>
            <View style={styles.progressSection}>
              <View style={styles.progressLabelRow}>
                <Text style={[styles.progressLabel, { color: C.textMuted }]}>Level Progress</Text>
                <Text style={[styles.progressPct, { color: C.primary }]}>{Math.round(levelProgress * 100)}%</Text>
              </View>
              <View style={[styles.progressBg, { backgroundColor: C.bgApp }]}>
                <View style={[styles.progressFill, { width: `${levelProgress * 100}%`, backgroundColor: C.primary }]} />
              </View>
            </View>
          </View>

          {/* Total score */}
          <View style={[styles.statCard, { backgroundColor: C.primary, borderColor: C.primary }]}>
            <Text style={styles.statIconWhite}>🏆</Text>
            <Text style={styles.statLabelWhite}>HIGH SCORE</Text>
            <Text style={styles.statValueLarge}>{(user?.highScore || 0).toLocaleString()}</Text>
            <Text style={styles.statNote}>Tổng điểm: {stats.totalPoints.toLocaleString()}</Text>
          </View>

          {/* Badges */}
          <View style={[styles.statCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <View style={styles.badgesHeader}>
              <Text style={styles.statIcon}>🏅</Text>
              <Text style={[styles.badgesCount, { color: C.textPrimary }]}>{Math.min(stats.totalPlays, 15)}</Text>
            </View>
            <Text style={[styles.statLabel, { color: C.textMuted }]}>BADGES EARNED</Text>
            <View style={styles.badgeGrid}>
              {BADGES.map((b, i) => (
                <View key={i} style={[styles.badgeItem, { backgroundColor: C.bgApp, borderColor: C.border }]}>
                  <Text style={styles.badgeItemText}>{b}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Streak Banner */}
        {!isGuest && (
          <View style={[styles.streakBanner, { backgroundColor: C.primary, shadowColor: C.primary }]}>
            <View style={styles.streakIconWrap}>
              <Text style={{ fontSize: 22 }}>🔥</Text>
            </View>
            <View style={styles.streakInfo}>
              <Text style={styles.streakTitle}>
                {loginStreak > 0 ? `${loginStreak} ngày liên tiếp!` : 'Bắt đầu chuỗi ngay!'}
              </Text>
              <Text style={styles.streakDesc}>
                {loginStreak > 0
                  ? `Kỷ lục: ${user?.longestStreak || loginStreak} ngày. Đăng nhập mỗi ngày để duy trì!`
                  : 'Đăng nhập mỗi ngày để nhận thưởng XP.'}
              </Text>
            </View>
            <View style={styles.streakDots}>
              {[1,2,3,4,5,6,7].map((d) => (
                <View key={d} style={[styles.streakDot, d <= loginStreak && styles.streakDotActive]} />
              ))}
            </View>
          </View>
        )}

        {/* Recent History — từ MongoDB */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <View>
              <Text style={[styles.historyTitle, { color: C.textPrimary }]}>Lịch sử chơi</Text>
              <Text style={[styles.historySubtitle, { color: C.textMuted }]}>
                {history.length > 0 ? `${history.length} lượt gần đây` : 'Chưa có lịch sử'}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Leaderboard', { score: user?.highScore || 0, total: 10 })}>
              <Text style={[styles.viewAll, { color: C.primary }]}>Bảng xếp hạng →</Text>
            </TouchableOpacity>
          </View>

          {history.length === 0 ? (
            <View style={[styles.emptyHistory, { backgroundColor: C.bgCard, borderColor: C.border }]}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>🎮</Text>
              <Text style={[{ color: C.textMuted, fontSize: 13, textAlign: 'center' }]}>
                Bạn chưa chơi lượt nào. Hãy bắt đầu ngay!
              </Text>
            </View>
          ) : (
            history.map((item, index) => (
              <View key={item._id || index} style={[styles.historyItem, { backgroundColor: C.bgCard, borderColor: C.border }]}>
                <View style={[styles.historyThumb, { backgroundColor: '#1E1B4B' }]}>
                  <Text style={{ fontSize: 24 }}>{GAME_EMOJI[item.gameType] || GAME_EMOJI.default}</Text>
                </View>
                <View style={styles.historyInfo}>
                  <Text style={[styles.historyItemTitle, { color: C.textPrimary }]}>{item.gameType} Quiz</Text>
                  <Text style={[styles.historyMeta, { color: C.textMuted }]}>
                    {formatTimeAgo(item.playedAt)}
                    {item.accuracy ? `  •  ${item.accuracy}% Accuracy` : ''}
                  </Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={[styles.scoreLabel, { color: C.textMuted }]}>Score</Text>
                  <Text style={[styles.scoreValue, { color: C.textPrimary }]}>{item.points || 0}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.replayBtn, { borderColor: C.primary }]}
                  onPress={() => navigation.navigate('Quiz', { gameType: item.gameType || 'Quiz' })}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.replayBtnText, { color: C.primary }]}>↺ Replay</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Logout / Login */}
        <View style={styles.actionSection}>
          {isGuest ? (
            <TouchableOpacity style={[styles.loginBtn, { backgroundColor: C.primary, shadowColor: C.primary }]} onPress={() => navigation.replace('Login')} activeOpacity={0.88}>
              <Text style={styles.loginBtnText}>🔑 Đăng nhập để lưu tiến trình</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.logoutBtn, { borderColor: C.wrong, backgroundColor: isDark ? '#450A0A' : '#FEE2E2' }]}
              onPress={handleLogout}
              activeOpacity={0.85}
            >
              <Text style={[styles.logoutBtnText, { color: C.wrong }]}>Đăng Xuất</Text>
            </TouchableOpacity>
          )}
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 40 },

  profileHeader: { flexDirection: 'row', padding: 20, gap: 16, borderBottomWidth: 1 },
  avatarWrap: { alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 3, marginBottom: 6 },
  avatarText: { fontSize: 32, fontWeight: '900' },
  streakBadge: { backgroundColor: '#1E3A5F', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  streakBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  profileInfo: { flex: 1 },
  greeting: { fontSize: 18, fontWeight: '900', marginBottom: 6 },
  greetingDesc: { fontSize: 12, lineHeight: 17, marginBottom: 12 },
  badgesRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  infoBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  infoBadgeText: { fontSize: 11, fontWeight: '600' },

  statsRow: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 20, gap: 10, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 16, padding: 14, borderWidth: 1, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
  statIcon: { fontSize: 20, marginBottom: 6 },
  statIconWhite: { fontSize: 20, marginBottom: 6 },
  statLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 },
  statLabelWhite: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.75)', letterSpacing: 0.5, marginBottom: 6 },
  statValue: { fontSize: 28, fontWeight: '900' },
  statValueLarge: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
  statNote: { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  progressSection: { marginTop: 8 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 10 },
  progressPct: { fontSize: 10, fontWeight: '700' },
  progressBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },

  badgesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  badgesCount: { fontSize: 22, fontWeight: '900' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  badgeItem: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  badgeItemText: { fontSize: 14 },

  historySection: { paddingHorizontal: 20, marginBottom: 20 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  historyTitle: { fontSize: 17, fontWeight: '900' },
  historySubtitle: { fontSize: 12, marginTop: 2 },
  viewAll: { fontSize: 13, fontWeight: '700' },

  emptyHistory: { borderRadius: 14, padding: 24, alignItems: 'center', borderWidth: 1 },

  historyItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, gap: 12, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  historyThumb: { width: 52, height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  historyInfo: { flex: 1 },
  historyItemTitle: { fontSize: 13, fontWeight: '700', marginBottom: 3 },
  historyMeta: { fontSize: 11 },
  historyRight: { alignItems: 'flex-end', marginRight: 4 },
  scoreLabel: { fontSize: 10, fontWeight: '600' },
  scoreValue: { fontSize: 18, fontWeight: '900' },
  replayBtn: { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  replayBtnText: { fontSize: 12, fontWeight: '700' },

  actionSection: { paddingHorizontal: 20, marginBottom: 24 },
  streakBanner: {
    marginHorizontal: 20, marginBottom: 20,
    borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  streakIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  streakInfo: { flex: 1 },
  streakTitle: { fontSize: 15, fontWeight: '900', color: '#fff', marginBottom: 3 },
  streakDesc: { fontSize: 11, color: 'rgba(255,255,255,0.8)', lineHeight: 15 },
  streakDots: { flexDirection: 'row', gap: 4 },
  streakDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  streakDotActive: { backgroundColor: '#fff' },
  loginBtn: { borderRadius: 14, paddingVertical: 15, alignItems: 'center', elevation: 4, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  loginBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  logoutBtn: { borderRadius: 14, paddingVertical: 15, alignItems: 'center', borderWidth: 1.5 },
  logoutBtnText: { fontWeight: '800', fontSize: 15 },

  footer: { paddingHorizontal: 20, paddingTop: 20, borderTopWidth: 1, alignItems: 'center', gap: 6 },
  footerLogo: { fontSize: 15, fontWeight: '900' },
  footerLinks: { flexDirection: 'row', gap: 16 },
  footerLink: { fontSize: 11, fontWeight: '600' },
  footerCopy: { fontSize: 11 },
});
