import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/frontend/context/ThemeContext';

import LoginScreen from './src/frontend/Screens/LoginScreen';
import RegisterScreen from './src/frontend/Screens/RegisterScreen';
import HomeScreen from './src/frontend/Screens/HomeScreen';
import ExploreScreen from './src/frontend/Screens/ExploreScreen';
import ProfileScreen from './src/frontend/Screens/ProfileScreen';
import QuizScreen from './src/frontend/Screens/QuizScreen';
import LeaderboardScreen from './src/frontend/Screens/LeaderboardScreen';
import AdminScreen from './src/frontend/Screens/AdminScreen';
import LandingScreen from './src/frontend/Screens/LandingScreen';
import ManageScreen       from './src/frontend/Screens/ManageScreen';
import PowerUpsScreen     from './src/frontend/Screens/PowerUpsScreen';
import QuestionTypeScreen from './src/frontend/Screens/QuestionTypeScreen';
import ReportScreen       from './src/frontend/Screens/ReportScreen';
import LuckyNumberScreen  from './src/frontend/Screens/LuckyNumberScreen';
import CategoryScreen     from './src/frontend/Screens/CategoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login"       component={LoginScreen} />
          <Stack.Screen name="Register"    component={RegisterScreen} />
          <Stack.Screen name="Landing"     component={LandingScreen} />
          <Stack.Screen name="Home"        component={HomeScreen} />
          <Stack.Screen name="Explore"     component={ExploreScreen} />
          <Stack.Screen name="Profile"     component={ProfileScreen} />
          <Stack.Screen name="Quiz"        component={QuizScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="Admin"       component={AdminScreen} />
          <Stack.Screen name="Manage"       component={ManageScreen} />
          <Stack.Screen name="PowerUps"     component={PowerUpsScreen} />
          <Stack.Screen name="QuestionType" component={QuestionTypeScreen} />
          <Stack.Screen name="Report"       component={ReportScreen} />
          <Stack.Screen name="LuckyNumber"  component={LuckyNumberScreen} />
          <Stack.Screen name="Category"    component={CategoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
