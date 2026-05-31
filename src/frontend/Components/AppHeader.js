import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function AppHeader({ navigation, activeTab, hideBack = false }) {
  const { theme: C, isAdmin } = useTheme();
  const canGoBack = !hideBack && navigation.canGoBack();
  const allTabs = [
    { key: 'Play',      label: 'Play',       route: 'Home' },
    { key: 'Explore',   label: 'Explore',    route: 'Explore' },
    { key: 'Manage',    label: 'Manage',     route: 'Manage',  adminOnly: true },
    { key: 'Report',    label: 'Report',     route: 'Report',  adminOnly: true },
    { key: 'Profile',   label: 'My Profile', route: 'Profile' },
  ];
  const tabs = allTabs.filter(t => !t.adminOnly || isAdmin);

  return (
    <View style={[styles.header, { backgroundColor: C.bgCard, borderBottomColor: C.border }]}>
      {/* Nút back (hiển thị khi có thể quay lại) */}
      {canGoBack && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={[styles.backBtn, { backgroundColor: C.bgApp, borderColor: C.border }]}
        >
          <Text style={[styles.backBtnText, { color: C.primary }]}>←</Text>
        </TouchableOpacity>
      )}

      {/* Logo */}
      <TouchableOpacity onPress={() => navigation.navigate('Landing')} activeOpacity={0.8}>
        <Text style={[styles.logo, { color: C.primary }]}>QuizMates</Text>
      </TouchableOpacity>

      {/* Nav links */}
      <View style={styles.navLinks}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => navigation.navigate(tab.route)}
              activeOpacity={0.7}
              style={styles.navItem}
            >
              <Text style={[
                styles.navLabel,
                { color: isActive ? C.primary : C.textMuted },
                isActive && styles.navLabelActive
              ]}>
                {tab.label}
              </Text>
              {isActive && <View style={[styles.navUnderline, { backgroundColor: C.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Right icons */}
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
          onPress={() => navigation.navigate('PowerUps')}
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  logo: {
    fontSize: 20,
    fontWeight: '900',
    marginRight: 32,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 8,
  },
  backBtnText: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  navLinks: {
    flex: 1,
    flexDirection: 'row',
    gap: 24,
  },
  navItem: {
    alignItems: 'center',
    paddingBottom: 2,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  navLabelActive: {
    fontWeight: '700',
  },
  navUnderline: {
    position: 'absolute',
    bottom: -14,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },
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
});
