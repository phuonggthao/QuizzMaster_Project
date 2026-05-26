import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, RadioButton } from 'react-native-paper';

export default function QuizScreen({ route, navigation }) {
  // Lấy gameType được truyền từ HomeScreen
  const { gameType } = route.params;
  const [value, setValue] = useState('');

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Chủ đề: {gameType}</Text>
      <Text style={styles.question}>Câu hỏi mẫu: 2 + 2 bằng mấy?</Text>
      
      <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
        <View style={styles.option}>
          <RadioButton value="3" />
          <Text>3</Text>
        </View>
        <View style={styles.option}>
          <RadioButton value="4" />
          <Text>4</Text>
        </View>
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
  question: { marginVertical: 20, fontSize: 18, fontWeight: 'bold' },
  option: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  button: { marginTop: 20 },
  backButton: { marginTop: 10 }
});