import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    Alert, StyleSheet, KeyboardAvoidingView, Platform, StatusBar, ScrollView
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
                await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
                if (data.user.role === 'Admin') {
                    navigation.replace('Admin');
                } else {
                    navigation.replace('Landing');
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

    // Đăng nhập khách — không cần tài khoản
    const handleGuestLogin = async () => {
        await AsyncStorage.setItem('userToken', 'GUEST');
        await AsyncStorage.setItem('userInfo', JSON.stringify({
            fullName: 'Khách',
            username: 'guest',
            role: 'Guest',
            highScore: 0,
            level: 1,
            tierName: 'Đồng',
        }));
        navigation.replace('Landing');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="dark-content" backgroundColor={Colors.bgApp} />
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                {/* Header tím */}
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoEmoji}>🎮</Text>
                    </View>
                    <Text style={styles.appName}>QuizzMaster</Text>
                    <Text style={styles.tagline}>Học vui — Chơi thật</Text>
                </View>

                {/* Form card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Đăng nhập</Text>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Tên đăng nhập</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập username..."
                            placeholderTextColor={Colors.textMuted}
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
                            placeholderTextColor={Colors.textMuted}
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
                            {loading ? "Đang xử lý..." : "Đăng Nhập →"}
                        </Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.dividerRow}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>hoặc</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Nút khách */}
                    <TouchableOpacity
                        style={styles.btnGuest}
                        onPress={handleGuestLogin}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnGuestText}>👤 Chơi với tư cách Khách</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkRow}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.linkText}>Chưa có tài khoản? </Text>
                        <Text style={styles.linkHighlight}>Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgApp,
    },
    scroll: {
        flexGrow: 1,
    },

    // Header tím bo góc dưới
    header: {
        backgroundColor: Colors.primary,
        paddingTop: 60,
        paddingBottom: 48,
        alignItems: 'center',
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },
    logoCircle: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 14,
        borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
    },
    logoEmoji: { fontSize: 38 },
    appName: {
        fontSize: 32, fontWeight: '900',
        color: Colors.white, letterSpacing: 1,
    },
    tagline: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 6 },

    // Card form
    card: {
        backgroundColor: Colors.bgCard,
        borderRadius: 24, padding: 28,
        margin: 20, marginTop: -24,
        elevation: 8,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 12,
    },
    cardTitle: {
        fontSize: 22, fontWeight: '800',
        color: Colors.textPrimary, marginBottom: 24, textAlign: 'center',
    },
    inputWrapper: { marginBottom: 16 },
    inputLabel: {
        fontSize: 13, fontWeight: '700', color: Colors.textMuted,
        marginBottom: 8, letterSpacing: 0.3,
    },
    input: {
        backgroundColor: Colors.bgApp,
        borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
        fontSize: 15, color: Colors.textPrimary,
        borderWidth: 1.5, borderColor: Colors.border,
    },
    btnPrimary: {
        backgroundColor: Colors.primary,
        borderRadius: 14, paddingVertical: 16,
        alignItems: 'center', marginTop: 8,
        elevation: 4,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4, shadowRadius: 8,
    },
    btnDisabled: { opacity: 0.6 },
    btnPrimaryText: {
        color: Colors.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5,
    },
    linkRow: {
        flexDirection: 'row', justifyContent: 'center',
        marginTop: 20, alignItems: 'center',
    },
    linkText: { color: Colors.textMuted, fontSize: 14 },
    linkHighlight: { color: Colors.primary, fontSize: 14, fontWeight: '700' },

    // Divider
    dividerRow: {
        flexDirection: 'row', alignItems: 'center',
        marginVertical: 20, gap: 10,
    },
    dividerLine: {
        flex: 1, height: 1, backgroundColor: Colors.border,
    },
    dividerText: {
        color: Colors.textMuted, fontSize: 13, fontWeight: '500',
    },

    // Nút khách
    btnGuest: {
        backgroundColor: Colors.bgApp,
        borderRadius: 14, paddingVertical: 15,
        alignItems: 'center',
        borderWidth: 1.5, borderColor: Colors.border,
        marginBottom: 4,
    },
    btnGuestText: {
        color: Colors.textPrimary, fontSize: 15, fontWeight: '700',
    },
});
