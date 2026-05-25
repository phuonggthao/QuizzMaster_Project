import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    Alert, StyleSheet, KeyboardAvoidingView, Platform, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import { Colors } from '../Styles/Colors';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập tài khoản và mật khẩu!");
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
                await AsyncStorage.setItem('userToken', data.token);
                if (data.user?._id) await AsyncStorage.setItem('userId', data.user._id);
                if (data.user.role === 'Admin') {
                    navigation.replace('Admin');
                } else {
                    navigation.replace('Home');
                }
            } else {
                Alert.alert("Đăng nhập thất bại", data.message || "Sai tài khoản hoặc mật khẩu!");
            }
        } catch {
            Alert.alert("Lỗi kết nối", "Không thể kết nối đến máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />

            {/* Logo / Header */}
            <View style={styles.logoArea}>
                <View style={styles.logoCircle}>
                    <Text style={styles.logoEmoji}>🎮</Text>
                </View>
                <Text style={styles.appName}>QuizzMaster</Text>
                <Text style={styles.tagline}>Học vui — Chơi thật</Text>
            </View>

            {/* Form */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Đăng nhập</Text>

                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Tên đăng nhập</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập username..."
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Mật khẩu</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập mật khẩu..."
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.btnPrimary, loading && styles.btnDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    <Text style={styles.btnPrimaryText}>
                        {loading ? "Đang xử lý..." : "Đăng Nhập  →"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkRow}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.linkText}>Chưa có tài khoản? </Text>
                    <Text style={styles.linkHighlight}>Đăng ký ngay</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgDark,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logoArea: {
        alignItems: 'center',
        marginBottom: 36,
    },
    logoCircle: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: Colors.primary,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 12,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6, shadowRadius: 16, elevation: 10,
    },
    logoEmoji: { fontSize: 38 },
    appName: {
        fontSize: 34, fontWeight: '900',
        color: Colors.textLight, letterSpacing: 1,
    },
    tagline: {
        fontSize: 14, color: Colors.textMuted, marginTop: 4,
    },
    card: {
        backgroundColor: Colors.bgCard,
        borderRadius: 24,
        padding: 28,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardTitle: {
        fontSize: 22, fontWeight: '800',
        color: Colors.textLight, marginBottom: 22,
        textAlign: 'center',
    },
    inputWrapper: { marginBottom: 16 },
    inputLabel: {
        fontSize: 13, fontWeight: '700',
        color: Colors.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
        fontSize: 16, color: Colors.textLight,
        borderWidth: 1, borderColor: Colors.border,
    },
    btnPrimary: {
        backgroundColor: Colors.primary,
        borderRadius: 14, paddingVertical: 16,
        alignItems: 'center', marginTop: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
    },
    btnDisabled: { opacity: 0.6 },
    btnPrimaryText: {
        color: Colors.textLight, fontSize: 17, fontWeight: '800', letterSpacing: 0.5,
    },
    linkRow: {
        flexDirection: 'row', justifyContent: 'center',
        marginTop: 20, alignItems: 'center',
    },
    linkText: { color: Colors.textMuted, fontSize: 14 },
    linkHighlight: { color: Colors.accent, fontSize: 14, fontWeight: '700' },
});
