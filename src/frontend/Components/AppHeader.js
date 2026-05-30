import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../Styles/Colors';

export default function AppHeader({ navigation, activeTab }) {
  const tabs = [
    { key: 'Play',      label: 'Play',       route: 'Home' },
    { key: 'Explore',   label: 'Explore',    route: 'Explore' },
    { key: 'Profile',   label: 'My Profile', route: 'Profile' },
  ];

  return (
    <View style={styles.header}>
      {/* Logo */}
      <TouchableOpacity onPress={() => navigation.navigate('Landing')} activeOpacity={0.8}>
        <Text style={styles.logo}>QuizMates</Text>
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
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.navUnderline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Right icons */}
      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Text style={styles.iconText}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
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
    backgroundColor: Colors.bgCard,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logo: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary,
    marginRight: 32,
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
    color: Colors.textMuted,
  },
  navLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  navUnderline: {
    position: 'absolute',
    bottom: -14,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.bgApp,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconText: { fontSize: 16 },
});
