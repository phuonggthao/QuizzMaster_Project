import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Thông báo", "Vui lòng nhập đủ tài khoản và mật khẩu!");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // 1. Lưu token và thông tin _id chuẩn MongoDB vào máy
                await AsyncStorage.setItem('userToken', data.token);
                if (data.user && data.user._id) {
                    await AsyncStorage.setItem('userId', data.user._id);
                }

                Alert.alert("Thành công", `Xin chào ${data.user.fullName}!`);
                
                // 2. PHÂN QUYỀN CHUYỂN MÀN HÌNH CHUẨN BACKEND:
                if (data.user.role === 'Admin') {
                    navigation.replace('Admin'); // Vào thẳng trang Quản trị câu hỏi
                } else {
                    navigation.replace('Home');  // User vào trang Menu 10 trò chơi & Hồ sơ
                }
            } else {
                Alert.alert("Thất bại", data.message || "Tài khoản hoặc mật khẩu sai!");
            }
        } catch (error) {
            Alert.alert("Lỗi kết nối", "Không thể kết nối đến máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>QuizzMaster 🎮</Text>
            
            <TextInput 
                style={styles.input} 
                placeholder="Tên đăng nhập" 
                value={username} 
                onChangeText={setUsername} 
                autoCapitalize="none" 
            />
            
            <TextInput 
                style={styles.input} 
                placeholder="Mật khẩu" 
                secureTextEntry 
                value={password} 
                onChangeText={setPassword} 
            />
            
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Đang xử lý..." : "Đăng Nhập"}</Text>
            </TouchableOpacity>
            {/* DÒNG MỚI CHÈN THÊM ĐỂ CHUYỂN SANG ĐĂNG KÝ: */}
            <TouchableOpacity style={{ marginTop: 25, alignItems: 'center' }} onPress={() => navigation.navigate('Register')}>
                <Text style={{ color: '#666', fontSize: 15, textDecorationLine: 'underline' }}>Chưa có tài khoản? Đăng ký tại đây</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#333' },
    input: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});