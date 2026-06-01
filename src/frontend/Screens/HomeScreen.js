import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import AppHeader from '../Components/AppHeader';

export default function HomeScreen({ navigation }) {
  const { isDark, theme: C } = useTheme();
  const [loginStreak, setLoginStreak] = useState(0);

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const raw = await AsyncStorage.getItem('userInfo');
        if (raw) {
          const info = JSON.parse(raw);
          setLoginStreak(info.loginStreak || 0);
        }
      } catch (_) {}
    };
    loadStreak();
  }, []);

  const PLAY_MODES = [
    {
      id: '1',
      title: 'Classic Quiz',
      desc: 'The standard multiple choice format you know and love. Perfect for quick reviews and focused subject testing.',
      badge: '⊙ Most Popular',
      badgeBg: C.primaryLight,
      badgeColor: C.primary,
      btnLabel: 'Play Now →',
      btnStyle: 'primary',
      type: 'Quiz',
      size: 'large',
      emoji: '💻',
    },
    {
      id: '2',
      title: 'True or False',
      desc: 'Test your quick reflexes with binary True or False statements. Speed and accuracy count!',
      badge: 'Speed Run',
      badgeBg: C.accentLight,
      badgeColor: C.accent,
      btnLabel: 'Play Now →',
      btnStyle: 'outline',
      type: 'TrueFalse',
      size: 'small',
      emoji: '⚖️',
    },
    {
      id: '3',
      title: 'Lucky Draw',
      desc: 'Pick a range and spin the wheel! A random number will be generated — great for lucky draws and random picks.',
      badge: 'Bonus Points',
      badgeBg: '#FEF3C7',
      badgeColor: '#D97706',
      btnLabel: 'Try My Luck →',
      btnStyle: 'outline',
      type: 'LuckyNumber',
      size: 'small',
      emoji: '🎰',
    },
    {
      id: '4',
      title: 'Flashcards',
      desc: 'Classic study card method. Flip front/back cards to memorize definitions, vocabulary and facts.',
      badge: 'Memorization',
      badgeBg: C.primaryLight,
      badgeColor: C.primary,
      btnLabel: 'Start Flipping →',
      btnStyle: 'outline',
      type: 'Flashcard',
      size: 'small',
      emoji: '🎴',
    },
    {
      id: '5',
      title: 'Word Scramble',
      desc: 'Unscramble mixed letters back into the correct English vocabulary word. Great for language learners!',
      badge: 'Spelling',
      badgeBg: C.accentLight,
      badgeColor: C.accent,
      btnLabel: 'Unscramble Now →',
      btnStyle: 'outline',
      type: 'WordScramble',
      size: 'small',
      emoji: '🔤',
    },
  ];

  const handlePlay = (type) => {
    if (type === 'LuckyNumber') {
      navigation.navigate('LuckyNumber');
    } else {
      navigation.navigate('Quiz', { gameType: type });
    }
  };

  const largeMode = PLAY_MODES[0];
  const smallModes = PLAY_MODES.slice(1);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgCard} />
      <AppHeader navigation={navigation} activeTab="Play" hideBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.pageTitle, { color: C.textPrimary }]}>
            Choose Your <Text style={[styles.pageTitlePurple, { color: C.primary }]}>Play Style</Text>
          </Text>
          <Text style={[styles.pageSubtitle, { color: C.textMuted }]}>
            Turn your study session into a game. Select a mode to start challenging yourself and earning rewards.
          </Text>
        </View>

        {/* Top row: large + small */}
        <View style={styles.topRow}>
          {/* Large card */}
          <View style={[styles.largeCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            {largeMode.badge && (
              <View style={[styles.modeBadge, { backgroundColor: largeMode.badgeBg }]}>
                <Text style={[styles.modeBadgeText, { color: largeMode.badgeColor }]}>{largeMode.badge}</Text>
              </View>
            )}
            <Text style={[styles.largeModeTitle, { color: C.textPrimary }]}>{largeMode.title}</Text>
            <Text style={[styles.largeModeDesc, { color: C.textMuted }]}>{largeMode.desc}</Text>
            <TouchableOpacity
              style={[styles.btnPrimary, { backgroundColor: C.primary, shadowColor: C.primary }]}
              onPress={() => handlePlay(largeMode.type)}
              activeOpacity={0.88}
            >
              <Text style={styles.btnPrimaryText}>{largeMode.btnLabel}</Text>
            </TouchableOpacity>
            <View style={styles.largeCardEmoji}>
              <Text style={{ fontSize: 64 }}>{largeMode.emoji}</Text>
            </View>
          </View>

          {/* Small card top */}
          <View style={[styles.smallCardTop, { backgroundColor: C.bgCard, borderColor: C.border }]}>
            <View style={[styles.modeBadge, { backgroundColor: smallModes[0].badgeBg, alignSelf: 'flex-start', marginBottom: 8 }]}>
              <Text style={[styles.modeBadgeText, { color: smallModes[0].badgeColor }]}>{smallModes[0].badge}</Text>
            </View>
            <View style={[styles.smallCardThumb, { backgroundColor: C.bgApp }]}>
              <Text style={{ fontSize: 48 }}>{smallModes[0].emoji}</Text>
            </View>
            <Text style={[styles.smallModeTitle, { color: C.textPrimary }]}>{smallModes[0].title}</Text>
            <Text style={[styles.smallModeDesc, { color: C.textMuted }]}>{smallModes[0].desc}</Text>
            <TouchableOpacity
              style={[styles.btnOutline, { borderColor: C.primary }]}
              onPress={() => handlePlay(smallModes[0].type)}
              activeOpacity={0.85}
            >
              <Text style={[styles.btnOutlineText, { color: C.primary }]}>{smallModes[0].btnLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom row: 3 small cards */}
        <View style={styles.bottomRow}>
          {smallModes.slice(1).map((mode) => (
            <View key={mode.id} style={[styles.bottomCard, { backgroundColor: C.bgCard, borderColor: C.border }]}>
              <View style={[styles.bottomCardThumb, { backgroundColor: C.bgApp }]}>
                <Text style={{ fontSize: 36 }}>{mode.emoji}</Text>
                {mode.badge && (
                  <View style={[styles.thumbBadge, { backgroundColor: mode.badgeBg || C.primaryLight }]}>
                    <Text style={[styles.thumbBadgeText, { color: mode.badgeColor || C.primary }]}>{mode.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.bottomModeTitle, { color: C.textPrimary }]}>{mode.title}</Text>
              <Text style={[styles.bottomModeDesc, { color: C.textMuted }]}>{mode.desc}</Text>
              <TouchableOpacity
                style={[styles.btnOutline, { borderColor: C.primary }]}
                onPress={() => handlePlay(mode.type)}
                activeOpacity={0.85}
              >
                <Text style={[styles.btnOutlineText, { color: C.primary }]}>{mode.btnLabel}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Streak Banner */}
        <View style={[styles.streakBanner, { backgroundColor: C.primary, shadowColor: C.primary }]}>
          <View style={styles.streakIconWrap}>
            <Text style={{ fontSize: 22 }}>⚡</Text>
          </View>
          <View style={styles.streakInfo}>
            <Text style={styles.streakTitle}>
              {loginStreak > 0 ? `${loginStreak} Day Streak!` : 'Start Your Streak!'}
            </Text>
            <Text style={styles.streakDesc}>
              {loginStreak > 0
                ? 'Play any mode today to keep your streak alive and earn 2x XP.'
                : 'Log in every day to build your streak and earn bonus XP.'}
            </Text>
          </View>
          <View style={styles.streakDots}>
            {[1,2,3,4,5,6,7].map((d) => (
              <View key={d} style={[styles.streakDot, d <= loginStreak && styles.streakDotActive]} />
            ))}
          </View>
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
  scroll: { paddingBottom: 40 },

  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
  },
  pageTitle: { fontSize: 26, fontWeight: '900', marginBottom: 10 },
  pageTitlePurple: {},
  pageSubtitle: { fontSize: 13, lineHeight: 19 },

  // Top row
  topRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 14,
    marginBottom: 14,
  },
  largeCard: {
    flex: 1.4,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    overflow: 'hidden',
    minHeight: 220,
  },
  modeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  modeBadgeText: { fontSize: 11, fontWeight: '700' },
  largeModeTitle: { fontSize: 20, fontWeight: '900', marginBottom: 8 },
  largeModeDesc: { fontSize: 12, lineHeight: 17, marginBottom: 16 },
  largeCardEmoji: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    opacity: 0.15,
  },

  smallCardTop: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  smallCardThumb: {
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  smallModeTitle: { fontSize: 15, fontWeight: '800', marginBottom: 5 },
  smallModeDesc: { fontSize: 11, lineHeight: 15, marginBottom: 12 },

  // Bottom row
  bottomRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  bottomCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  bottomCardThumb: {
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  thumbBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  thumbBadgeText: { fontSize: 8, fontWeight: '800' },
  bottomModeTitle: { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  bottomModeDesc: { fontSize: 10, lineHeight: 14, marginBottom: 10 },

  // Buttons
  btnPrimary: {
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  btnOutline: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  btnOutlineText: { fontWeight: '700', fontSize: 12 },

  // Streak banner
  streakBanner: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 32,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  streakIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakInfo: { flex: 1 },
  streakTitle: { fontSize: 15, fontWeight: '900', color: '#fff', marginBottom: 3 },
  streakDesc: { fontSize: 11, color: 'rgba(255,255,255,0.8)', lineHeight: 15 },
  streakDots: { flexDirection: 'row', gap: 4 },
  streakDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  streakDotActive: { backgroundColor: '#fff' },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  footerLogo: { fontSize: 15, fontWeight: '900' },
  footerLinks: { flexDirection: 'row', gap: 16 },
  footerLink: { fontSize: 11, fontWeight: '600' },
  footerCopy: { fontSize: 11 },
});
