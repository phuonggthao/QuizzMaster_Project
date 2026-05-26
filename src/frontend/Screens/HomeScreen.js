import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Card, Button } from 'react-native-paper'; // Import từ react-native-paper

const GAMES_LIST = [
    { id: '1', title: 'Trắc Nghiệm', type: 'Quiz', desc: 'Chọn đáp án đúng' },
    { id: '2', title: 'Ghép Cặp', type: 'Matching', desc: 'Tìm cặp trùng khớp' },
    { id: '3', title: 'Vòng Quay', type: 'LuckyNumber', desc: 'Thử thách vận may' },
    { id: '4', title: 'Flashcards', type: 'Flashcard', desc: 'Ghi nhớ thông minh' },
    { id: '5', title: 'Từ Xáo Trộn', type: 'WordScramble', desc: 'Sắp xếp chữ cái' },
    { id: '6', title: 'Hộp Bí Ẩn', type: 'OpenBox', desc: 'Chọn quà may mắn' },
    { id: '7', title: 'Đoán Hình', type: 'PictureQuiz', desc: 'Nhìn hình đoán chữ' },
    { id: '8', title: 'Đúng/Sai', type: 'TrueFalse', desc: 'Quyết định nhanh' },
    { id: '9', title: 'Vòng Quay', type: 'SimpleSpin', desc: 'Quay nhận thử thách' },
    { id: '10', title: 'Tìm Hình', type: 'FindMatch', desc: 'So khớp đối tượng' },
];

export default function HomeScreen({ navigation }) {

    const renderGameItem = ({ item }) => (
        <Card style={styles.gameCard} onPress={() => navigation.navigate('Quiz', { gameType: item.type })}>
            {/* Bạn có thể thay thế Card.Cover bằng một icon hoặc hình minh họa riêng */}
            <Card.Content>
                <Text style={styles.gameTitle}>{item.title}</Text>
                <Text style={styles.gameDesc}>{item.desc}</Text>
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => navigation.navigate('Quiz', { gameType: item.type })}>
                    Chơi
                </Button>
            </Card.Actions>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Sẵn sàng chưa Thảo? 🚀</Text>
            </View>

            <FlatList
                data={GAMES_LIST}
                renderItem={renderGameItem}
                keyExtractor={(item) => item.id}
                numColumns={2} // Thiết lập Grid 2 cột
                columnWrapperStyle={styles.row} // Tạo khoảng cách giữa các cột
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 10 },
    header: { marginTop: 20, marginBottom: 15, paddingLeft: 10 },
    welcomeText: { fontSize: 20, fontWeight: 'bold', color: '#000080' },
    row: { flex: 1, justifyContent: 'space-around' },
    gameCard: {
        width: '46%', // Chiếm gần nửa màn hình
        margin: 8,
        backgroundColor: '#fff',
    },
    gameTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 5 },
    gameDesc: { fontSize: 11, color: '#666', marginBottom: 10 },
});