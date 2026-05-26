import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, RadioButton } from 'react-native-paper';
import { getGameQuestions } from '../../backend/Service/gameLogicService';

export default function QuizScreen({ route, navigation }) {
  const { gameType } = route.params;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getGameQuestions(gameType);
        setQuestions(data);
      } catch (err) {
        console.error("Lỗi khi tải câu hỏi:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [gameType]);

  if (loading) return <ActivityIndicator size="large" style={styles.container} />;
  if (questions.length === 0) return <Text style={styles.centerText}>Không có câu hỏi nào cho {gameType}!</Text>;

  // Lấy câu hỏi đầu tiên trong danh sách
  const currentQuestion = questions[0];

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Chủ đề: {gameType}</Text>
      <Text style={styles.question}>{currentQuestion.content}</Text>
      
      <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
        {currentQuestion.options.map((option, index) => (
          <View key={index} style={styles.option}>
            <RadioButton value={option} />
            <Text>{option}</Text>
          </View>
        ))}
      </RadioButton.Group>

      <Button 
        mode="contained" 
        onPress={() => alert('Kết quả bạn chọn là: ' + value)}
        style={styles.button}
      >
        Kiểm tra đáp án
      </Button>

      <Button 
        mode="outlined" 
        onPress={() => navigation.goBack()} 
        style={styles.backButton}
      >
        Quay lại
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  centerText: { textAlign: 'center', marginTop: 50 },
  question: { marginVertical: 20, fontSize: 18, fontWeight: 'bold' },
  option: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  button: { marginTop: 20 },
  backButton: { marginTop: 10 }
});