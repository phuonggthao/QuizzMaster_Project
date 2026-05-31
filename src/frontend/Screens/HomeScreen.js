import React, { useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList, Dimensions, Animated
} from 'react-native';
import { Colors } from '../Styles/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.78;
const CARD_GAP = 16;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 3 ;

const GAMES_LIST = [
    {
        id: '1', title: 'Trắc Nghiệm', emoji: '🧠', type: 'Quiz',
        desc: 'Chọn 1 đáp án đúng trong 4 lựa chọn. Nhanh tay nào!',
        color: '#7c3aed', colorLight: '#ede9fe',
    },
    {
        id: '2', title: 'Ghép Cặp', emoji: '🖼️', type: 'Matching',
        desc: 'Tìm và ghép các cặp thẻ bài trùng khớp với nhau.',
        color: '#0891b2', colorLight: '#e0f2fe',
    },
    {
        id: '3', title: 'Số May Mắn', emoji: '🎲', type: 'LuckyNumber',
        desc: 'Thử thách vận may — đoán con số may mắn hôm nay!',
        color: '#d97706', colorLight: '#fef3c7',
    },
    {
        id: '4', title: 'Flashcard', emoji: '🎴', type: 'Flashcard',
        desc: 'Lật thẻ học tập thông minh để ghi nhớ kiến thức.',
        color: '#059669', colorLight: '#d1fae5',
    },
    {
        id: '5', title: 'Từ Xáo Trộn', emoji: '🧩', type: 'WordScramble',
        desc: 'Sắp xếp lại các chữ cái bị hoán vị thành từ đúng.',
        color: '#dc2626', colorLight: '#fee2e2',
    },
    {
        id: '6', title: 'Hộp Quà Bí Ẩn', emoji: '🎁', type: 'OpenBox',
        desc: 'Chọn ngẫu nhiên hộp quà — bên trong là điều bất ngờ!',
        color: '#7c3aed', colorLight: '#ede9fe',
    },
    {
        id: '7', title: 'Nhìn Hình Đoán Chữ', emoji: '🎤', type: 'PictureQuiz',
        desc: 'Quan sát hình ảnh và gõ đúng từ khóa bí ẩn.',
        color: '#0891b2', colorLight: '#e0f2fe',
    },
    {
        id: '8', title: 'Đúng hay Sai', emoji: '⚖️', type: 'TrueFalse',
        desc: 'Đưa ra quyết định thật nhanh — Đúng hay Sai?',
        color: '#d97706', colorLight: '#fef3c7',
    },
    {
        id: '9', title: 'Vòng Quay', emoji: '🎡', type: 'SimpleSpin',
        desc: 'Quay vòng tròn kịch tính và nhận thử thách ngẫu nhiên.',
        color: '#059669', colorLight: '#d1fae5',
    },
    {
        id: '10', title: 'Tìm Hình Khớp', emoji: '🎯', type: 'FindMatch',
        desc: 'So khớp đối tượng được chọn với hình mục tiêu.',
        color: '#dc2626', colorLight: '#fee2e2',
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

        const cardColor = Colors.cardTones[index % Colors.cardTones.length];
        const inputRange = [
            (index - 1) * (CARD_WIDTH + CARD_GAP),
            index * (CARD_WIDTH + CARD_GAP),
            (index + 1) * (CARD_WIDTH + CARD_GAP),
        ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.88, 1, 0.88],
            extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.cardWrapper, { transform: [{ scale }], opacity }]}>
            
            <TouchableOpacity
            
                // Dùng cardColor vừa lấy ở trên
                style={[styles.card, { backgroundColor: cardColor }]}
                onPress={() => handleSelectGame(item.type)}
                activeOpacity={0.9}

                
            >
                    {/* Số thứ tự */}
                    <View style={styles.cardNumber}>
                        <Text style={styles.cardNumberText}>{index + 1}/{GAMES_LIST.length}</Text>
                    </View>

                    {/* Emoji lớn */}
                    <View style={styles.emojiContainer}>
                        <Text style={styles.bigEmoji}>{item.emoji}</Text>
                    </View>

                    {/* Tên trò chơi */}
                    <Text style={styles.cardTitle}>{item.title}</Text>

                    {/* Mô tả */}
                    <Text style={styles.cardDesc}>{item.desc}</Text>

                    {/* Nút chơi */}
                    <TouchableOpacity
                        style={styles.playBtn}
                        onPress={() => handleSelectGame(item.type)}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.playBtnText}>Chơi ngay  ▶</Text>
                    {/* Lớp gương phản chiếu (Thêm cái này vào) */}
                    <View style={{
                        position: 'absolute',
                        top: -50,
                        left: -50,
                        width: CARD_WIDTH,
                        height: CARD_WIDTH,
                        borderRadius: CARD_WIDTH / 2,
                        backgroundColor: 'rgba(166, 158, 158, 0.28)',
                        transform: [{ scale: 1.5 }],
                    }} />

                    
                    
                    </TouchableOpacity>
                    
                    {/* Lớp gương phản chiếu (Thêm cái này vào) */}
                    <View style={{
                        position: 'absolute',
                        top: -50,
                        left: -50,
                        width: CARD_WIDTH,
                        height: CARD_WIDTH,
                        borderRadius: CARD_WIDTH / 2,
                        backgroundColor: 'rgba(23, 181, 34, 0.1)',
                        transform: [{ scale: 1.5 }],
                    }} />
                   
                        {/* VIỀN SÁNG PHÍA TRÊN TẠO CẢM GIÁC CHIỀU CAO (3D) */}
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '50%',
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            borderTopWidth: 2,
                            borderColor: 'rgba(88, 200, 170, 0.3)',
                        }} />
                        
                        {/* Nội dung bên trong */}
                        {/* ... */}
                   
                    {/* Decoration circles */}
                    <View style={[styles.decorCircle, styles.decorCircle1]} />
                    <View style={[styles.decorCircle, styles.decorCircle2]} />

                    
                </TouchableOpacity>
                
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Khám Phá Tri Thức</Text>
                <Text style={styles.headerSub}>Thử thách bản thân qua từng câu hỏi thú vị!</Text>
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
                contentContainerStyle={{ paddingHorizontal: SIDE_PADDING,}}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />

            {/* Dot indicators */}
            <View style={styles.dotsRow}>
                {GAMES_LIST.map((item, index) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => {
                            flatListRef.current?.scrollToIndex({ index, animated: true });
                        }}
                    >
                        <Animated.View
                            style={[
                                styles.dot,
                                index === activeIndex && [
                                    styles.dotActive,
                                    { backgroundColor: GAMES_LIST[activeIndex].color }
                                ]
                            ]}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tên trò chơi đang active */}
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
    container: {
        flex: 1,
        backgroundColor: Colors.bgDark,
    },
    header: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center', // Thêm dòng này để căn giữa
    justifyContent: 'center',
},
headerTitle: {
    fontSize: 28, 
    fontWeight: '900',
    color: Colors.textLight, 
    letterSpacing: 0.5,
    textAlign: 'center', // Đảm bảo chữ nằm giữa
},
headerSub: {
    fontSize: 14, 
    color: Colors.textMuted, 
    marginTop: 8,
    textAlign: 'center', // Đảm bảo chữ nằm giữa
},

    // List
    listContent: {
        paddingHorizontal: SIDE_PADDING,
        paddingVertical: 8,
    },
    cardWrapper: {
        width: CARD_WIDTH,
       marginHorizontal: CARD_GAP /3,
    },
    //card
    card: {
    width: CARD_WIDTH,
    height: SCREEN_HEIGHT * 0.48,
    borderRadius: 32,
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    
    // Hiệu ứng kính (Glassmorphism)
    backgroundColor: 'rgba(169, 58, 114, 0.62)', // Trong suốt nhẹ
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4', // Viền sáng bóng
    //borderBottomColor: 'rgba(182, 166, 166, 0.87)', // Viền dưới tối
    
    // Đổ bóng sâu
    elevation: 20,
    shadowColor: '#c91ca3',
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    },

    // Card number badge
    cardNumber: {
        position: 'absolute', top: 18, right: 18,
        backgroundColor: 'rgba(227, 97, 97, 0.25)',
        paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: 20,
    },
    cardNumberText: {
        color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700',
    },

    // Emoji
    emojiContainer: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 20,
    },
    bigEmoji: { fontSize: 52 },

    // Text
    cardTitle: {
        fontSize: 26, fontWeight: '900',
        color: '#ffffff', textAlign: 'center',
        marginBottom: 10, letterSpacing: 0.3,
    },
    cardDesc: {
        fontSize: 14, color: 'rgb(255, 255, 255)',
        textAlign: 'center', lineHeight: 20,
        marginBottom: 28, paddingHorizontal: 8,
    },

    // Play button
    playBtn: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 32, paddingVertical: 14,
        borderRadius: 50,
        borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
    },
    playBtnText: {
        color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5,
    },

    // Decoration
    decorCircle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(221, 125, 200, 0.3)',
    },
    decorCircle1: {
        width: 180, height: 180,
        top: -60, left: -60,
    },
    decorCircle2: {
        width: 120, height: 120,
        bottom: -30, right: -30,
    },

    // Dots
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        gap: 6,
    },
    dot: {
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: 'rgba(251, 0, 13, 0.79)',
    },
    dotActive: {
        width: 24, height: 8, borderRadius: 4,
    },

    // Active label
    activeLabel: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 14,
        gap: 8,
    },
    activeLabelEmoji: { fontSize: 20 },
    activeLabelText: {
        fontSize: 17, fontWeight: '800',
    },
});
