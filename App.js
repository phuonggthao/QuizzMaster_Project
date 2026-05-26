import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper'; // Cung cấp theme cho ứng dụng

import HomeScreen from './src/frontend/Screens/HomeScreen';
import QuizScreen from './src/frontend/Screens/QuizScreen'; // Bạn sẽ tạo file này ở bước sau

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'QuizzMaster' }} 
          />
          <Stack.Screen 
            name="Quiz" 
            component={QuizScreen} 
            options={{ title: 'Trò chơi' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}