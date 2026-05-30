import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Colors } from '../Styles/Colors';
import AppHeader from '../Components/AppHeader';

const PLAY_MODES = [
  {
    id: '1',
    title: 'Classic Quiz',
    desc: 'The standard multiple choice format you know and love. Perfect for quick reviews and focused subject testing.',
    badge: '⊙ Most Popular',
    badgeBg: Colors.primaryLight,
    badgeColor: Colors.primary,
    btnLabel: 'Play Now →',
    btnStyle: 'primary',
    type: 'Quiz',
    size: 'large',
    emoji: '💻',
  },
  {
    id: '2',
    title: 'Duck Race',
    desc: 'Answer questions fast to move your duck forward. Compete against friends in real-time!',
    badge: 'Live Multiplayer',
    badgeBg: Colors.accentLight,
    badgeColor: Colors.accent,
    btnLabel: 'Enter Race',
    btnStyle: 'outline',
    type: 'TrueFalse',
    size: 'small',
    emoji: '🦆',
  },
  {
    id: '3',
    title: 'Lucky Draw',
    desc: 'Answer correctly for a chance to spin the wheel and win exclusive power-ups and badges.',
    badge: 'Bonus Points',
    badgeBg: '#FEF3C7',
    badgeColor: '#D97706',
    btnLabel: 'Try My Luck',
    btnStyle: 'outline',
    type: 'LuckyNumber',
    size: 'small',
    emoji: '🎰',
  },
  {
    id: '4',
    title: 'Jigsaw Puzzle',
    desc: 'Unlock puzzle pieces by answering correctly. Solve the final image for a massive XP boost.',
    badge: null,
    btnLabel: 'Start Solving',
    btnStyle: 'outline',
    type: 'Flashcard',
    size: 'small',
    emoji: '🧩',
  },
  {
    id: '5',
    title: 'Word Link',
    desc: 'Connect clues to words in this fast-paced vocabulary challenge. Great for language learners!',
    badge: null,
    btnLabel: 'Link Words',
    btnStyle: 'outline',
    type: 'WordScramble',
    size: 'small',
    emoji: '🔤',
  },
];

export default function HomeScreen({ navigation }) {
  const handlePlay = (type) => {
    navigation.navigate('Quiz', { gameType: type });
  };

  const largeMode = PLAY_MODES[0];
  const smallModes = PLAY_MODES.slice(1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgCard} />
      <AppHeader navigation={navigation} activeTab="Play" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>
            Choose Your <Text style={styles.pageTitlePurple}>Play Style</Text>
          </Text>
          <Text style={styles.pageSubtitle}>
            Turn your study session into a game. Select a mode to start challenging yourself and earning rewards.
          </Text>
        </View>

        {/* Top row: large + small */}
        <View style={styles.topRow}>
          {/* Large card */}
          <View style={styles.largeCard}>
            {largeMode.badge && (
              <View style={[styles.modeBadge, { backgroundColor: largeMode.badgeBg }]}>
                <Text style={[styles.modeBadgeText, { color: largeMode.badgeColor }]}>{largeMode.badge}</Text>
              </View>
            )}
            <Text style={styles.largeModeTitle}>{largeMode.title}</Text>
            <Text style={styles.largeModeDesc}>{largeMode.desc}</Text>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => handlePlay(largeMode.type)}
              activeOpacity={0.88}
            >
              <Text style={styles.btnPrimaryText}>{largeMode.btnLabel}</Text>
            </TouchableOpacity>
            <View style={styles.largeCardEmoji}>
              <Text style={{ fontSize: 64 }}>{largeMode.emoji}</Text>
            </View>
          </View>

          {/* Duck Race card */}
          <View style={styles.smallCardTop}>
            <View style={[styles.modeBadge, { backgroundColor: smallModes[0].badgeBg, alignSelf: 'flex-start', marginBottom: 8 }]}>
              <Text style={[styles.modeBadgeText, { color: smallModes[0].badgeColor }]}>{smallModes[0].badge}</Text>
            </View>
            <View style={styles.smallCardThumb}>
              <Text style={{ fontSize: 48 }}>{smallModes[0].emoji}</Text>
            </View>
            <Text style={styles.smallModeTitle}>{smallModes[0].title}</Text>
            <Text style={styles.smallModeDesc}>{smallModes[0].desc}</Text>
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={() => handlePlay(smallModes[0].type)}
              activeOpacity={0.85}
            >
              <Text style={styles.btnOutlineText}>{smallModes[0].btnLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom row: 3 small cards */}
        <View style={styles.bottomRow}>
          {smallModes.slice(1).map((mode) => (
            <View key={mode.id} style={styles.bottomCard}>
              <View style={styles.bottomCardThumb}>
                <Text style={{ fontSize: 36 }}>{mode.emoji}</Text>
                {mode.badge && (
                  <View style={[styles.thumbBadge, { backgroundColor: mode.badgeBg || Colors.primaryLight }]}>
                    <Text style={[styles.thumbBadgeText, { color: mode.badgeColor || Colors.primary }]}>{mode.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.bottomModeTitle}>{mode.title}</Text>
              <Text style={styles.bottomModeDesc}>{mode.desc}</Text>
              <TouchableOpacity
                style={styles.btnOutline}
                onPress={() => handlePlay(mode.type)}
                activeOpacity={0.85}
              >
                <Text style={styles.btnOutlineText}>{mode.btnLabel}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Streak Banner */}
        <View style={styles.streakBanner}>
          <View style={styles.streakIconWrap}>
            <Text style={{ fontSize: 22 }}>⚡</Text>
          </View>
          <View style={styles.streakInfo}>
            <Text style={styles.streakTitle}>5 Day Streak!</Text>
            <Text style={styles.streakDesc}>Play any mode today to keep your streak alive and earn 2x XP.</Text>
          </View>
          <View style={styles.streakDots}>
            {[1,2,3,4,5,6,7].map((d) => (
              <View key={d} style={[styles.streakDot, d <= 5 && styles.streakDotActive]} />
            ))}
          </View>
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
  scroll: { paddingBottom: 40 },

  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
  },
  pageTitle: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary, marginBottom: 10 },
  pageTitlePurple: { color: Colors.primary },
  pageSubtitle: { fontSize: 13, color: Colors.textMuted, lineHeight: 19 },

  // Top row
  topRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 14,
    marginBottom: 14,
  },
  largeCard: {
    flex: 1.4,
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
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
  largeModeTitle: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary, marginBottom: 8 },
  largeModeDesc: { fontSize: 12, color: Colors.textMuted, lineHeight: 17, marginBottom: 16 },
  largeCardEmoji: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    opacity: 0.15,
  },

  smallCardTop: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  smallCardThumb: {
    height: 80,
    backgroundColor: Colors.bgApp,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  smallModeTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, marginBottom: 5 },
  smallModeDesc: { fontSize: 11, color: Colors.textMuted, lineHeight: 15, marginBottom: 12 },

  // Bottom row
  bottomRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  bottomCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  bottomCardThumb: {
    height: 70,
    backgroundColor: Colors.bgApp,
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
  bottomModeTitle: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  bottomModeDesc: { fontSize: 10, color: Colors.textMuted, lineHeight: 14, marginBottom: 10 },

  // Buttons
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  btnOutlineText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },

  // Streak banner
  streakBanner: {
    marginHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 32,
    elevation: 4,
    shadowColor: Colors.primary,
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
    borderTopColor: Colors.border,
    alignItems: 'center',
    gap: 6,
  },
  footerLogo: { fontSize: 15, fontWeight: '900', color: Colors.primary },
  footerLinks: { flexDirection: 'row', gap: 16 },
  footerLink: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  footerCopy: { fontSize: 11, color: Colors.textMuted },
});
