import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, Platform, ScrollView, Modal, SafeAreaView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function AppHeader({ navigation, activeTab, hideBack = false }) {
  const { theme: C, isAdmin } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const canGoBack = !hideBack && navigation.canGoBack();

  const allTabs = [
    { key: 'Play',        label: '🎮 Play',       route: 'Home' },
    { key: 'Explore',     label: '🔍 Explore',    route: 'Explore' },
    { key: 'Leaderboard', label: '🏆 Xếp hạng',  route: 'GlobalLeaderboard' },
    { key: 'Manage',      label: '⚙️ Manage',     route: 'Manage',  adminOnly: true },
    { key: 'Report',      label: '📊 Report',     route: 'Report',  adminOnly: true },
    { key: 'Profile',     label: '👤 My Profile', route: 'Profile' },
  ];
  const tabs = allTabs.filter(t => !t.adminOnly || isAdmin);

  const navigate = (route) => {
    setMenuOpen(false);
    navigation.navigate(route);
  };

  // ── Mobile: header gọn + hamburger menu ──────────────────────────────────
  if (Platform.OS !== 'web') {
    return (
      <>
        <View style={[styles.header, { backgroundColor: C.bgCard, borderBottomColor: C.border }]}>
          {/* Back hoặc Logo */}
          {canGoBack ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              style={[styles.iconBtn, { backgroundColor: C.bgApp, borderColor: C.border }]}
            >
              <Text style={[styles.iconText, { color: C.primary }]}>←</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigate('Landing')} activeOpacity={0.8}>
              <Text style={[styles.logo, { color: C.primary }]}>QuizMates</Text>
            </TouchableOpacity>
          )}

          {/* Tab active hiện tại (giữa) */}
          <View style={styles.activeTabCenter}>
            <Text style={[styles.activeTabText, { color: C.textPrimary }]} numberOfLines={1}>
              {tabs.find(t => t.key === activeTab)?.label || ''}
            </Text>
          </View>

          {/* Right: settings + hamburger */}
          <View style={styles.rightIcons}>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: C.bgApp, borderColor: C.border }]}
              activeOpacity={0.7}
              onPress={() => navigate('PowerUps')}
            >
              <Text style={styles.iconText}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: C.bgApp, borderColor: C.border }]}
              activeOpacity={0.7}
              onPress={() => setMenuOpen(true)}
            >
              <Text style={styles.iconText}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Drawer menu */}
        <Modal
          visible={menuOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuOpen(false)}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setMenuOpen(false)}
          >
            <View style={[styles.drawer, { backgroundColor: C.bgCard }]}>
              <Text style={[styles.drawerTitle, { color: C.textMuted }]}>MENU</Text>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[
                      styles.drawerItem,
                      isActive && { backgroundColor: C.primaryLight },
                    ]}
                    onPress={() => navigate(tab.route)}
                    activeOpacity={0.75}
                  >
                    <Text style={[
                      styles.drawerItemText,
                      { color: isActive ? C.primary : C.textPrimary },
                      isActive && { fontWeight: '800' },
                    ]}>
                      {tab.label}
                    </Text>
                    {isActive && (
                      <View style={[styles.drawerActiveDot, { backgroundColor: C.primary }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }

  // ── Web: nav bar ngang đầy đủ ────────────────────────────────────────────
  return (
    <View style={[styles.header, { backgroundColor: C.bgCard, borderBottomColor: C.border }]}>
      {canGoBack && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={[styles.iconBtn, { backgroundColor: C.bgApp, borderColor: C.border, marginRight: 8 }]}
        >
          <Text style={[styles.iconText, { color: C.primary }]}>←</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigate('Landing')} activeOpacity={0.8}>
        <Text style={[styles.logo, { color: C.primary }]}>QuizMates</Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.navLinks}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => navigate(tab.route)}
              activeOpacity={0.7}
              style={styles.navItem}
            >
              <Text style={[
                styles.navLabel,
                { color: isActive ? C.primary : C.textMuted },
                isActive && styles.navLabelActive,
              ]}>
                {tab.label}
              </Text>
              {isActive && <View style={[styles.navUnderline, { backgroundColor: C.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.rightIcons}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: C.bgApp, borderColor: C.border }]}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Thông báo', 'Thông báo đang được phát triển')}
        >
          <Text style={styles.iconText}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: C.bgApp, borderColor: C.border }]}
          activeOpacity={0.7}
          onPress={() => navigate('PowerUps')}
        >
          <Text style={styles.iconText}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  logo: {
    fontSize: 18,
    fontWeight: '900',
    marginRight: 20,
  },

  // Mobile center label
  activeTabCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  activeTabText: {
    fontSize: 15,
    fontWeight: '700',
  },

  // Web nav
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 4,
    flex: 1,
  },
  navItem: {
    alignItems: 'center',
    paddingBottom: 2,
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  navLabelActive: {
    fontWeight: '700',
  },
  navUnderline: {
    position: 'absolute',
    bottom: -12,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },

  // Icons
  rightIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  iconText: { fontSize: 16 },

  // Mobile drawer
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  drawer: {
    width: 220,
    minHeight: '100%',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 0,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  drawerTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 0,
  },
  drawerItemText: {
    fontSize: 15,
    fontWeight: '600',
  },
  drawerActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
