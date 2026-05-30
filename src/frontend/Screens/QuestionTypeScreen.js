import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Colors } from '../Styles/Colors';

const QUESTION_TYPES = [
  {
    id: '1',
    emoji: '🎮',
    title: 'Trắc nghiệm',
    desc: 'Học sinh chọn một hoặc nhiều đáp án từ danh sách lựa chọn có sẵn.',
    badge: 'PHỔ BIẾN',
    badgeColor: Colors.primary,
    badgeBg: Colors.primaryLight,
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

export default function QuestionTypeScreen({ navigation }) {
  const [selectedTypes, setSelectedTypes] = useState(['1']);

  const toggleType = (id) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgApp} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerLogo}>QuizMates</Text>
        <View style={styles.draftBadge}>
          <Text style={styles.draftBadgeText}>Bản nháp</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>25% Hoàn thành</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>Các loại câu hỏi đa dạng</Text>
        <Text style={styles.pageSubtitle}>
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
              style={[styles.typeCard, isSelected && styles.typeCardSelected]}
              onPress={() => toggleType(type.id)}
              activeOpacity={0.85}
            >
              {/* Left: emoji */}
              <View style={[styles.typeIconWrap, isSelected && styles.typeIconWrapSelected]}>
                <Text style={styles.typeEmoji}>{type.emoji}</Text>
              </View>

              {/* Center: info */}
              <View style={styles.typeInfo}>
                <View style={styles.typeTitleRow}>
                  <Text style={[styles.typeTitle, isSelected && styles.typeTitleSelected]}>
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
                <Text style={styles.typeDesc}>{type.desc}</Text>
              </View>

              {/* Right: check */}
              <View style={[styles.typeCheck, isSelected && styles.typeCheckSelected]}>
                {isSelected && <Text style={styles.typeCheckMark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sampleBtn} activeOpacity={0.8} onPress={() => navigation.navigate('Quiz', { gameType: 'Quiz' })}>
          <Text style={styles.sampleBtnText}>Dùng thử câu hỏi mẫu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueBtn}
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
  container: { flex: 1, backgroundColor: Colors.bgApp },
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
  closeBtn: { fontSize: 20, color: Colors.textMuted, fontWeight: '700' },
  headerLogo: { flex: 1, fontSize: 18, fontWeight: '900', color: Colors.primary },
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
  progressLabel: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    width: '25%',
    backgroundColor: Colors.primary,
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
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },

  // Type card
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  typeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  typeIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.bgApp,
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
    color: Colors.textPrimary,
  },
  typeTitleSelected: { color: Colors.primary },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  typeDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 17,
  },
  typeCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeCheckSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeCheckMark: { color: '#fff', fontWeight: '900', fontSize: 14 },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
    backgroundColor: Colors.bgApp,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textMuted },
  sampleBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.bgCard,
  },
  sampleBtnText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  continueBtn: {
    flex: 1.2,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: Colors.primary,
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
