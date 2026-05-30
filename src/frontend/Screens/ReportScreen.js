import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../Components/AppHeader';
import BASE_URL from '../config';

// Donut chart dùng View thuần — không cần thư viện ngoài
function DonutChart({ percent }) {
  const { theme: C } = useTheme();
  const size = 160;
  const thickness = 22;
  const inner = size - thickness * 2;

  return (
    <View style={donutStyles.wrapper}>
      <View style={[donutStyles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: C.border }]} />
      <View style={[donutStyles.ring, {
        width: size, height: size, borderRadius: size / 2,
        borderColor: C.correct,
        borderTopColor: C.correct,
        borderRightColor: C.correct,
        borderBottomColor: percent > 50 ? C.correct : C.border,
        borderLeftColor: C.border,
        transform: [{ rotate: '-45deg' }],
        position: 'absolute',
      }]} />
      <View style={[donutStyles.inner, { width: inner, height: inner, borderRadius: inner / 2, backgroundColor: C.bgCard }]}>
        <Text style={[donutStyles.percent, { color: C.textPrimary }]}>{percent}%</Text>
        <Text style={[donutStyles.label, { color: C.textMuted }]}>Trung bình</Text>
      </View>
    </View>
  );
}

const donutStyles = StyleSheet.create({
  wrapper: { width: 160, height: 160, justifyContent: 'center', alignItems: 'center' },
  ring: { position: 'absolute', borderWidth: 22 },
  inner: { justifyContent: 'center', alignItems: 'center' },
  percent: { fontSize: 28, fontWeight: '900' },
  label: { fontSize: 10, fontWeight: '600', textAlign: 'center', marginTop: 2 },
});

const GAME_EMOJI = {
  Quiz: '💻', TrueFalse: '🦆', Flashcard: '🎴', WordScramble: '🔤',
  LuckyNumber: '🎰', PictureQuiz: '🖼️', default: '🎮',
};

export default function ReportScreen({ navigation }) {
  const { isDark, theme: C } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token || token === 'GUEST') {
          setLoading(false);
          return;
        }

        // Kiểm tra admin
        const meRes = await fetch(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user?.role === 'Admin') {
            setIsAdmin(true);
            const statsRes = await fetch(`${BASE_URL}/report/stats`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (statsRes.ok) {
              const data = await statsRes.json();
              setStats(data);
            }
          }
        }
      } catch (e) {
        console.warn('Report fetch error:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatTimeAgo = (iso) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours}h trước`;
    return `${days} ngày trước`;
  };

  // Tính % score trung bình so với max
  const avgPercent = stats ? Math.min(Math.round((stats.avgScore / 100) * 100), 100) : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgCard} />
      <AppHeader navigation={navigation} activeTab="Report" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page title */}
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderLeft}>
            <Text style={[styles.pageTitle, { color: C.textPrimary }]}>Báo cáo & Đánh giá</Text>
            <Text style={[styles.pageSubtitle, { color: C.textMuted }]}>
              {isAdmin ? 'Thống kê thật từ MongoDB' : 'Tổng quan hiệu suất hệ thống'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.searchBtn, { backgroundColor: C.bgCard, borderColor: C.border }]}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Thông báo', 'Tính năng tìm kiếm đang phát triển')}
          >
            <Text style={styles.searchBtnText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ paddingVertical: 60, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={C.primary} />
            <Text style={[{ color: C.textMuted, marginTop: 12, fontSize: 13 }]}>Đang tải dữ liệu từ MongoDB...</Text>
          </View>
        ) : !isAdmin ? (
          // Không phải admin
          <View style={[styles.noAdminBox, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🔐</Text>
            <Text style={[styles.noAdminTitle, { color: C.textPrimary }]}>Cần quyền Admin</Text>
            <Text style={[styles.noAdminDesc, { color: C.textMuted }]}>
              Báo cáo thống kê chỉ dành cho tài khoản Admin. Hãy liên hệ quản trị viên để được cấp quyền.
            </Text>
          </View>
        ) : (
          <>
            {/* Donut chart */}
            <View style={[styles.donutCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
              <Text style={[styles.donutCardTitle, { color: C.textPrimary }]}>Điểm trung bình lượt chơi</Text>
              <View style={donutRowStyle.donutRow}>
                <DonutChart percent={avgPercent} />
                <View style={donutRowStyle.donutLegend}>
                  <View style={donutRowStyle.legendItem}>
                    <View style={[donutRowStyle.legendDot, { backgroundColor: C.correct }]} />
                    <Text style={[donutRowStyle.legendText, { color: C.textPrimary }]}>
                      Avg — {stats?.avgScore || 0} đ
                    </Text>
                  </View>
                  <View style={donutRowStyle.legendItem}>
                    <View style={[donutRowStyle.legendDot, { backgroundColor: C.primary }]} />
                    <Text style={[donutRowStyle.legendText, { color: C.textPrimary }]}>
                      Total — {stats?.totalPlays || 0} lượt
                    </Text>
                  </View>
                  <Text style={[donutRowStyle.donutNote, { color: C.textMuted }]}>
                    Dựa trên {stats?.totalPlays || 0} lượt chơi thật từ database
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats cards */}
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: C.primary }]}>
                <View style={styles.statCardTop}>
                  <View>
                    <Text style={styles.statCardLabel}>Tổng lượt chơi</Text>
                    <Text style={styles.statCardValue}>{stats?.totalPlays || 0}</Text>
                  </View>
                  <Text style={styles.statCardIcon}>🎮</Text>
                </View>
                <Text style={styles.statCardNote}>Tất cả game types</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#0891B2' }]}>
                <View style={styles.statCardTop}>
                  <View>
                    <Text style={styles.statCardLabel}>Người dùng</Text>
                    <Text style={styles.statCardValue}>{stats?.totalUsers || 0}</Text>
                  </View>
                  <Text style={styles.statCardIcon}>🎓</Text>
                </View>
                <Text style={styles.statCardNote}>Đã đăng ký hệ thống</Text>
              </View>
            </View>

            {/* Recent plays section */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Lượt chơi gần đây</Text>
              <TouchableOpacity
                style={[styles.exportBtn, { backgroundColor: C.primaryLight }]}
                activeOpacity={0.8}
                onPress={() => Alert.alert('Thông báo', 'Tính năng xuất file đang phát triển')}
              >
                <Text style={[styles.exportBtnText, { color: C.primary }]}>⬇ Xuất Excel</Text>
              </TouchableOpacity>
            </View>

            {(!stats?.recentPlays || stats.recentPlays.length === 0) ? (
              <View style={[styles.emptyBox, { backgroundColor: C.bgCard, borderColor: C.border }]}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>📭</Text>
                <Text style={[{ color: C.textMuted, fontSize: 13, textAlign: 'center' }]}>
                  Chưa có lượt chơi nào được ghi nhận trong database
                </Text>
              </View>
            ) : (
              stats.recentPlays.map((play, idx) => (
                <View key={play._id || idx} style={[styles.testItem, { backgroundColor: C.bgCard, borderColor: C.border }]}>
                  <View style={styles.testInfo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <Text style={{ fontSize: 20 }}>{GAME_EMOJI[play.gameType] || GAME_EMOJI.default}</Text>
                      <Text style={[styles.testTitle, { color: C.textPrimary }]}>
                        {play.gameType} Quiz
                      </Text>
                    </View>
                    <Text style={[styles.testMeta, { color: C.textMuted }]}>
                      👤 {play.userId?.fullName || play.userId?.username || 'Ẩn danh'}
                      {'  '}🕐 {formatTimeAgo(play.playedAt)}
                    </Text>
                    <View style={styles.progressRow}>
                      <View style={[styles.progressBg, { backgroundColor: C.bgApp }]}>
                        <View style={[styles.progressFill, {
                          width: `${Math.min((play.points / 100) * 100, 100)}%`,
                          backgroundColor: C.primary
                        }]} />
                      </View>
                      <Text style={[styles.progressLabel, { color: C.textMuted }]}>
                        {play.points || 0} điểm
                      </Text>
                    </View>
                  </View>
                  <View style={styles.testActions}>
                    <View style={[styles.scoreChip, { backgroundColor: C.primaryLight }]}>
                      <Text style={[styles.scoreChipText, { color: C.primary }]}>{play.points || 0} đ</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const donutRowStyle = StyleSheet.create({
  donutRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  donutLegend: { flex: 1, gap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 13, fontWeight: '600' },
  donutNote: { fontSize: 11, marginTop: 4, lineHeight: 15 },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14 },
  pageHeaderLeft: {},
  pageTitle: { fontSize: 20, fontWeight: '900' },
  pageSubtitle: { fontSize: 12, marginTop: 2 },
  searchBtn: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  searchBtnText: { fontSize: 16 },

  noAdminBox: { borderRadius: 20, marginHorizontal: 20, padding: 40, alignItems: 'center', borderWidth: 1 },
  noAdminTitle: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
  noAdminDesc: { fontSize: 13, textAlign: 'center', lineHeight: 19 },

  donutCard: { marginHorizontal: 20, marginBottom: 16, borderRadius: 20, padding: 20, borderWidth: 1, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
  donutCardTitle: { fontSize: 15, fontWeight: '800', marginBottom: 16 },

  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 18, padding: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 8 },
  statCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  statCardLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: 4 },
  statCardValue: { fontSize: 32, fontWeight: '900', color: '#fff' },
  statCardIcon: { fontSize: 24 },
  statCardNote: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14, flexWrap: 'wrap', gap: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '800' },
  exportBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  exportBtnText: { fontSize: 12, fontWeight: '700' },

  emptyBox: { borderRadius: 14, marginHorizontal: 20, padding: 32, alignItems: 'center', borderWidth: 1 },

  testItem: { borderRadius: 16, marginHorizontal: 20, marginBottom: 12, padding: 16, borderWidth: 1, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 12 },
  testInfo: { flex: 1 },
  testTitle: { fontSize: 15, fontWeight: '700' },
  testMeta: { fontSize: 12, marginBottom: 10 },
  progressRow: { gap: 6 },
  progressBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  progressLabel: { fontSize: 11, fontWeight: '600' },
  testActions: { alignItems: 'center' },
  scoreChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  scoreChipText: { fontSize: 13, fontWeight: '800' },
});
