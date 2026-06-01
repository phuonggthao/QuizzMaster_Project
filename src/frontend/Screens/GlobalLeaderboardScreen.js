// GlobalLeaderboardScreen.js — Bảng xếp hạng toàn hệ thống (truy cập từ nav)
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView,
  ActivityIndicator, RefreshControl, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../Components/AppHeader';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#7C3AED', '#059669', '#0891B2', '#D97706',
  '#DC2626', '#4C1D95', '#DB2777', '#0284C7',
  '#065F46', '#92400E',
];

const TIER_CONFIG = {
  'Kim Cương': { emoji: '💎', color: '#0891B2', bg: '#E0F2FE' },
  'Vàng':      { emoji: '🥇', color: '#D97706', bg: '#FEF3C7' },
  'Bạc':       { emoji: '🥈', color: '#6B7280', bg: '#F3F4F6' },
  'Đồng':      { emoji: '🥉', color: '#92400E', bg: '#FEF3C7' },
};

const RANK_MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

function getAvatarColor(i) {
  return AVATAR_COLORS[i % AVATAR_COLORS.length];
}

function getInitials(name = '') {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || '??';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GlobalLeaderboardScreen({ navigation }) {
  const { isDark, theme: C } = useTheme();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [myInfo, setMyInfo]           = useState(null);
  const [myRank, setMyRank]           = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [countdown, setCountdown]     = useState(30); // đếm ngược đến lần refresh tiếp

  const POLL_INTERVAL = 30; // giây
  const pollRef      = useRef(null);
  const countdownRef = useRef(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      // Lấy bảng xếp hạng
      const res = await fetch(`${BASE_URL}/game/leaderboard`);
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setLeaderboard(data);
        setLastUpdated(new Date());

        // Tìm rank của user hiện tại
        const token = await AsyncStorage.getItem('userToken');
        if (token && token !== 'GUEST') {
          const meRes = await fetch(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            const me = meData.user;
            setMyInfo(me);
            const idx = data.findIndex(
              u => u.username === me.username
            );
            setMyRank(idx >= 0 ? idx + 1 : null);
          }
        }
      }
    } catch (e) {
      console.warn('GlobalLeaderboard fetch error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ── Auto-refresh polling ───────────────────────────────────────────────────
  const startPolling = useCallback(() => {
    // Xóa timer cũ nếu có
    if (pollRef.current) clearInterval(pollRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    // Reset đếm ngược
    setCountdown(POLL_INTERVAL);

    // Đếm ngược mỗi giây
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) return POLL_INTERVAL; // reset sau khi fetch
        return prev - 1;
      });
    }, 1000);

    // Fetch mỗi POLL_INTERVAL giây
    pollRef.current = setInterval(() => {
      fetchData(true);
      setCountdown(POLL_INTERVAL);
    }, POLL_INTERVAL * 1000);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    startPolling();
    return () => {
      // Dọn dẹp khi rời trang
      if (pollRef.current) clearInterval(pollRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const onRefresh = () => {
    fetchData(true);
    startPolling(); // reset lại countdown sau khi refresh thủ công
  };

  // ── Render helpers ─────────────────────────────────────────────────────────

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const top3 = leaderboard.slice(0, 3);
  const rest  = leaderboard.slice(3);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgCard} />
        <AppHeader navigation={navigation} activeTab="Leaderboard" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={C.primary} />
          <Text style={[styles.loadingText, { color: C.textMuted }]}>Đang tải bảng xếp hạng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (leaderboard.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgCard} />
        <AppHeader navigation={navigation} activeTab="Leaderboard" />
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>🏆</Text>
          <Text style={[styles.emptyTitle, { color: C.textPrimary }]}>Chưa có ai lên bảng</Text>
          <Text style={[styles.emptyDesc, { color: C.textMuted }]}>
            Hãy chơi quiz và ghi điểm để xuất hiện ở đây!
          </Text>
          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: C.primary }]}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}
          >
            <Text style={styles.playBtnText}>▶ Chơi ngay</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgCard} />
      <AppHeader navigation={navigation} activeTab="Leaderboard" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[C.primary]}
            tintColor={C.primary}
          />
        }
      >
        {/* ── Page title ── */}
        <View style={[styles.pageHeader, { backgroundColor: C.primary }]}>
          <Text style={styles.pageTitle}>🏆 Bảng Xếp Hạng</Text>
          <Text style={styles.pageSubtitle}>
            {leaderboard.length} người chơi · Cập nhật {formatTime(lastUpdated)}
          </Text>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE · Tự cập nhật sau {countdown}s</Text>
          </View>
        </View>

        {/* ── Podium Top 3 ── */}
        {top3.length > 0 && (
          <View style={styles.podiumWrapper}>
            <View style={styles.podium}>

              {/* Rank 2 — trái */}
              {top3[1] ? (
                <View style={styles.podiumSideCol}>
                  <View style={[styles.podiumCard, styles.podiumCardSide, { backgroundColor: C.bgCard, borderColor: C.border }]}>
                    <Text style={styles.podiumMedal}>{RANK_MEDAL[2]}</Text>
                    <View style={[styles.podiumAvatar, styles.podiumAvatarSm, { backgroundColor: getAvatarColor(1) }]}>
                      <Text style={styles.podiumAvatarTextSm}>
                        {getInitials(top3[1].fullName || top3[1].username)}
                      </Text>
                    </View>
                    <Text style={[styles.podiumName, { color: C.textPrimary }]} numberOfLines={1}>
                      {top3[1].fullName || top3[1].username}
                    </Text>
                    <Text style={[styles.podiumScore, { color: C.textMuted }]}>
                      {(top3[1].highScore || 0).toLocaleString()} đ
                    </Text>
                    {top3[1].tierName && (
                      <View style={[styles.tierBadge, { backgroundColor: TIER_CONFIG[top3[1].tierName]?.bg || '#F3F4F6' }]}>
                        <Text style={[styles.tierText, { color: TIER_CONFIG[top3[1].tierName]?.color || '#6B7280' }]}>
                          {TIER_CONFIG[top3[1].tierName]?.emoji} {top3[1].tierName}
                        </Text>
                      </View>
                    )}
                    <View style={[styles.podiumBase, styles.podiumBase2, { backgroundColor: '#C0C0C0' }]}>
                      <Text style={styles.podiumBaseText}>2</Text>
                    </View>
                  </View>
                </View>
              ) : <View style={styles.podiumSideCol} />}

              {/* Rank 1 — giữa */}
              {top3[0] && (
                <View style={styles.podiumCenterCol}>
                  <View style={[styles.podiumCard, styles.podiumCardCenter, { backgroundColor: C.bgCard, borderColor: C.primary }]}>
                    <Text style={styles.crownEmoji}>👑</Text>
                    <View style={[styles.podiumAvatar, styles.podiumAvatarLg, { backgroundColor: getAvatarColor(0) }]}>
                      <Text style={styles.podiumAvatarTextLg}>
                        {getInitials(top3[0].fullName || top3[0].username)}
                      </Text>
                    </View>
                    <Text style={[styles.podiumNameCenter, { color: C.textPrimary }]} numberOfLines={1}>
                      {top3[0].fullName || top3[0].username}
                    </Text>
                    <Text style={[styles.podiumScoreCenter, { color: C.primary }]}>
                      {(top3[0].highScore || 0).toLocaleString()} đ
                    </Text>
                    {top3[0].tierName && (
                      <View style={[styles.tierBadge, { backgroundColor: TIER_CONFIG[top3[0].tierName]?.bg || '#F3F4F6' }]}>
                        <Text style={[styles.tierText, { color: TIER_CONFIG[top3[0].tierName]?.color || '#6B7280' }]}>
                          {TIER_CONFIG[top3[0].tierName]?.emoji} {top3[0].tierName}
                        </Text>
                      </View>
                    )}
                    <Text style={[styles.levelText, { color: C.textMuted }]}>Lv.{top3[0].level || 1}</Text>
                    <View style={[styles.podiumBase, styles.podiumBase1, { backgroundColor: C.primary }]}>
                      <Text style={styles.podiumBaseText}>1</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Rank 3 — phải */}
              {top3[2] ? (
                <View style={styles.podiumSideCol}>
                  <View style={[styles.podiumCard, styles.podiumCardSide, { backgroundColor: C.bgCard, borderColor: C.border }]}>
                    <Text style={styles.podiumMedal}>{RANK_MEDAL[3]}</Text>
                    <View style={[styles.podiumAvatar, styles.podiumAvatarSm, { backgroundColor: getAvatarColor(2) }]}>
                      <Text style={styles.podiumAvatarTextSm}>
                        {getInitials(top3[2].fullName || top3[2].username)}
                      </Text>
                    </View>
                    <Text style={[styles.podiumName, { color: C.textPrimary }]} numberOfLines={1}>
                      {top3[2].fullName || top3[2].username}
                    </Text>
                    <Text style={[styles.podiumScore, { color: C.textMuted }]}>
                      {(top3[2].highScore || 0).toLocaleString()} đ
                    </Text>
                    {top3[2].tierName && (
                      <View style={[styles.tierBadge, { backgroundColor: TIER_CONFIG[top3[2].tierName]?.bg || '#F3F4F6' }]}>
                        <Text style={[styles.tierText, { color: TIER_CONFIG[top3[2].tierName]?.color || '#6B7280' }]}>
                          {TIER_CONFIG[top3[2].tierName]?.emoji} {top3[2].tierName}
                        </Text>
                      </View>
                    )}
                    <View style={[styles.podiumBase, styles.podiumBase3, { backgroundColor: '#CD7F32' }]}>
                      <Text style={styles.podiumBaseText}>3</Text>
                    </View>
                  </View>
                </View>
              ) : <View style={styles.podiumSideCol} />}

            </View>
          </View>
        )}

        {/* ── Danh sách từ hạng 4 ── */}
        {rest.length > 0 && (
          <View style={styles.listSection}>
            <Text style={[styles.listSectionTitle, { color: C.textMuted }]}>Các hạng tiếp theo</Text>
            {rest.map((item, idx) => {
              const rank = idx + 4;
              const isMe = myInfo && item.username === myInfo.username;
              const tier = TIER_CONFIG[item.tierName];
              return (
                <View
                  key={item.username || idx}
                  style={[
                    styles.listItem,
                    {
                      backgroundColor: isMe ? C.primaryLight : C.bgCard,
                      borderColor: isMe ? C.primary : C.border,
                      borderWidth: isMe ? 2 : 1,
                    },
                  ]}
                >
                  {/* Rank number */}
                  <View style={[styles.rankCircle, { backgroundColor: C.bgApp }]}>
                    <Text style={[styles.rankNum, { color: C.textMuted }]}>{rank}</Text>
                  </View>

                  {/* Avatar */}
                  <View style={[styles.listAvatar, { backgroundColor: getAvatarColor(idx + 3) }]}>
                    <Text style={styles.listAvatarText}>
                      {getInitials(item.fullName || item.username)}
                    </Text>
                  </View>

                  {/* Info */}
                  <View style={styles.listInfo}>
                    <View style={styles.listNameRow}>
                      <Text style={[styles.listName, { color: C.textPrimary }]} numberOfLines={1}>
                        {item.fullName || item.username}
                      </Text>
                      {isMe && (
                        <View style={[styles.meBadge, { backgroundColor: C.primary }]}>
                          <Text style={styles.meBadgeText}>Bạn</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.listMeta}>
                      <Text style={[styles.listLevel, { color: C.textMuted }]}>Lv.{item.level || 1}</Text>
                      {tier && (
                        <View style={[styles.tierBadgeSmall, { backgroundColor: tier.bg }]}>
                          <Text style={[styles.tierTextSmall, { color: tier.color }]}>
                            {tier.emoji} {item.tierName}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Score */}
                  <Text style={[styles.listScore, { color: C.primary }]}>
                    {(item.highScore || 0).toLocaleString()} đ
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Sticky card "Vị trí của bạn" ── */}
      {myInfo && myRank && (
        <View style={[styles.myCard, { backgroundColor: C.primary }]}>
          <View style={styles.myCardLeft}>
            <Text style={styles.myRankText}>#{myRank}</Text>
            <View style={[styles.myAvatar, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
              <Text style={styles.myAvatarText}>
                {getInitials(myInfo.fullName || myInfo.username)}
              </Text>
            </View>
            <View>
              <Text style={styles.myName}>{myInfo.fullName || myInfo.username}</Text>
              <Text style={styles.myScore}>{(myInfo.highScore || 0).toLocaleString()} điểm</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.myPlayBtn}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}
          >
            <Text style={styles.myPlayBtnText}>▶ Chơi</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  loadingText: { marginTop: 12, fontSize: 14 },
  scrollContent: { paddingBottom: 100 },

  // Empty state
  emptyEmoji:  { fontSize: 56, marginBottom: 16 },
  emptyTitle:  { fontSize: 20, fontWeight: '900', marginBottom: 8 },
  emptyDesc:   { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  playBtn: {
    paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: 14, elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6,
  },
  playBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  // Page header banner
  pageHeader: {
    paddingTop: 24, paddingBottom: 28,
    paddingHorizontal: 20, alignItems: 'center',
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  pageTitle:    { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 6 },
  pageSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 8 },
  pageHint:     { fontSize: 11, color: 'rgba(255,255,255,0.6)' },

  // Live indicator
  liveRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  liveDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#4ADE80', // xanh lá sáng
    // Không có animation pulse trên RN web, dùng màu nổi bật thay thế
  },
  liveText: {
    fontSize: 12, fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.3,
  },

  // Podium
  podiumWrapper: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
  },
  podiumCenterCol: { flex: 1.15, alignItems: 'center' },
  podiumSideCol:   { flex: 1, alignItems: 'center' },

  podiumCard: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    paddingTop: 16,
    paddingHorizontal: 8,
    paddingBottom: 0,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 8,
  },
  podiumCardCenter: { borderWidth: 2 },
  podiumCardSide:   {},

  crownEmoji: { fontSize: 28, marginBottom: 4 },
  podiumMedal: { fontSize: 22, marginBottom: 4 },

  podiumAvatar: {
    borderRadius: 999,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
  },
  podiumAvatarLg: { width: 72, height: 72 },
  podiumAvatarSm: { width: 54, height: 54 },
  podiumAvatarTextLg: { color: '#fff', fontWeight: '900', fontSize: 22 },
  podiumAvatarTextSm: { color: '#fff', fontWeight: '800', fontSize: 16 },

  podiumNameCenter: { fontSize: 14, fontWeight: '900', textAlign: 'center', marginBottom: 4 },
  podiumName:       { fontSize: 12, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  podiumScoreCenter:{ fontSize: 16, fontWeight: '900', marginBottom: 6 },
  podiumScore:      { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  levelText:        { fontSize: 11, fontWeight: '600', marginBottom: 8 },

  tierBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 8, marginBottom: 10,
  },
  tierText: { fontSize: 11, fontWeight: '800' },

  podiumBase: {
    width: '100%', paddingVertical: 8,
    alignItems: 'center', marginTop: 4,
  },
  podiumBase1: {},
  podiumBase2: {},
  podiumBase3: {},
  podiumBaseText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  // List section
  listSection: { paddingHorizontal: 16, paddingTop: 20 },
  listSectionTitle: {
    fontSize: 12, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: 12, paddingHorizontal: 4,
  },
  listItem: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, padding: 14,
    marginBottom: 8, gap: 12,
    elevation: 1, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4,
  },
  rankCircle: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  rankNum: { fontSize: 13, fontWeight: '800' },

  listAvatar: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  listAvatarText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  listInfo: { flex: 1 },
  listNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  listName: { fontSize: 14, fontWeight: '700', flexShrink: 1 },
  meBadge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 8,
  },
  meBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  listMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  listLevel: { fontSize: 11, fontWeight: '600' },
  tierBadgeSmall: {
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },
  tierTextSmall: { fontSize: 10, fontWeight: '700' },

  listScore: { fontSize: 15, fontWeight: '900' },

  // Sticky "Vị trí của bạn"
  myCard: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14, // safe area cho iPhone notch
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15, shadowRadius: 10,
  },
  myCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  myRankText: { fontSize: 18, fontWeight: '900', color: '#fff', minWidth: 36 },
  myAvatar: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  myAvatarText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  myName:  { fontSize: 14, fontWeight: '800', color: '#fff' },
  myScore: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  myPlayBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 10, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  myPlayBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});
