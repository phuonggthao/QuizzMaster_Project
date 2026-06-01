import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    Alert, StyleSheet, KeyboardAvoidingView, Platform, StatusBar, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { isDark, theme: C, setIsAdmin, setAuthState } = useTheme();

    const handleLogin = async () => {
        setErrorMsg('');
        if (!username.trim() || !password.trim()) {
            setErrorMsg('Vui lòng nhập tài khoản và mật khẩu!');
            return;
        }
        try {
            setLoading(true);
            console.log('[Login] Gọi API:', `${BASE_URL}/auth/login`);
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password })
            });
            const data = await response.json();
            console.log('[Login] Kết quả:', response.status, data);
            if (response.ok) {
                await AsyncStorage.setItem('userToken', data.token);
                if (data.user?._id) await AsyncStorage.setItem('userId', data.user._id);
                await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
                if (data.user.role === 'Admin') {
                    setIsAdmin(true);
                    setAuthState('admin');
                } else {
                    setIsAdmin(false);
                    setAuthState('user');
                }
            } else {
                setErrorMsg(data.message || 'Sai tài khoản hoặc mật khẩu!');
            }
        } catch (err) {
            console.error('[Login] Lỗi:', err);
            setErrorMsg('Không thể kết nối đến máy chủ. Hãy kiểm tra server đang chạy.');
        } finally {
            setLoading(false);
        }
    };

    // Đăng nhập khách — không cần tài khoản
    const handleGuestLogin = async () => {
        try {
            setErrorMsg('');
            setIsAdmin(false);
            await AsyncStorage.setItem('userToken', 'GUEST');
            await AsyncStorage.setItem('userInfo', JSON.stringify({
                fullName: 'Khách',
                username: 'guest',
                role: 'Guest',
                highScore: 0,
                level: 1,
                tierName: 'Đồng',
            }));
        } catch (err) {
            console.warn('[GuestLogin] AsyncStorage lỗi:', err);
        } finally {
            setAuthState('guest');
        }
    };

    const Wrapper = Platform.OS === 'web' ? View : KeyboardAvoidingView;

    return (
        <Wrapper
            style={[styles.container, { backgroundColor: C.bgApp }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgApp} />
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                {/* Header tím */}
                <View style={[styles.header, { backgroundColor: C.primary }]}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoEmoji}>🎮</Text>
                    </View>
                    <Text style={styles.appName}>QuizzMaster</Text>
                    <Text style={styles.tagline}>Học vui — Chơi thật</Text>
                </View>

                {/* Form card */}
                <View style={[styles.card, { backgroundColor: C.bgCard, shadowColor: C.shadow }]}>
                    <Text style={[styles.cardTitle, { color: C.textPrimary }]}>Đăng nhập</Text>

                    <View style={styles.inputWrapper}>
                        <Text style={[styles.inputLabel, { color: C.textMuted }]}>Tên đăng nhập</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: C.bgApp, color: C.textPrimary, borderColor: C.border }]}
                            placeholder="Nhập username..."
                            placeholderTextColor={C.textMuted}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={[styles.inputLabel, { color: C.textMuted }]}>Mật khẩu</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: C.bgApp, color: C.textPrimary, borderColor: C.border }]}
                            placeholder="Nhập mật khẩu..."
                            placeholderTextColor={C.textMuted}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    {/* Thông báo lỗi */}
                    {errorMsg ? (
                        <View style={[styles.errorBox, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}>
                            <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        style={[styles.btnPrimary, { backgroundColor: C.primary, shadowColor: C.primary }, loading && styles.btnDisabled]}
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
                        <View style={[styles.dividerLine, { backgroundColor: C.border }]} />
                        <Text style={[styles.dividerText, { color: C.textMuted }]}>hoặc</Text>
                        <View style={[styles.dividerLine, { backgroundColor: C.border }]} />
                    </View>

                    {/* Nút khách */}
                    <TouchableOpacity
                        style={[styles.btnGuest, { backgroundColor: C.bgApp, borderColor: C.border }]}
                        onPress={handleGuestLogin}
                        activeOpacity={0.85}
                    >
                        <Text style={[styles.btnGuestText, { color: C.textPrimary }]}>👤 Chơi với tư cách Khách</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkRow}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={[styles.linkText, { color: C.textMuted }]}>Chưa có tài khoản? </Text>
                        <Text style={[styles.linkHighlight, { color: C.primary }]}>Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </Wrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        flexGrow: 1,
    },

    // Header tím bo góc dưới
    header: {
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
        color: '#FFFFFF', letterSpacing: 1,
    },
    tagline: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 6 },

    // Card form
    card: {
        borderRadius: 24, padding: 28,
        margin: 20, marginTop: -24,
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 12,
    },
    cardTitle: {
        fontSize: 22, fontWeight: '800',
        marginBottom: 24, textAlign: 'center',
    },
    inputWrapper: { marginBottom: 16 },
    inputLabel: {
        fontSize: 13, fontWeight: '700',
        marginBottom: 8, letterSpacing: 0.3,
    },
    input: {
        borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
        fontSize: 15,
        borderWidth: 1.5,
    },
    btnPrimary: {
        borderRadius: 14, paddingVertical: 16,
        alignItems: 'center', marginTop: 8,
        elevation: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4, shadowRadius: 8,
    },
    btnDisabled: { opacity: 0.6 },
    btnPrimaryText: {
        color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5,
    },
    linkRow: {
        flexDirection: 'row', justifyContent: 'center',
        marginTop: 20, alignItems: 'center',
    },
    linkText: { fontSize: 14 },
    linkHighlight: { fontSize: 14, fontWeight: '700' },

    // Divider
    dividerRow: {
        flexDirection: 'row', alignItems: 'center',
        marginVertical: 20, gap: 10,
    },
    dividerLine: {
        flex: 1, height: 1,
    },
    dividerText: {
        fontSize: 13, fontWeight: '500',
    },

    // Nút khách
    btnGuest: {
        borderRadius: 14, paddingVertical: 15,
        alignItems: 'center',
        borderWidth: 1.5,
        marginBottom: 4,
    },
    btnGuestText: {
        fontSize: 15, fontWeight: '700',
    },

    // Error box
    errorBox: {
        borderRadius: 10,
        borderWidth: 1,
        padding: 12,
        marginBottom: 12,
    },
    errorText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#DC2626',
        textAlign: 'center',
    },
});
