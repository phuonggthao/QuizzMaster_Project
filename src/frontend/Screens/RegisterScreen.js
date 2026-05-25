import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    Alert, StyleSheet, ScrollView, StatusBar, KeyboardAvoidingView, Platform
} from 'react-native';
import BASE_URL from '../config';
import { Colors } from '../Styles/Colors';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

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
            style={{ flex: 1, backgroundColor: Colors.bgDark }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                <View style={styles.logoArea}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoEmoji}>✨</Text>
                    </View>
                    <Text style={styles.appName}>Tạo tài khoản</Text>
                    <Text style={styles.tagline}>Tham gia QuizzMaster ngay hôm nay</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Họ và tên</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập họ tên..."
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

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
                        onPress={handleRegister}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnPrimaryText}>
                            {loading ? "Đang xử lý..." : "Đăng Ký Ngay  →"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkRow}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.linkText}>Đã có tài khoản? </Text>
                        <Text style={styles.linkHighlight}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, backgroundColor: Colors.bgDark,
        justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40,
    },
    logoArea: { alignItems: 'center', marginBottom: 32 },
    logoCircle: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: Colors.accent,
        justifyContent: 'center', alignItems: 'center', marginBottom: 12,
        shadowColor: Colors.accent, shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5, shadowRadius: 14, elevation: 10,
    },
    logoEmoji: { fontSize: 34 },
    appName: { fontSize: 28, fontWeight: '900', color: Colors.textLight },
    tagline: { fontSize: 14, color: Colors.textMuted, marginTop: 4 },
    card: {
        backgroundColor: Colors.bgCard, borderRadius: 24,
        padding: 28, borderWidth: 1, borderColor: Colors.border,
    },
    inputWrapper: { marginBottom: 16 },
    inputLabel: {
        fontSize: 13, fontWeight: '700', color: Colors.textMuted,
        marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
        fontSize: 16, color: Colors.textLight,
        borderWidth: 1, borderColor: Colors.border,
    },
    btnPrimary: {
        backgroundColor: Colors.primary, borderRadius: 14,
        paddingVertical: 16, alignItems: 'center', marginTop: 8,
        shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
    },
    btnDisabled: { opacity: 0.6 },
    btnPrimaryText: { color: Colors.textLight, fontSize: 17, fontWeight: '800' },
    linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    linkText: { color: Colors.textMuted, fontSize: 14 },
    linkHighlight: { color: Colors.accent, fontSize: 14, fontWeight: '700' },
});
