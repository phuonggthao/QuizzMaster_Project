import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './src/frontend/Screens/LoginScreen';
import RegisterScreen from './src/frontend/Screens/RegisterScreen';
import HomeScreen from './src/frontend/Screens/HomeScreen';
import ExploreScreen from './src/frontend/Screens/ExploreScreen';
import ProfileScreen from './src/frontend/Screens/ProfileScreen';
import QuizScreen from './src/frontend/Screens/QuizScreen';
import LeaderboardScreen from './src/frontend/Screens/LeaderboardScreen';
import AdminScreen from './src/frontend/Screens/AdminScreen';
import LandingScreen from './src/frontend/Screens/LandingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
