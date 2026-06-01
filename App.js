import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/frontend/context/ThemeContext';

// Import các màn hình
import LoginScreen from './src/frontend/Screens/LoginScreen';
import RegisterScreen from './src/frontend/Screens/RegisterScreen';
import HomeScreen from './src/frontend/Screens/HomeScreen';
import QuizScreen from './src/frontend/Screens/QuizScreen';
import AdminScreen from './src/frontend/Screens/AdminScreen';
import ProfileScreen from './src/frontend/Screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 🎮 THANH TAB ĐIỀU HƯỚNG CHO USER
function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#8b5cf6',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarStyle: { paddingBottom: 5, height: 60, backgroundColor: '#3d1a78', borderTopColor: 'rgba(255,255,255,0.1)' },
        headerStyle: { backgroundColor: '#3d1a78' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Quizz Master 🎮',
          tabBarLabel: 'Trò Chơi',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🎮</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Hồ Sơ Cá Nhân 👤',
          tabBarLabel: 'Hồ Sơ',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

// 🚀 CẤU TRÚC ĐIỀU HƯỚNG GỐC
export default function App() {
  return (
    <ThemeProvider>

    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#3d1a78' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Đăng Nhập Hệ Thống' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Đăng Ký Tài Khoản' }}
        />
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
        >
          {(props) => <UserTabs {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={({ route }) => ({ title: `Trò chơi ${route.params?.gameType || ''}` })}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ title: 'Quản Trị Hệ Thống', headerLeft: () => null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
}
