import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, Switch,
} from 'react-native';
import { Colors } from '../Styles/Colors';

const POWER_ITEMS = [
  {
    id: '1',
    emoji: '+2',
    title: 'Nhân đôi điểm',
    desc: 'Nhân đôi điểm số cho câu trả lời đúng tiếp theo',
  },
  {
    id: '2',
    emoji: '❄',
    title: 'Đóng băng',
    desc: 'Dừng đồng hồ đếm ngược trong 5 giây',
  },
  {
    id: '3',
    emoji: '✏',
    title: 'Cây bút thần',
    desc: 'Loại bỏ 2 đáp án sai, chỉ còn 2 lựa chọn',
  },
];

const MEME_SETS = [
  {
    id: '1',
    emoji: '🐶',
    title: 'Động vật hài hước',
    badge: 'Phổ biến nhất',
    active: true,
  },
  {
    id: '2',
    emoji: '🌌',
    title: 'Khám phá vũ trụ',
    badge: '24 hình ảnh',
    active: false,
  },
];

const MUSIC_OPTIONS = ['Lofi Học Tập', 'Nhạc Cổ Điển', 'Nhạc Thiên Nhiên', 'Không có nhạc'];

export default function PowerUpsScreen({ navigation }) {
  const [masterEnabled, setMasterEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [fireworks, setFireworks] = useState(true);
  const [volume, setVolume] = useState(60);
  const [selectedMusic, setSelectedMusic] = useState('Lofi Học Tập');
  const [activeMeme, setActiveMeme] = useState('1');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgApp} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Power-ups & Memes</Text>
          <Text style={styles.headerSubtitle}>Tùy chỉnh trải nghiệm học tập</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Power-ups section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚡ Vật phẩm hỗ trợ</Text>
          <View style={styles.masterToggleRow}>
            <Text style={styles.masterToggleLabel}>
              {masterEnabled ? 'Đang kích hoạt' : 'Đã tắt'}
            </Text>
            <Switch
              value={masterEnabled}
              onValueChange={setMasterEnabled}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={masterEnabled ? Colors.primary : Colors.textMuted}
            />
          </View>
        </View>

        <View style={styles.card}>
          {POWER_ITEMS.map((item, idx) => (
            <View key={item.id}>
              <View style={styles.powerItem}>
                <View style={styles.powerIconWrap}>
                  <Text style={styles.powerIcon}>{item.emoji}</Text>
                </View>
                <View style={styles.powerInfo}>
                  <Text style={styles.powerTitle}>{item.title}</Text>
                  <Text style={styles.powerDesc}>{item.desc}</Text>
                </View>
                <TouchableOpacity style={styles.setupBtn} activeOpacity={0.8}>
                  <Text style={styles.setupBtnText}>Thiết lập</Text>
                </TouchableOpacity>
              </View>
              {idx < POWER_ITEMS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Meme section */}
        <Text style={styles.sectionTitle2}>😊 Meme vui nhộn</Text>

        {MEME_SETS.map((meme) => (
          <TouchableOpacity
            key={meme.id}
            style={[styles.memeItem, activeMeme === meme.id && styles.memeItemActive]}
            onPress={() => setActiveMeme(meme.id)}
            activeOpacity={0.85}
          >
            <Text style={styles.memeEmoji}>{meme.emoji}</Text>
            <View style={styles.memeInfo}>
              <Text style={styles.memeTitle}>{meme.title}</Text>
              <Text style={styles.memeBadge}>{meme.badge}</Text>
            </View>
            {activeMeme === meme.id && (
              <View style={styles.memeCheck}>
                <Text style={styles.memeCheckText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addMemeBtn} activeOpacity={0.8}>
          <Text style={styles.addMemeBtnText}>+ Thêm bộ Meme mới</Text>
        </TouchableOpacity>

        {/* Music & UI section */}
        <Text style={styles.sectionTitle2}>🎵 Âm nhạc & Giao diện</Text>

        <View style={styles.card}>
          {/* Music dropdown */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Nhạc nền buổi học</Text>
            <TouchableOpacity style={styles.dropdown} activeOpacity={0.8}>
              <Text style={styles.dropdownText}>{selectedMusic}</Text>
              <Text style={styles.dropdownArrow}>▾</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Volume slider */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Âm lượng</Text>
          </View>
          <View style={styles.volumeRow}>
            <Text style={styles.volumeIcon}>🔈</Text>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${volume}%` }]} />
              <View style={[styles.sliderThumb, { left: `${volume}%` }]} />
            </View>
            <Text style={styles.volumeIcon}>🔊</Text>
          </View>

          <View style={styles.divider} />

          {/* Dark mode toggle */}
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Chế độ hiển thị</Text>
              <Text style={styles.settingSubLabel}>{darkMode ? 'Tối' : 'Sáng'}</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={darkMode ? Colors.primary : Colors.textMuted}
            />
          </View>

          <View style={styles.divider} />

          {/* Fireworks toggle */}
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Hiệu ứng chúc mừng</Text>
              <Text style={styles.settingSubLabel}>
                {fireworks ? 'Pháo hoa & Confetti ON' : 'Đã tắt'}
              </Text>
            </View>
            <Switch
              value={fireworks}
              onValueChange={setFireworks}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={fireworks ? Colors.primary : Colors.textMuted}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelBtnText}>Huỷ bỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.88}
        >
          <Text style={styles.saveBtnText}>Lưu cài đặt</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgApp },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: { fontSize: 24, color: Colors.primary, fontWeight: '700' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary },
  headerSubtitle: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  sectionTitle2: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 20,
  },
  masterToggleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  masterToggleLabel: { fontSize: 13, color: Colors.primary, fontWeight: '700' },

  // Card
  card: {
    marginHorizontal: 20,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },

  // Power items
  powerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  powerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerIcon: { fontSize: 20, color: Colors.primary, fontWeight: '900' },
  powerInfo: { flex: 1 },
  powerTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  powerDesc: { fontSize: 12, color: Colors.textMuted, lineHeight: 16 },
  setupBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  setupBtnText: { fontSize: 12, fontWeight: '700', color: Colors.primary },

  // Meme items
  memeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  memeItemActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  memeEmoji: { fontSize: 28 },
  memeInfo: { flex: 1 },
  memeTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  memeBadge: { fontSize: 12, color: Colors.textMuted },
  memeCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memeCheckText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  addMemeBtn: {
    marginHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
  },
  addMemeBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textMuted },

  // Settings
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  settingSubLabel: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgApp,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dropdownText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  dropdownArrow: { fontSize: 12, color: Colors.textMuted },

  // Volume slider
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  volumeIcon: { fontSize: 18 },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    top: -6,
    marginLeft: -9,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: Colors.bgApp,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
  cancelBtnText: { fontSize: 15, fontWeight: '700', color: Colors.textMuted },
  saveBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '900' },
});
