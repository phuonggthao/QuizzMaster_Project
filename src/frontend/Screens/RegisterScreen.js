import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import BASE_URL from '../config';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !password || !fullName) {
            Alert.alert("Thông báo", "Thảo ơi, vui lòng nhập đầy đủ thông tin đăng ký nhé!");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, fullName })
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Thành công 🎉", "Tài khoản của bạn đã được tạo thành công trên MongoDB!", [
                    { text: "Đăng nhập ngay", onPress: () => navigation.navigate('Login') }
                ]);
            } else {
                Alert.alert("Thất bại", data.message || "Tên đăng nhập này đã tồn tại rồi!");
            }
        } catch (error) {
            Alert.alert("Lỗi kết nối", "Không thể kết nối đến máy chủ Backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Tạo Tài Khoản 🎮</Text>
            
            <TextInput 
                style={styles.input} 
                placeholder="Họ và tên của bạn" 
                value={fullName} 
                onChangeText={setFullName} 
            />

            <TextInput 
                style={styles.input} 
                placeholder="Tên đăng nhập (username)" 
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
            
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Đang xử lý..." : "Đăng Ký Ngay"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập tại đây</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#333' },
    input: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    button: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    linkButton: { marginTop: 25, alignItems: 'center' },
    linkText: { color: '#666', fontSize: 15, textDecorationLine: 'underline' }
});