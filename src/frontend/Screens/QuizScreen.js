import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function QuizScreen({ route, navigation }) {
  // Lấy gameType được truyền từ HomeScreen
  const { gameType } = route.params;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Đang chơi: {gameType}</Text>
      <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.button}>
        Quay lại
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: { marginTop: 20 },
});