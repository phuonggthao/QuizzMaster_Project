import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, Switch, Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

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
  { id: '1', emoji: '🐶', title: 'Động vật hài hước', badge: 'Phổ biến nhất' },
  { id: '2', emoji: '🌌', title: 'Khám phá vũ trụ',   badge: '24 hình ảnh' },
];

const MUSIC_OPTIONS = ['Lofi Học Tập', 'Nhạc Cổ Điển', 'Nhạc Thiên Nhiên', 'Không có nhạc'];

export default function PowerUpsScreen({ navigation }) {
  const { isDark, toggleTheme, theme: C } = useTheme();

  const [masterEnabled, setMasterEnabled] = useState(true);
  const [fireworks, setFireworks] = useState(true);
  const [volume, setVolume] = useState(60);
  const [selectedMusic, setSelectedMusic] = useState('Lofi Học Tập');
  const [activeMeme, setActiveMeme] = useState('1');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={C.bgApp}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: C.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={[styles.backBtn, { color: C.primary }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: C.textPrimary }]}>Power-ups & Memes</Text>
          <Text style={[styles.headerSubtitle, { color: C.textMuted }]}>Tùy chỉnh trải nghiệm học tập</Text>
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
          <Text style={[styles.sectionTitle, { color: C.textPrimary }]}>⚡ Vật phẩm hỗ trợ</Text>
          <View style={styles.masterToggleRow}>
            <Text style={[styles.masterToggleLabel, { color: C.primary }]}>
              {masterEnabled ? 'Đang kích hoạt' : 'Đã tắt'}
            </Text>
            <Switch
              value={masterEnabled}
              onValueChange={setMasterEnabled}
              trackColor={{ false: C.border, true: C.primaryLight }}
              thumbColor={masterEnabled ? C.primary : C.textMuted}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: C.bgCard, borderColor: C.border }]}>
          {POWER_ITEMS.map((item, idx) => (
            <View key={item.id}>
              <View style={styles.powerItem}>
                <View style={[styles.powerIconWrap, { backgroundColor: C.primaryLight }]}>
                  <Text style={[styles.powerIcon, { color: C.primary }]}>{item.emoji}</Text>
                </View>
                <View style={styles.powerInfo}>
                  <Text style={[styles.powerTitle, { color: C.textPrimary }]}>{item.title}</Text>
                  <Text style={[styles.powerDesc, { color: C.textMuted }]}>{item.desc}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.setupBtn, { backgroundColor: C.primaryLight }]}
                  activeOpacity={0.8}
                  onPress={() => Alert.alert(item.title, `${item.desc}\n\nTính năng thiết lập đang được phát triển.`)}
                >
                  <Text style={[styles.setupBtnText, { color: C.primary }]}>Thiết lập</Text>
                </TouchableOpacity>
              </View>
              {idx < POWER_ITEMS.length - 1 && (
                <View style={[styles.divider, { backgroundColor: C.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* Meme section */}
        <Text style={[styles.sectionTitle2, { color: C.textPrimary }]}>😊 Meme vui nhộn</Text>

        {MEME_SETS.map((meme) => (
          <TouchableOpacity
            key={meme.id}
            style={[
              styles.memeItem,
              { backgroundColor: C.bgCard, borderColor: C.border },
              activeMeme === meme.id && { borderColor: C.primary, backgroundColor: C.primaryLight },
            ]}
            onPress={() => setActiveMeme(meme.id)}
            activeOpacity={0.85}
          >
            <Text style={styles.memeEmoji}>{meme.emoji}</Text>
            <View style={styles.memeInfo}>
              <Text style={[styles.memeTitle, { color: C.textPrimary }]}>{meme.title}</Text>
              <Text style={[styles.memeBadge, { color: C.textMuted }]}>{meme.badge}</Text>
            </View>
            {activeMeme === meme.id && (
              <View style={[styles.memeCheck, { backgroundColor: C.primary }]}>
                <Text style={styles.memeCheckText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.addMemeBtn, { borderColor: C.border, backgroundColor: C.bgCard }]}
          activeOpacity={0.8}
          onPress={() => Alert.alert('Thêm Meme', 'Tính năng thêm bộ Meme mới đang được phát triển.')}
        >
          <Text style={[styles.addMemeBtnText, { color: C.textMuted }]}>+ Thêm bộ Meme mới</Text>
        </TouchableOpacity>

        {/* Music & UI section */}
        <Text style={[styles.sectionTitle2, { color: C.textPrimary }]}>🎵 Âm nhạc & Giao diện</Text>

        <View style={[styles.card, { backgroundColor: C.bgCard, borderColor: C.border }]}>
          {/* Music dropdown */}
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: C.textPrimary }]}>Nhạc nền buổi học</Text>
            <TouchableOpacity
              style={[styles.dropdown, { backgroundColor: C.bgApp, borderColor: C.border }]}
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert('Nhạc nền', 'Chọn nhạc nền', [
                  ...MUSIC_OPTIONS.map((opt) => ({
                    text: opt,
                    onPress: () => setSelectedMusic(opt),
                  })),
                  { text: 'Huỷ', style: 'cancel' },
                ])
              }
            >
              <Text style={[styles.dropdownText, { color: C.textPrimary }]}>{selectedMusic}</Text>
              <Text style={[styles.dropdownArrow, { color: C.textMuted }]}>▾</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, { backgroundColor: C.border }]} />

          {/* Volume slider */}
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: C.textPrimary }]}>Âm lượng</Text>
          </View>
          <View style={styles.volumeRow}>
            <Text style={styles.volumeIcon}>🔈</Text>
            <View style={[styles.sliderTrack, { backgroundColor: C.border }]}>
              <View style={[styles.sliderFill, { width: `${volume}%`, backgroundColor: C.primary }]} />
              <View style={[styles.sliderThumb, { left: `${volume}%`, backgroundColor: C.primary }]} />
            </View>
            <Text style={styles.volumeIcon}>🔊</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: C.border }]} />

          {/* Dark mode toggle — kết nối vào ThemeContext */}
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingLabel, { color: C.textPrimary }]}>Chế độ hiển thị</Text>
              <Text style={[styles.settingSubLabel, { color: C.textMuted }]}>
                {isDark ? '🌙 Tối' : '☀️ Sáng'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: C.border, true: C.primaryLight }}
              thumbColor={isDark ? C.primary : C.textMuted}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: C.border }]} />

          {/* Fireworks toggle */}
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingLabel, { color: C.textPrimary }]}>Hiệu ứng chúc mừng</Text>
              <Text style={[styles.settingSubLabel, { color: C.textMuted }]}>
                {fireworks ? 'Pháo hoa & Confetti ON' : 'Đã tắt'}
              </Text>
            </View>
            <Switch
              value={fireworks}
              onValueChange={setFireworks}
              trackColor={{ false: C.border, true: C.primaryLight }}
              thumbColor={fireworks ? C.primary : C.textMuted}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer buttons */}
      <View style={[styles.footer, { backgroundColor: C.bgApp, borderTopColor: C.border }]}>
        <TouchableOpacity
          style={[styles.cancelBtn, { borderColor: C.border, backgroundColor: C.bgCard }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={[styles.cancelBtnText, { color: C.textMuted }]}>Huỷ bỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: C.primary }]}
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
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  backBtn: { fontSize: 24, fontWeight: '700' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  headerSubtitle: { fontSize: 12, marginTop: 2 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  sectionTitle2: {
    fontSize: 16,
    fontWeight: '800',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 20,
  },
  masterToggleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  masterToggleLabel: { fontSize: 13, fontWeight: '700' },

  card: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  divider: { height: 1, marginHorizontal: 16 },

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerIcon: { fontSize: 20, fontWeight: '900' },
  powerInfo: { flex: 1 },
  powerTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  powerDesc: { fontSize: 12, lineHeight: 16 },
  setupBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  setupBtnText: { fontSize: 12, fontWeight: '700' },

  memeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    gap: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  memeEmoji: { fontSize: 28 },
  memeInfo: { flex: 1 },
  memeTitle: { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  memeBadge: { fontSize: 12 },
  memeCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memeCheckText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  addMemeBtn: {
    marginHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    paddingVertical: 14,
    alignItems: 'center',
  },
  addMemeBtnText: { fontSize: 14, fontWeight: '700' },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLabel: { fontSize: 14, fontWeight: '700' },
  settingSubLabel: { fontSize: 12, marginTop: 2 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
  },
  dropdownText: { fontSize: 13, fontWeight: '600' },
  dropdownArrow: { fontSize: 12 },

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
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    height: 6,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    top: -6,
    marginLeft: -9,
    elevation: 2,
  },

  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderTopWidth: 1,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  cancelBtnText: { fontSize: 15, fontWeight: '700' },
  saveBtn: {
    flex: 2,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 4,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '900' },
});
