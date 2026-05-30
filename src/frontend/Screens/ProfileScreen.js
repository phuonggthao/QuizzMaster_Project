import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import { Colors } from '../Styles/Colors';
import AppHeader from '../Components/AppHeader';

const HISTORY = [
  { id: '1', emoji: '🧬', bg: '#1E1B4B', title: 'Molecular Biology Fundamentals', time: 'Completed 2h ago', accuracy: '92% Accuracy', score: 850 },
  { id: '2', emoji: '💻', bg: '#0C4A6E', title: 'Advanced JavaScript Patterns', time: 'Completed Yesterday', accuracy: '76% Accuracy', score: 620 },
  { id: '3', emoji: '🏛️', bg: '#78350F', title: 'Ancient Civilizations: Rome & Greece', time: 'Completed 3 days ago', accuracy: '100% Accuracy', score: 1000 },
];

const BADGES = ['⭐', '🎯', '📍', '+'];

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token === 'GUEST') {
          setIsGuest(true);
          setUser({ fullName: 'Khách', username: 'guest', highScore: 0, level: 1, tierName: 'Đồng' });
          setLoading(false);
          return;
        }
        const response = await fetch(`${BASE_URL}/auth/me`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setUser(data.user);
        else Alert.alert('Lỗi', 'Không thể tải thông tin hồ sơ.');
      } catch {
        Alert.alert('Lỗi mạng', 'Không thể kết nối đến máy chủ.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Đăng xuất', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.replace('Login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const displayName = user?.fullName || 'Alex';
  const avatarLetter = isGuest ? '👤' : displayName.charAt(0).toUpperCase();
  const levelProgress = Math.min(((user?.highScore || 0) % 100) / 100, 1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgCard} />
      <AppHeader navigation={navigation} activeTab="Profile" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakBadgeText}>⚡ 7 DAY STREAK</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Hey, {displayName}! 👋</Text>
            <Text style={styles.greetingDesc}>
              {isGuest
                ? 'Đăng nhập để lưu tiến trình và nhận phần thưởng!'
                : "You're on fire this week. Keep up the great work and reach your goal of 50 quizzes!"}
            </Text>
            <View style={styles.badgesRow}>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>🎓 Silver Scholar</Text>
              </View>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>📍 Global Rank #1,204</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {/* Quizzes completed */}
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statLabel}>QUIZZES COMPLETED</Text>
            <Text style={styles.statValue}>{user?.highScore ? Math.floor(user.highScore / 10) : 42}</Text>
            <View style={styles.progressSection}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabel}>Level Progress</Text>
                <Text style={styles.progressPct}>{Math.round(levelProgress * 100)}%</Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${levelProgress * 100}%` }]} />
              </View>
            </View>
          </View>

          {/* Total score */}
          <View style={[styles.statCard, styles.statCardPurple]}>
            <Text style={styles.statIconWhite}>🏆</Text>
            <Text style={styles.statLabelWhite}>TOTAL SCORE</Text>
            <Text style={styles.statValueLarge}>{(user?.highScore || 12850).toLocaleString()}</Text>
            <Text style={styles.statNote}>↗ Top 5% of all students</Text>
          </View>

          {/* Badges */}
          <View style={styles.statCard}>
            <View style={styles.badgesHeader}>
              <Text style={styles.statIcon}>🏅</Text>
              <Text style={styles.badgesCount}>15</Text>
            </View>
            <Text style={styles.statLabel}>BADGES EARNED</Text>
            <View style={styles.badgeGrid}>
              {BADGES.map((b, i) => (
                <View key={i} style={styles.badgeItem}>
                  <Text style={styles.badgeItemText}>{b}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Recent History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <View>
              <Text style={styles.historyTitle}>Recent History</Text>
              <Text style={styles.historySubtitle}>Review and master your recent topics</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Leaderboard', { score: 0, total: 10 })}>
              <Text style={styles.viewAll}>View All Activity →</Text>
            </TouchableOpacity>
          </View>

          {HISTORY.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={[styles.historyThumb, { backgroundColor: item.bg }]}>
                <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyItemTitle}>{item.title}</Text>
                <Text style={styles.historyMeta}>{item.time}  •  {item.accuracy}</Text>
              </View>
              <View style={styles.historyRight}>
                <Text style={styles.scoreLabel}>Score</Text>
                <Text style={styles.scoreValue}>{item.score}</Text>
              </View>
              <TouchableOpacity
                style={styles.replayBtn}
                onPress={() => navigation.navigate('Quiz', { gameType: 'Quiz' })}
                activeOpacity={0.85}
              >
                <Text style={styles.replayBtnText}>↺ Replay</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Logout / Login */}
        <View style={styles.actionSection}>
          {isGuest ? (
            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.replace('Login')} activeOpacity={0.88}>
              <Text style={styles.loginBtnText}>🔑 Đăng nhập để lưu tiến trình</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
              <Text style={styles.logoutBtnText}>Đăng Xuất</Text>
            </TouchableOpacity>
          )}
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
  center: { flex: 1, backgroundColor: Colors.bgApp, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 40 },

  // Profile header
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
    backgroundColor: Colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarWrap: { alignItems: 'center' },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: Colors.primary,
    marginBottom: 6,
  },
  avatarText: { fontSize: 32, fontWeight: '900', color: Colors.primary },
  streakBadge: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  streakBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  profileInfo: { flex: 1 },
  greeting: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary, marginBottom: 6 },
  greetingDesc: { fontSize: 12, color: Colors.textMuted, lineHeight: 17, marginBottom: 12 },
  badgesRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  infoBadge: {
    backgroundColor: Colors.bgApp,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoBadgeText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
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
  statCardPurple: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statIcon: { fontSize: 20, marginBottom: 6 },
  statIconWhite: { fontSize: 20, marginBottom: 6 },
  statLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.5, marginBottom: 6 },
  statLabelWhite: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.75)', letterSpacing: 0.5, marginBottom: 6 },
  statValue: { fontSize: 28, fontWeight: '900', color: Colors.textPrimary },
  statValueLarge: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 6 },
  statNote: { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  progressSection: { marginTop: 8 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 10, color: Colors.textMuted },
  progressPct: { fontSize: 10, color: Colors.primary, fontWeight: '700' },
  progressBg: { height: 6, backgroundColor: Colors.bgApp, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },

  badgesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  badgesCount: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  badgeItem: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.bgApp,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  badgeItemText: { fontSize: 14 },

  // History
  historySection: { paddingHorizontal: 20, marginBottom: 20 },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  historyTitle: { fontSize: 17, fontWeight: '900', color: Colors.textPrimary },
  historySubtitle: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  viewAll: { fontSize: 13, color: Colors.primary, fontWeight: '700' },

  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  historyThumb: {
    width: 52, height: 52, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  historyInfo: { flex: 1 },
  historyItemTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  historyMeta: { fontSize: 11, color: Colors.textMuted },
  historyRight: { alignItems: 'flex-end', marginRight: 4 },
  scoreLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
  scoreValue: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary },
  replayBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  replayBtnText: { fontSize: 12, fontWeight: '700', color: Colors.primary },

  // Action
  actionSection: { paddingHorizontal: 20, marginBottom: 24 },
  loginBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.wrong,
  },
  logoutBtnText: { color: Colors.wrong, fontWeight: '800', fontSize: 15 },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
    gap: 6,
  },
  footerLogo: { fontSize: 15, fontWeight: '900', color: Colors.primary },
  footerLinks: { flexDirection: 'row', gap: 16 },
  footerLink: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  footerCopy: { fontSize: 11, color: Colors.textMuted },
});
