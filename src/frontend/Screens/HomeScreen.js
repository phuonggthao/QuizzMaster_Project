import React from 'react';
import { StyleSheet, View, FlatList, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';

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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Chọn trò chơi</Text>
      </View>

      <FlatList
        data={GAMES_LIST}
        keyExtractor={(item) => item.id}
        numColumns={2} // Grid 2 cột
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Card style={styles.card} elevation={2}>
            <Card.Content>
              <Title style={styles.cardTitle}>{item.title}</Title>
              <Paragraph style={styles.cardDesc}>{item.desc}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Quiz', { gameType: item.type })}
              >
                Chơi
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20 },
  title: { fontWeight: 'bold', color: '#000080' },
  row: { justifyContent: 'space-between', paddingHorizontal: 10 },
  card: { width: '47%', marginBottom: 15 },
  cardTitle: { fontSize: 14, fontWeight: 'bold' },
  cardDesc: { fontSize: 11, color: '#666' },
});