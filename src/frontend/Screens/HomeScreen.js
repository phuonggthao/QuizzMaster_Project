import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

// Danh sách 10 trò chơi được ánh xạ chính xác theo hàm logic của Backend
const GAMES_LIST = [
    { id: '1', title: '🧠 Trắc Nghiệm Lựa Chọn', type: 'Quiz', desc: 'Chọn 1 đáp án chính xác trong các phương án.' },
    { id: '2', title: '🖼️ Ghép Cặp Thẻ Bài', type: 'Matching', desc: 'Tìm và lật các cặp thẻ bài trùng khớp nhau.' },
    { id: '3', title: '🎲 Vòng Quay Số May Mắn', type: 'LuckyNumber', desc: 'Thử thách vận may với các con số ngẫu nhiên.' },
    { id: '4', title: '🎴 Thẻ Bài Flashcards', type: 'Flashcard', desc: 'Lật thẻ thông minh để ghi nhớ kiến thức.' },
    { id: '5', title: '🧩 Từ Xáo Trộn', type: 'WordScramble', desc: 'Sắp xếp lại các chữ cái bị hoán vị thành từ đúng.' },
    { id: '6', title: '🎁 Hộp Quà Bí Ẩn', type: 'OpenBox', desc: 'Chọn ngẫu nhiên hộp quà chứa câu hỏi may mắn.' },
    { id: '7', title: '🎤 Nhìn Hình Đoán Chữ', type: 'PictureQuiz', desc: 'Quan sát hình ảnh minh họa và gõ từ khóa đúng.' },
    { id: '8', title: '⚖️ Đúng Hoặc Sai', type: 'TrueFalse', desc: 'Đưa ra quyết định thật nhanh Đúng hay Sai.' },
    { id: '9', title: '🎡 Vòng Quay Kịch Tính', type: 'SimpleSpin', desc: 'Quay vòng tròn tính góc dừng để nhận thử thách.' },
    { id: '10', title: '🎯 Tìm Hình Trùng Khớp', type: 'FindMatch', desc: 'So khớp đối tượng được chọn với hình mục tiêu.' },
];

export default function HomeScreen({ navigation }) {

    const handleSelectGame = (gameType) => {
        // Chuyển sang màn hình chơi game và gửi đúng từ khóa (type) xuống Backend để quét Database
        navigation.navigate('Quiz', { gameType: gameType });
    };

    const renderGameItem = ({ item }) => (
        <TouchableOpacity style={styles.gameCard} onPress={() => handleSelectGame(item.type)}>
            <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>{item.title}</Text>
                <Text style={styles.gameDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.arrowIcon}>➔</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Sẵn sàng chưa Thảo? 🚀</Text>
                <Text style={styles.subWelcomeText}>Hãy chọn 1 trong 10 thử thách của nhóm nhé:</Text>
            </View>

            <FlatList
                data={GAMES_LIST}
                keyExtractor={(item) => item.id}
                renderItem={renderGameItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 15 },
    header: { marginTop: 20, marginBottom: 15, paddingLeft: 5 },
    welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    subWelcomeText: { fontSize: 15, color: '#666', marginTop: 4 },
    gameCard: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    gameInfo: { flex: 1, paddingRight: 10 },
    gameTitle: { fontSize: 17, fontWeight: 'bold', color: '#2196F3' },
    gameDesc: { fontSize: 13, color: '#777', marginTop: 5, lineHeight: 18 },
    arrowIcon: { fontSize: 18, color: '#999', fontWeight: 'bold' }
});