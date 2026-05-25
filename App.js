<<<<<<< HEAD
<<<<<<< Updated upstream
=======
import React from 'react';
import { Text } from 'react-native'; // 👈 ĐÃ BỔ SUNG: Thiếu cái này là bị lỗi Class/Function ngay!
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
>>>>>>> main
import { StatusBar } from 'expo-status-bar';

// Import các màn hình của Thảo
import LoginScreen from './src/frontend/Screens/LoginScreen';
import RegisterScreen from './src/frontend/Screens/RegisterScreen';
import HomeScreen from './src/frontend/Screens/HomeScreen';
import QuizScreen from './src/frontend/Screens/QuizScreen';
import AdminScreen from './src/frontend/Screens/AdminScreen';
import ProfileScreen from './src/frontend/Screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 🎮 ĐỊNH NGHĨA THANH TAB ĐIỀU HƯỚNG CHO USER NGƯỜI DÙNG
function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5, height: 60 },
        headerStyle: { backgroundColor: '#2196F3' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ 
          title: 'Trò Chơi 🎮',
          tabBarLabel: 'Trò Chơi',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🎮</Text> 
        }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ 
          title: 'Hồ Sơ Cá Nhân 👤',
          tabBarLabel: 'Hồ Sơ',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text> 
        }} 
      />
    </Tab.Navigator>
  );
}

<<<<<<< HEAD
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
=======
// 🚀 CẤU TRÚC ĐIỀU HƯỚNG GỐC CỦA TOÀN ỨNG DỤNG
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
>>>>>>> main
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#2196F3' },
          headerTintColor: '#fff',
<<<<<<< HEAD
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
=======
          headerTitleAlign: 'center',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Đăng Nhập Hệ Thống' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Đăng Ký Tài Khoản' }} />
        
        {/* Dùng cú pháp render hàm children để React Navigation xử lý mượt mà, không lo xung đột Class */}
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {(props) => <UserTabs {...props} />}
        </Stack.Screen>
        
        <Stack.Screen 
          name="Quiz" 
          component={QuizScreen} 
          options={({ route }) => ({ title: `Trò chơi ${route.params?.gameType || ''}` })} 
        />
        <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Quản Trị Hệ Thống', headerLeft: () => null }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
>>>>>>> main
