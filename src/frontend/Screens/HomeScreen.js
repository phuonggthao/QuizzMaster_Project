import React, { useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    SafeAreaView, StatusBar, Dimensions, Animated
} from 'react-native';
import { Colors } from '../Styles/Colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.78;
const CARD_GAP = 16;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

const GAMES_LIST = [
    {
        id: '1', title: 'Trắc Nghiệm', emoji: '🧠', type: 'Quiz',
        desc: 'Chọn 1 đáp án đúng trong 4 lựa chọn. Nhanh tay nào!',
        color: '#6C63FF', badge: 'PHỔ BIẾN',
    },
    {
        id: '2', title: 'Ghép Cặp', emoji: '🖼️', type: 'Matching',
        desc: 'Tìm và ghép các cặp thẻ bài trùng khớp với nhau.',
        color: '#0891b2', badge: 'MỚI',
    },
    {
        id: '3', title: 'Số May Mắn', emoji: '🎲', type: 'LuckyNumber',
        desc: 'Thử thách vận may — đoán con số may mắn hôm nay!',
        color: '#d97706', badge: 'VUI',
    },
    {
        id: '4', title: 'Flashcard', emoji: '🎴', type: 'Flashcard',
        desc: 'Lật thẻ học tập thông minh để ghi nhớ kiến thức.',
        color: '#059669', badge: 'HỌC TẬP',
    },
    {
        id: '5', title: 'Từ Xáo Trộn', emoji: '🧩', type: 'WordScramble',
        desc: 'Sắp xếp lại các chữ cái bị hoán vị thành từ đúng.',
        color: '#dc2626', badge: 'THÁCH THỨC',
    },
    {
        id: '6', title: 'Hộp Quà Bí Ẩn', emoji: '🎁', type: 'OpenBox',
        desc: 'Chọn ngẫu nhiên hộp quà — bên trong là điều bất ngờ!',
        color: '#7c3aed', badge: 'BẤT NGỜ',
    },
    {
        id: '7', title: 'Nhìn Hình Đoán Chữ', emoji: '🎤', type: 'PictureQuiz',
        desc: 'Quan sát hình ảnh và gõ đúng từ khóa bí ẩn.',
        color: '#0891b2', badge: 'SÁNG TẠO',
    },
    {
        id: '8', title: 'Đúng hay Sai', emoji: '⚖️', type: 'TrueFalse',
        desc: 'Đưa ra quyết định thật nhanh — Đúng hay Sai?',
        color: '#d97706', badge: 'NHANH TRÍ',
    },
    {
        id: '9', title: 'Vòng Quay', emoji: '🎡', type: 'SimpleSpin',
        desc: 'Quay vòng tròn kịch tính và nhận thử thách ngẫu nhiên.',
        color: '#059669', badge: 'MAY MẮN',
    },
    {
        id: '10', title: 'Tìm Hình Khớp', emoji: '🎯', type: 'FindMatch',
        desc: 'So khớp đối tượng được chọn với hình mục tiêu.',
        color: '#dc2626', badge: 'QUAN SÁT',
    },
];

export default function HomeScreen({ navigation }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const handleSelectGame = (gameType) => {
        navigation.navigate('Quiz', { gameType });
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
        }
    }).current;

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

    const renderCard = ({ item, index }) => {
        const inputRange = [
            (index - 1) * (CARD_WIDTH + CARD_GAP),
            index * (CARD_WIDTH + CARD_GAP),
            (index + 1) * (CARD_WIDTH + CARD_GAP),
        ];
        const scale = scrollX.interpolate({
            inputRange, outputRange: [0.9, 1, 0.9], extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
            inputRange, outputRange: [0.65, 1, 0.65], extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.cardWrapper, { transform: [{ scale }], opacity }]}>
                <TouchableOpacity
                    style={[styles.card, { backgroundColor: item.color }]}
                    onPress={() => handleSelectGame(item.type)}
                    activeOpacity={0.92}
                >
                    {/* Badge */}
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>

                    {/* Số thứ tự */}
                    <View style={styles.cardNumber}>
                        <Text style={styles.cardNumberText}>{index + 1}/{GAMES_LIST.length}</Text>
                    </View>

                    {/* Emoji */}
                    <View style={styles.emojiContainer}>
                        <Text style={styles.bigEmoji}>{item.emoji}</Text>
                    </View>

                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDesc}>{item.desc}</Text>

                    {/* Nút chơi */}
                    <TouchableOpacity
                        style={styles.playBtn}
                        onPress={() => handleSelectGame(item.type)}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.playBtnText}>⚡ Chơi ngay</Text>
                    </TouchableOpacity>

                    {/* Decoration */}
                    <View style={[styles.decorCircle, styles.decorCircle1]} />
                    <View style={[styles.decorCircle, styles.decorCircle2]} />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.bgApp} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Chọn Trò Chơi 🚀</Text>
                    <Text style={styles.headerSub}>Vuốt ngang để xem tất cả {GAMES_LIST.length} trò chơi</Text>
                </View>
                <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>{GAMES_LIST.length} trò</Text>
                </View>
            </View>

            {/* Horizontal Pager */}
            <Animated.FlatList
                ref={flatListRef}
                data={GAMES_LIST}
                keyExtractor={(item) => item.id}
                renderItem={renderCard}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + CARD_GAP}
                snapToAlignment="center"
                decelerationRate="fast"
                contentContainerStyle={styles.listContent}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />

            {/* Dots */}
            <View style={styles.dotsRow}>
                {GAMES_LIST.map((item, index) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => flatListRef.current?.scrollToIndex({ index, animated: true })}
                    >
                        <View style={[
                            styles.dot,
                            index === activeIndex && [styles.dotActive, { backgroundColor: GAMES_LIST[activeIndex].color }]
                        ]} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Active label */}
            <View style={styles.activeLabel}>
                <Text style={styles.activeLabelEmoji}>{GAMES_LIST[activeIndex].emoji}</Text>
                <Text style={[styles.activeLabelText, { color: GAMES_LIST[activeIndex].color }]}>
                    {GAMES_LIST[activeIndex].title}
                </Text>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgApp },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 26, fontWeight: '900',
        color: Colors.textPrimary, letterSpacing: 0.3,
    },
    headerSub: { fontSize: 13, color: Colors.textMuted, marginTop: 3 },
    headerBadge: {
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: 20,
    },
    headerBadgeText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },

    // List
    listContent: { paddingHorizontal: SIDE_PADDING, paddingVertical: 8 },
    cardWrapper: { width: CARD_WIDTH, marginRight: CARD_GAP },
    card: {
        width: CARD_WIDTH,
        height: SCREEN_HEIGHT * 0.46,
        borderRadius: 28, padding: 28,
        justifyContent: 'center', alignItems: 'center',
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25, shadowRadius: 14,
    },

    // Badge trên card
    badge: {
        position: 'absolute', top: 18, left: 18,
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },

    // Số thứ tự
    cardNumber: {
        position: 'absolute', top: 18, right: 18,
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: 20,
    },
    cardNumberText: { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '700' },

    // Emoji
    emojiContainer: {
        width: 96, height: 96, borderRadius: 48,
        backgroundColor: 'rgba(255,255,255,0.22)',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 18,
    },
    bigEmoji: { fontSize: 48 },

    cardTitle: {
        fontSize: 24, fontWeight: '900', color: '#fff',
        textAlign: 'center', marginBottom: 10, letterSpacing: 0.2,
    },
    cardDesc: {
        fontSize: 13, color: 'rgba(255,255,255,0.82)',
        textAlign: 'center', lineHeight: 19,
        marginBottom: 24, paddingHorizontal: 8,
    },

    // Play button
    playBtn: {
        backgroundColor: 'rgba(255,255,255,0.22)',
        paddingHorizontal: 28, paddingVertical: 13,
        borderRadius: 50,
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)',
    },
    playBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

    // Decoration
    decorCircle: {
        position: 'absolute', borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    decorCircle1: { width: 180, height: 180, top: -60, left: -60 },
    decorCircle2: { width: 120, height: 120, bottom: -30, right: -30 },

    // Dots
    dotsRow: {
        flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', marginTop: 18, gap: 6,
    },
    dot: {
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: Colors.border,
    },
    dotActive: { width: 24, height: 8, borderRadius: 4 },

    // Active label
    activeLabel: {
        flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', marginTop: 12, gap: 8,
    },
    activeLabelEmoji: { fontSize: 20 },
    activeLabelText: { fontSize: 16, fontWeight: '800' },
});
