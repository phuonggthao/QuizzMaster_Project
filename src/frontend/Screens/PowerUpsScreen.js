import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, Switch, Alert,
  PanResponder, Platform, UIManager,
} from 'react-native';
import { useTheme, DEFAULT_POWER_UP_COUNTS } from '../context/ThemeContext';

// Bật LayoutAnimation trên Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Định nghĩa power-ups khớp với key trong ThemeContext
const POWER_ITEMS = [
  {
    id: 'doublePoints',
    emoji: '×2',
    title: 'Nhân đôi điểm',
    desc: 'Câu trả lời đúng tiếp theo được tính 20 điểm thay vì 10',
    maxCount: 3,
  },
  {
    id: 'freeze',
    emoji: '❄',
    title: 'Đóng băng',
    desc: 'Dừng đồng hồ đếm ngược trong 5 giây',
    maxCount: 3,
  },
  {
    id: 'eliminate',
    emoji: '✏',
    title: 'Cây bút thần',
    desc: 'Loại bỏ 2 đáp án sai, chỉ còn 2 lựa chọn (Quiz)',
    maxCount: 3,
  },
];

const MEME_SETS = [
  { id: '1', emoji: '🐶', title: 'Động vật hài hước', badge: 'Phổ biến nhất' },
  { id: '2', emoji: '🌌', title: 'Khám phá vũ trụ', badge: '24 hình ảnh' },
];

const MUSIC_OPTIONS = ['Lofi Học Tập', 'Nhạc Cổ Điển', 'Nhạc Thiên Nhiên', 'Không có nhạc'];

// ─── Slider component dùng PanResponder ───────────────────────────────────────
function VolumeSlider({ value, onChange, primaryColor, trackColor }) {
  const trackWidth = useRef(0);
  const currentValue = useRef(value);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        // Tính vị trí từ điểm chạm ban đầu
        if (trackWidth.current > 0) {
          const locationX = evt.nativeEvent.locationX;
          const newVal = Math.round(Math.min(100, Math.max(0, (locationX / trackWidth.current) * 100)));
          currentValue.current = newVal;
          onChange(newVal);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (trackWidth.current > 0) {
          const locationX = evt.nativeEvent.locationX;
          const newVal = Math.round(Math.min(100, Math.max(0, (locationX / trackWidth.current) * 100)));
          currentValue.current = newVal;
          onChange(newVal);
        }
      },
    })
  ).current;

  const fillPercent = Math.min(100, Math.max(0, value));

  return (
    <View style={sliderStyles.wrapper}>
      <Text style={sliderStyles.icon}>🔈</Text>
      <View
        style={[sliderStyles.track, { backgroundColor: trackColor }]}
        onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width; }}
        {...panResponder.panHandlers}
      >
        {/* Fill */}
        <View
          style={[
            sliderStyles.fill,
            { width: `${fillPercent}%`, backgroundColor: primaryColor },
          ]}
        />
        {/* Thumb — dùng left tính bằng số thực thay vì % string */}
        <View
          style={[
            sliderStyles.thumbContainer,
            { left: `${fillPercent}%` },
          ]}
        >
          <View style={[sliderStyles.thumb, { backgroundColor: primaryColor }]} />
        </View>
      </View>
      <Text style={sliderStyles.icon}>🔊</Text>
      <Text style={[sliderStyles.valueText, { color: primaryColor }]}>{fillPercent}%</Text>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  icon: { fontSize: 18 },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    position: 'relative',
    justifyContent: 'center',
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
  // Container căn giữa thumb theo chiều dọc, dùng translateX để offset đúng
  thumbContainer: {
    position: 'absolute',
    top: '50%',
    width: 0,
    alignItems: 'center',
    // translateY để căn giữa thumb (thumb cao 20px → -10)
    transform: [{ translateY: -10 }],
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  valueText: {
    fontSize: 12,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'right',
  },
});
// ─────────────────────────────────────────────────────────────────────────────

export default function PowerUpsScreen({ navigation }) {
  const {
    isDark, toggleTheme, theme: C,
    volume, setVolume,
    selectedMusic, setSelectedMusic,
    fireworks, setFireworks,
    musicEnabled, toggleMusic,
    powerUpsEnabled, setPowerUpsEnabled,
    powerUpCounts, setPowerUpCounts,
  } = useTheme();

  const [activeMeme, setActiveMeme] = useState('1');

  const handleSave = () => {
    Alert.alert('✅ Đã lưu', 'Cài đặt của bạn đã được lưu thành công.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  // Tăng/giảm số lượng power-up
  const adjustCount = (id, delta) => {
    setPowerUpCounts((prev) => {
      const max = POWER_ITEMS.find((p) => p.id === id)?.maxCount ?? 3;
      const next = Math.min(max, Math.max(0, (prev[id] ?? 0) + delta));
      return { ...prev, [id]: next };
    });
  };

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
              {powerUpsEnabled ? 'Đang kích hoạt' : 'Đã tắt'}
            </Text>
            <Switch
              value={powerUpsEnabled}
              onValueChange={setPowerUpsEnabled}
              trackColor={{ false: C.border, true: C.primaryLight }}
              thumbColor={powerUpsEnabled ? C.primary : C.textMuted}
            />
          </View>
        </View>

        <View style={[
          styles.card,
          { backgroundColor: C.bgCard, borderColor: C.border },
          !powerUpsEnabled && { opacity: 0.45 },
        ]}>
          {POWER_ITEMS.map((item, idx) => (
            <View key={item.id}>
              <View style={styles.powerItem}>
                {/* Icon */}
                <View style={[styles.powerIconWrap, { backgroundColor: C.primaryLight }]}>
                  <Text style={[styles.powerIcon, { color: C.primary }]}>{item.emoji}</Text>
                </View>

                {/* Info */}
                <View style={styles.powerInfo}>
                  <Text style={[styles.powerTitle, { color: C.textPrimary }]}>{item.title}</Text>
                  <Text style={[styles.powerDesc, { color: C.textMuted }]}>{item.desc}</Text>
                </View>

                {/* Stepper số lượng */}
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: C.border, backgroundColor: C.bgApp }]}
                    onPress={() => adjustCount(item.id, -1)}
                    disabled={!powerUpsEnabled || (powerUpCounts[item.id] ?? 0) <= 0}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.stepBtnText, { color: C.primary }]}>−</Text>
                  </TouchableOpacity>

                  <View style={[styles.stepCount, { backgroundColor: C.primaryLight }]}>
                    <Text style={[styles.stepCountText, { color: C.primary }]}>
                      {powerUpCounts[item.id] ?? DEFAULT_POWER_UP_COUNTS[item.id]}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: C.border, backgroundColor: C.bgApp }]}
                    onPress={() => adjustCount(item.id, +1)}
                    disabled={!powerUpsEnabled || (powerUpCounts[item.id] ?? 0) >= item.maxCount}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.stepBtnText, { color: C.primary }]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {idx < POWER_ITEMS.length - 1 && (
                <View style={[styles.divider, { backgroundColor: C.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* Ghi chú */}
        <View style={[styles.noteBox, { backgroundColor: C.bgCard, borderColor: C.border, marginTop: 8 }]}>
          <Text style={[styles.noteText, { color: C.textMuted }]}>
            💡 Số lượng trên là số lần dùng mỗi vật phẩm trong <Text style={{ fontWeight: '700', color: C.primary }}>1 lượt chơi</Text>.
            Tối đa 3 lần mỗi loại.
          </Text>
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
          onPress={() =>
            Alert.alert('Thêm Meme', 'Tính năng thêm bộ Meme mới đang được phát triển.')
          }
        >
          <Text style={[styles.addMemeBtnText, { color: C.textMuted }]}>+ Thêm bộ Meme mới</Text>
        </TouchableOpacity>

        {/* Music & UI section */}
        <Text style={[styles.sectionTitle2, { color: C.textPrimary }]}>🎵 Âm nhạc & Giao diện</Text>

        <View style={[styles.card, { backgroundColor: C.bgCard, borderColor: C.border }]}>

          {/* Music master toggle */}
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingLabel, { color: C.textPrimary }]}>Nhạc nền</Text>
              <Text style={[styles.settingSubLabel, { color: C.textMuted }]}>
                {musicEnabled ? '🎵 Đang phát' : '🔇 Đã tắt'}
              </Text>
            </View>
            <Switch
              value={musicEnabled}
              onValueChange={toggleMusic}
              trackColor={{ false: C.border, true: C.primaryLight }}
              thumbColor={musicEnabled ? C.primary : C.textMuted}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: C.border }]} />

          {/* Music dropdown */}
          <View style={[styles.settingRow, !musicEnabled && { opacity: 0.4 }]}>
            <Text style={[styles.settingLabel, { color: C.textPrimary }]}>Nhạc nền buổi học</Text>
            <TouchableOpacity
              style={[styles.dropdown, { backgroundColor: C.bgApp, borderColor: C.border }]}
              activeOpacity={0.8}
              disabled={!musicEnabled}
              onPress={() =>
                Alert.alert('Nhạc nền', 'Chọn nhạc nền', [
                  ...MUSIC_OPTIONS.map((opt) => ({
                    text: opt === selectedMusic ? `✓ ${opt}` : opt,
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

          {/* Volume slider — có thể kéo được */}
          <View style={[styles.settingRow, { paddingBottom: 8 }, !musicEnabled && { opacity: 0.4 }]}>
            <Text style={[styles.settingLabel, { color: C.textPrimary }]}>Âm lượng</Text>
          </View>
          <View style={!musicEnabled && { opacity: 0.4 }}>
            <VolumeSlider
              value={volume}
              onChange={musicEnabled ? setVolume : () => {}}
              primaryColor={C.primary}
              trackColor={C.border}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: C.border }]} />

          {/* Dark mode toggle */}
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
                {fireworks ? '🎆 Pháo hoa & Confetti ON' : '🚫 Đã tắt'}
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

        {/* Note về nhạc nền */}
        <View style={[styles.noteBox, { backgroundColor: C.bgCard, borderColor: C.border }]}>
          <Text style={[styles.noteText, { color: C.textMuted }]}>
            💡 Nhạc phát từ Internet Archive (public domain). Cần kết nối mạng để stream.
            Nhạc sẽ tiếp tục phát khi bạn chuyển màn hình trong app.
          </Text>
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
          onPress={handleSave}
          activeOpacity={0.88}
        >
          <Text style={styles.saveBtnText}>💾 Lưu cài đặt</Text>
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

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: { fontSize: 18, fontWeight: '700', lineHeight: 22 },
  stepCount: {
    width: 32,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCountText: { fontSize: 15, fontWeight: '900' },

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

  noteBox: {
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  noteText: { fontSize: 12, lineHeight: 18 },

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
