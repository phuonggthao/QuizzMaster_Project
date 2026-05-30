import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function QuestionTypeScreen({ navigation }) {
  const [selectedTypes, setSelectedTypes] = useState(['1']);
  const { isDark, theme: C } = useTheme();

  const QUESTION_TYPES = [
    {
      id: '1',
      emoji: '🎮',
      title: 'Trắc nghiệm',
      desc: 'Học sinh chọn một hoặc nhiều đáp án từ danh sách lựa chọn có sẵn.',
      badge: 'PHỔ BIẾN',
      badgeColor: C.primary,
      badgeBg: C.primaryLight,
    },
    {
      id: '2',
      emoji: '📝',
      title: 'Điền vào chỗ trống',
      desc: 'Học sinh tự nhập câu trả lời ngắn vào ô trống được cung cấp.',
      badge: null,
    },
    {
      id: '3',
      emoji: '💬',
      title: 'Câu hỏi mở',
      desc: 'Khuyến khích học sinh trình bày quan điểm và suy nghĩ cá nhân.',
      badge: null,
    },
    {
      id: '4',
      emoji: '📊',
      title: 'Khảo sát',
      desc: 'Thu thập ý kiến phản hồi từ học sinh, không có đáp án đúng/sai.',
      badge: null,
    },
    {
      id: '5',
      emoji: '🎨',
      title: 'Vẽ',
      desc: 'Yêu cầu học sinh minh họa câu trả lời bằng hình vẽ trực tiếp.',
      badge: null,
    },
    {
      id: '6',
      emoji: '🔤',
      title: 'Sắp xếp chữ tự',
      desc: 'Kéo và thả các mục để sắp xếp theo thứ tự đúng.',
      badge: null,
    },
  ];

  const toggleType = (id) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    navigation.navigate('Admin');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bgApp }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgApp} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={[styles.closeBtn, { color: C.textMuted }]}>✕</Text>
        </TouchableOpacity>
        <Text style={[styles.headerLogo, { color: C.primary }]}>QuizMates</Text>
        <View style={styles.draftBadge}>
          <Text style={styles.draftBadgeText}>Bản nháp</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, { color: C.primary }]}>25% Hoàn thành</Text>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: C.border }]}>
          <View style={[styles.progressBarFill, { backgroundColor: C.primary }]} />
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={[styles.pageTitle, { color: C.textPrimary }]}>Các loại câu hỏi đa dạng</Text>
        <Text style={[styles.pageSubtitle, { color: C.textMuted }]}>
          Chọn loại câu hỏi phù hợp để tạo bài kiểm tra hấp dẫn cho học sinh
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {QUESTION_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type.id);
          return (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                { backgroundColor: C.bgCard, borderColor: C.border },
                isSelected && { borderColor: C.primary, backgroundColor: C.primaryLight }
              ]}
              onPress={() => toggleType(type.id)}
              activeOpacity={0.85}
            >
              {/* Left: emoji */}
              <View style={[
                styles.typeIconWrap,
                { backgroundColor: C.bgApp },
                isSelected && styles.typeIconWrapSelected
              ]}>
                <Text style={styles.typeEmoji}>{type.emoji}</Text>
              </View>

              {/* Center: info */}
              <View style={styles.typeInfo}>
                <View style={styles.typeTitleRow}>
                  <Text style={[
                    styles.typeTitle,
                    { color: C.textPrimary },
                    isSelected && { color: C.primary }
                  ]}>
                    {type.title}
                  </Text>
                  {type.badge && (
                    <View style={[styles.typeBadge, { backgroundColor: type.badgeBg }]}>
                      <Text style={[styles.typeBadgeText, { color: type.badgeColor }]}>
                        {type.badge}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.typeDesc, { color: C.textMuted }]}>{type.desc}</Text>
              </View>

              {/* Right: check */}
              <View style={[
                styles.typeCheck,
                { borderColor: C.border },
                isSelected && { backgroundColor: C.primary, borderColor: C.primary }
              ]}>
                {isSelected && <Text style={styles.typeCheckMark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: C.bgApp, borderTopColor: C.border }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={[styles.backBtnText, { color: C.textMuted }]}>Quay lại</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sampleBtn, { borderColor: C.primary, backgroundColor: C.bgCard }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Quiz', { gameType: 'Quiz' })}
        >
          <Text style={[styles.sampleBtnText, { color: C.primary }]}>Dùng thử câu hỏi mẫu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: C.primary, shadowColor: C.primary }]}
          onPress={handleContinue}
          activeOpacity={0.88}
        >
          <Text style={styles.continueBtnText}>Tiếp tục →</Text>
          {selectedTypes.length > 0 && (
            <View style={styles.continueBadge}>
              <Text style={styles.continueBadgeText}>{selectedTypes.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  closeBtn: { fontSize: 20, fontWeight: '700' },
  headerLogo: { flex: 1, fontSize: 18, fontWeight: '900' },
  draftBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  draftBadgeText: { fontSize: 12, fontWeight: '700', color: '#D97706' },

  // Progress
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  progressLabel: { fontSize: 12, fontWeight: '700' },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    width: '25%',
    borderRadius: 3,
  },

  // Title
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },

  // Type card
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    gap: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  typeIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIconWrapSelected: {
    backgroundColor: 'rgba(108,99,255,0.15)',
  },
  typeEmoji: { fontSize: 26 },
  typeInfo: { flex: 1 },
  typeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 5,
  },
  typeTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  typeDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  typeCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeCheckMark: { color: '#fff', fontWeight: '900', fontSize: 14 },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
    borderTopWidth: 1,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backBtnText: { fontSize: 14, fontWeight: '700' },
  sampleBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  sampleBtnText: { fontSize: 12, fontWeight: '700' },
  continueBtn: {
    flex: 1.2,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  continueBtnText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  continueBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueBadgeText: { color: '#fff', fontWeight: '900', fontSize: 12 },
});
