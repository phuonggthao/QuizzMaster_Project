<<<<<<< Updated upstream
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
=======
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import tất cả màn hình
import LoginScreen from './src/frontend/Screens/LoginScreen';
import RegisterScreen from './src/frontend/Screens/RegisterScreen';
import HomeScreen from './src/frontend/Screens/HomeScreen';
import QuizScreen from './src/frontend/Screens/QuizScreen';
import ProfileScreen from './src/frontend/Screens/ProfileScreen';
import AdminScreen from './src/frontend/Screens/AdminScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#2196F3' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* Màn hình xác thực */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'QuizzMaster 🎮', headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Đăng Ký Tài Khoản' }}
        />

        {/* Màn hình chính */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Chọn Trò Chơi', headerBackVisible: false }}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={({ route }) => ({ title: route.params?.gameType || 'Trò Chơi' })}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Hồ Sơ Cá Nhân' }}
        />

        {/* Màn hình Admin */}
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ title: '🛠️ Quản Trị', headerBackVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
>>>>>>> Stashed changes
