import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    Alert, StyleSheet, ScrollView, StatusBar, KeyboardAvoidingView, Platform
} from 'react-native';
import BASE_URL from '../config';
import { useTheme } from '../context/ThemeContext';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const { isDark, theme: C } = useTheme();

    const handleRegister = async () => {
        if (!username || !password || !fullName) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin đăng ký!");
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
                Alert.alert("Thành công 🎉", "Tài khoản đã được tạo!", [
                    { text: "Đăng nhập ngay", onPress: () => navigation.navigate('Login') }
                ]);
            } else {
                Alert.alert("Thất bại", data.message || "Tên đăng nhập đã tồn tại!");
            }
        } catch {
            Alert.alert("Lỗi kết nối", "Không thể kết nối đến máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: C.bgApp }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bgApp} />
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                {/* Header tím */}
                <View style={[styles.header, { backgroundColor: C.primary }]}>
                    {/* Nút back */}
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backBtnText}>← Đăng nhập</Text>
                    </TouchableOpacity>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoEmoji}>✨</Text>
                    </View>
                    <Text style={styles.appName}>Tạo tài khoản</Text>
                    <Text style={styles.tagline}>Tham gia QuizzMaster ngay hôm nay</Text>
                </View>

                {/* Form card */}
                <View style={[styles.card, { backgroundColor: C.bgCard, shadowColor: C.shadow }]}>
                    <View style={styles.inputWrapper}>
                        <Text style={[styles.inputLabel, { color: C.textMuted }]}>Họ và tên</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: C.bgApp, color: C.textPrimary, borderColor: C.border }]}
                            placeholder="Nhập họ tên..."
                            placeholderTextColor={C.textMuted}
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

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

                    <TouchableOpacity
                        style={[styles.btnPrimary, { backgroundColor: C.primary, shadowColor: C.primary }, loading && styles.btnDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnPrimaryText}>
                            {loading ? "Đang xử lý..." : "Đăng Ký Ngay →"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkRow}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={[styles.linkText, { color: C.textMuted }]}>Đã có tài khoản? </Text>
                        <Text style={[styles.linkHighlight, { color: C.primary }]}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scroll: { flexGrow: 1 },

    header: {
        paddingTop: 60,
        paddingBottom: 48,
        alignItems: 'center',
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },
    backBtn: {
        alignSelf: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 4,
        paddingBottom: 8,
    },
    backBtnText: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 14,
        fontWeight: '700',
    },
    logoCircle: {
        width: 76, height: 76, borderRadius: 38,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 14,
        borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
    },
    logoEmoji: { fontSize: 34 },
    appName: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
    tagline: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 6 },

    card: {
        borderRadius: 24, padding: 28,
        margin: 20, marginTop: -24,
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 12,
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
        borderRadius: 14,
        paddingVertical: 16, alignItems: 'center', marginTop: 8,
        elevation: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4, shadowRadius: 8,
    },
    btnDisabled: { opacity: 0.6 },
    btnPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
    linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    linkText: { fontSize: 14 },
    linkHighlight: { fontSize: 14, fontWeight: '700' },
});
