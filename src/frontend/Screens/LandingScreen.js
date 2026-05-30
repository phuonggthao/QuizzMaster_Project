import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../Components/AppHeader';

const FEATURES = [
  { id: '1', icon: '🏆', title: 'Win Rewards', desc: 'Collect points as you study and redeem them for cool digital badges and community perks.' },
  { id: '2', icon: '👥', title: 'Study Parties', desc: 'Create private quiz rooms for your friends and study together in real-time, no matter where you are.' },
  { id: '3', icon: '📈', title: 'Smart Tracking', desc: 'Our AI analyzes your weak spots and suggests the perfect quizzes to help you level up fast.' },
];

export default function LandingScreen({ navigation }) {
  const { isDark, theme: C } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgCard} />
      <AppHeader navigation={navigation} activeTab="Play" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: C.bgCard }]}>
          <View style={styles.heroLeft}>
            <View style={[styles.heroBadge, { backgroundColor: C.accentLight }]}>
              <Text style={[styles.heroBadgeText, { color: C.accent }]}>🟢 Join 50k+ students today!</Text>
            </View>
            <Text style={[styles.heroTitle, { color: C.textPrimary }]}>
              Study Harder,{'\n'}
              <Text style={[styles.heroTitlePurple, { color: C.primary }]}>Play Better Together.</Text>
            </Text>
            <Text style={[styles.heroSubtitle, { color: C.textMuted }]}>Transform your study sessions into epic quiz battles. Challenge friends, climb leaderboards, and master any subject with QuizMates.</Text>
            <View style={styles.heroActions}>
              <TouchableOpacity style={[styles.playBtn, { backgroundColor: C.primary, shadowColor: C.primary }]} onPress={() => navigation.navigate('Home')} activeOpacity={0.88}>
                <Text style={styles.playBtnText}>▶ Play Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.searchBox, { backgroundColor: C.bgApp, borderColor: C.border }]}
                onPress={() => navigation.navigate('Explore')}
                activeOpacity={0.8}
              >
                <Text style={styles.searchIcon}>🔍</Text>
                <Text style={[styles.searchPlaceholder, { color: C.textMuted }]}>Search topics e.g., Ancient R...</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.friendsRow}>
              <Text style={styles.friendsAvatars}>👤👤👤</Text>
              <Text style={[styles.friendsText, { color: C.textMuted }]}>Friends are online & ready to play!</Text>
            </View>
          </View>

          <View style={styles.heroRight}>
            <View style={[styles.heroImage, { backgroundColor: C.primaryLight }]}>
              <Text style={styles.heroImageEmoji}>📱</Text>
            </View>
            <View style={[styles.streakBadge, { backgroundColor: C.bgCard, borderColor: C.border }]}>
              <Text style={styles.streakIcon}>📈</Text>
              <View>
                <Text style={[styles.streakLabel, { color: C.textMuted }]}>Daily Streak</Text>
                <Text style={[styles.streakValue, { color: C.textPrimary }]}>12 Days</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trending Quizzes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>Trending Quizzes</Text>
              <Text style={[styles.sectionSubtitle, { color: C.textMuted }]}>Jump into what everyone is learning right now.</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Explore')}>
              <Text style={[styles.viewAll, { color: C.primary }]}>View all →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.trendingGrid}>
            {/* Large card left */}
            <TouchableOpacity style={[styles.trendingCardLarge, { backgroundColor: C.primary, shadowColor: C.primary }]} onPress={() => navigation.navigate('Quiz', { gameType: 'Quiz' })} activeOpacity={0.88}>
              <View style={styles.trendingBadge}>
                <Text style={styles.trendingBadgeText}>MATHEMATICS</Text>
              </View>
              <Text style={styles.trendingTitleLarge}>Advanced Calculus{'\n'}& Fractals</Text>
              <View style={styles.trendingFooter}>
                <Text style={styles.trendingPlayers}>👥 1.2k Playing</Text>
                <View style={styles.trendingArrow}>
                  <Text style={styles.trendingArrowText}>→</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Right column */}
            <View style={styles.trendingRight}>
              <TouchableOpacity style={[styles.trendingCardGreen, { backgroundColor: '#059669', shadowColor: '#059669' }]} onPress={() => navigation.navigate('Quiz', { gameType: 'Quiz' })} activeOpacity={0.88}>
                <View style={styles.trendingBadgeGreen}>
                  <Text style={styles.trendingBadgeTextGreen}>SCIENCE</Text>
                </View>
                <Text style={styles.trendingTitleGreen}>The Quantum World</Text>
                <Text style={styles.trendingMeta}>46 Questions • Expert Level</Text>
              </TouchableOpacity>

              <View style={styles.trendingSmallRow}>
                <TouchableOpacity style={[styles.trendingCardSmall, { backgroundColor: C.bgCard, borderColor: C.border }]} onPress={() => navigation.navigate('Quiz', { gameType: 'Quiz' })} activeOpacity={0.85}>
                  <Text style={styles.trendingSmallIcon}>🗺️</Text>
                  <Text style={[styles.trendingSmallTitle, { color: C.textPrimary }]}>Modern Wars</Text>
                  <Text style={[styles.trendingSmallMeta, { color: C.textMuted }]}>320 Students</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.trendingCardSmall, { backgroundColor: C.bgCard, borderColor: C.border }]} onPress={() => navigation.navigate('Quiz', { gameType: 'Quiz' })} activeOpacity={0.85}>
                  <Text style={styles.trendingSmallIcon}>🌍</Text>
                  <Text style={[styles.trendingSmallTitle, { color: C.textPrimary }]}>World Map</Text>
                  <Text style={[styles.trendingSmallMeta, { color: C.textMuted }]}>890 Students</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresRow}>
          {FEATURES.map((f) => (
            <View key={f.id} style={[styles.featureCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={[styles.featureTitle, { color: C.textPrimary }]}>{f.title}</Text>
              <Text style={[styles.featureDesc, { color: C.textMuted }]}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* CTA Banner */}
        <View style={[styles.ctaBanner, { backgroundColor: C.primary, shadowColor: C.primary }]}>
          <Text style={styles.ctaTitle}>Ready to crush your next test?</Text>
          <Text style={styles.ctaSubtitle}>Stop studying alone. Join the QuizMates community and start leveling up your knowledge through play.</Text>
          <View style={styles.ctaButtons}>
            <TouchableOpacity style={styles.ctaBtnWhite} onPress={() => navigation.navigate('Register')} activeOpacity={0.88}>
              <Text style={[styles.ctaBtnWhiteText, { color: C.primary }]}>Get Started Free</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ctaBtnOutline} onPress={() => navigation.navigate('Explore')} activeOpacity={0.88}>
              <Text style={styles.ctaBtnOutlineText}>Explore Topics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: C.border }]}>
          <Text style={[styles.footerLogo, { color: C.primary }]}>QuizMates</Text>
          <Text style={[styles.footerCopy, { color: C.textMuted }]}>© 2024 QuizMates. Keep learning!</Text>
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
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },

  // Hero
  hero: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 20,
  },
  heroLeft: { flex: 1 },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 16,
  },
  heroBadgeText: { fontSize: 12, fontWeight: '700' },
  heroTitle: { fontSize: 26, fontWeight: '900', lineHeight: 34, marginBottom: 12 },
  heroTitlePurple: { },
  heroSubtitle: { fontSize: 13, lineHeight: 19, marginBottom: 20 },
  heroActions: { flexDirection: 'row', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  playBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  playBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 6,
  },
  searchIcon: { fontSize: 14 },
  searchPlaceholder: { fontSize: 12 },
  friendsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  friendsAvatars: { fontSize: 18 },
  friendsText: { fontSize: 12 },

  heroRight: { width: 120, alignItems: 'center' },
  heroImage: {
    width: 110,
    height: 140,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroImageEmoji: { fontSize: 48 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 8,
    gap: 6,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  streakIcon: { fontSize: 16 },
  streakLabel: { fontSize: 9, fontWeight: '600' },
  streakValue: { fontSize: 12, fontWeight: '800' },

  // Section
  section: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: '900' },
  sectionSubtitle: { fontSize: 12, marginTop: 3 },
  viewAll: { fontSize: 13, fontWeight: '700' },

  // Trending grid
  trendingGrid: { flexDirection: 'row', gap: 12 },
  trendingCardLarge: {
    flex: 1,
    borderRadius: 16,
    padding: 18,
    justifyContent: 'space-between',
    minHeight: 180,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  trendingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 10,
  },
  trendingBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  trendingTitleLarge: { fontSize: 18, fontWeight: '900', color: '#fff', lineHeight: 24, flex: 1 },
  trendingFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  trendingPlayers: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  trendingArrow: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  trendingArrowText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  trendingRight: { flex: 1, gap: 10 },
  trendingCardGreen: {
    borderRadius: 14,
    padding: 14,
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  trendingBadgeGreen: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    marginBottom: 6,
  },
  trendingBadgeTextGreen: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  trendingTitleGreen: { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 4 },
  trendingMeta: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },

  trendingSmallRow: { flexDirection: 'row', gap: 8 },
  trendingCardSmall: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  trendingSmallIcon: { fontSize: 20, marginBottom: 4 },
  trendingSmallTitle: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
  trendingSmallMeta: { fontSize: 10 },

  // Features
  featuresRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  featureCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  featureIcon: { fontSize: 28, marginBottom: 10 },
  featureTitle: { fontSize: 13, fontWeight: '800', marginBottom: 6 },
  featureDesc: { fontSize: 11, lineHeight: 16 },

  // CTA Banner
  ctaBanner: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 32,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  ctaTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 10 },
  ctaSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  ctaButtons: { flexDirection: 'row', gap: 12 },
  ctaBtnWhite: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  ctaBtnWhiteText: { fontWeight: '800', fontSize: 14 },
  ctaBtnOutline: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  ctaBtnOutlineText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  footerLogo: { fontSize: 16, fontWeight: '900' },
  footerCopy: { fontSize: 11 },
  footerLinks: { flexDirection: 'row', gap: 16, marginTop: 4 },
  footerLink: { fontSize: 11, fontWeight: '600' },
});
