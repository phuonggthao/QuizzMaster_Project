import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './src/frontend/context/ThemeContext';

import LoginScreen from './src/frontend/Screens/LoginScreen';
import RegisterScreen from './src/frontend/Screens/RegisterScreen';
import HomeScreen from './src/frontend/Screens/HomeScreen';
import ExploreScreen from './src/frontend/Screens/ExploreScreen';
import ProfileScreen from './src/frontend/Screens/ProfileScreen';
import QuizScreen from './src/frontend/Screens/QuizScreen';
import LeaderboardScreen from './src/frontend/Screens/LeaderboardScreen';
import AdminScreen from './src/frontend/Screens/AdminScreen';
import LandingScreen from './src/frontend/Screens/LandingScreen';
import ManageScreen from './src/frontend/Screens/ManageScreen';
import PowerUpsScreen from './src/frontend/Screens/PowerUpsScreen';
import QuestionTypeScreen from './src/frontend/Screens/QuestionTypeScreen';
import ReportScreen from './src/frontend/Screens/ReportScreen';
import LuckyNumberScreen from './src/frontend/Screens/LuckyNumberScreen';
import CategoryScreen from './src/frontend/Screens/CategoryScreen';
import GlobalLeaderboardScreen from './src/frontend/Screens/GlobalLeaderboardScreen';

const Stack = createNativeStackNavigator();

// AppNavigator nằm bên trong ThemeProvider để dùng được useTheme
function AppNavigator({ navigationRef }) {
  const { authState, setAuthState, setIsAdmin } = useTheme();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');

        if (!token) {
          setIsAdmin(false);
          setAuthState('none');
          return;
        }

        if (token === 'GUEST') {
          setIsAdmin(false);
          setAuthState('guest');
          return;
        }

        // Có token thật → đọc userInfo đã lưu để lấy role
        const raw = await AsyncStorage.getItem('userInfo');
        if (raw) {
          const user = JSON.parse(raw);
          const isAdminUser = user?.role === 'Admin';
          setIsAdmin(isAdminUser);
          setAuthState(isAdminUser ? 'admin' : 'user');
        } else {
          setIsAdmin(false);
          setAuthState('none');
        }
      } catch {
        setIsAdmin(false);
        setAuthState('none');
      }
    };

    checkAuth();
  }, []);

  // Navigate đến đúng màn hình mỗi khi authState thay đổi
  useEffect(() => {
    if (authState === 'loading') return;

    const doNavigate = () => {
      const nav = navigationRef?.current;
      if (!nav || !nav.isReady()) return false;

      if (authState === 'none') {
        nav.reset({ index: 0, routes: [{ name: 'Login' }] });
      } else if (authState === 'admin') {
        nav.reset({ index: 0, routes: [{ name: 'Manage' }] });
      } else {
        // 'user' hoặc 'guest'
        nav.reset({ index: 0, routes: [{ name: 'Landing' }] });
      }
      return true;
    };

    // Thử ngay, nếu navigator chưa ready thì thử lại sau 150ms
    if (!doNavigate()) {
      const timer = setTimeout(doNavigate, 150);
      return () => clearTimeout(timer);
    }
  }, [authState]);

  // Hiển thị màn hình chờ trong lúc kiểm tra token
  if (authState === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F7FF' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        {/* Auth screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* App screens */}
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Manage" component={ManageScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="PowerUps" component={PowerUpsScreen} />
        <Stack.Screen name="QuestionType" component={QuestionTypeScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="LuckyNumber" component={LuckyNumberScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="GlobalLeaderboard" component={GlobalLeaderboardScreen} />
      </Stack.Navigator>
    </>
  );
}

export default function App() {
  const navigationRef = useRef(null);

  return (
    <ThemeProvider>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator navigationRef={navigationRef} />
      </NavigationContainer>
    </ThemeProvider>
  );
}
