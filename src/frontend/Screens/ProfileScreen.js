import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ActivityIndicator, Alert, SafeAreaView, StatusBar, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import { Colors } from '../Styles/Colors';

const TIER_CONFIG = {
    'Đồng':     { color: '#cd7f32', emoji: '🥉', bg: '#FDF3E7' },
    'Bạc':      { color: '#9CA3AF', emoji: '🥈', bg: '#F3F4F6' },
    'Vàng':     { color: '#F59E0B', emoji: '🥇', bg: '#FFFBEB' },
    'Bạch Kim': { color: '#8B5CF6', emoji: '💎', bg: '#EDE9FF' },
};

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const response = await fetch(`${BASE_URL}/auth/me`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) setUser(data.user);
                else Alert.alert("Lỗi", "Không thể tải thông tin hồ sơ.");
            } catch {
                Alert.alert("Lỗi mạng", "Không thể kết nối đến máy chủ.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
            { text: "Huỷ", style: "cancel" },
            {
                text: "Đăng xuất", style: "destructive",
                onPress: async () => {
                    await AsyncStorage.clear();
                    navigation.replace('Login');
                }
            }
        ]);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <StatusBar barStyle="dark-content" backgroundColor={Colors.bgApp} />
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    const tier = user?.tierName || 'Đồng';
    const tierInfo = TIER_CONFIG[tier] || TIER_CONFIG['Đồng'];
    const avatarLetter = user?.fullName?.charAt(0).toUpperCase() || 'U';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Header tím */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarRing}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{avatarLetter}</Text>
                        </View>
                    </View>
                    <Text style={styles.fullName}>{user?.fullName || 'Người chơi'}</Text>
                    <Text style={styles.username}>@{user?.username}</Text>

                    {/* Rank badge */}
                    <View style={[styles.rankBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Text style={styles.rankEmoji}>{tierInfo.emoji}</Text>
                        <Text style={styles.rankText}>{tier}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    {/* Stats row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Text style={styles.statEmoji}>🏆</Text>
                            <Text style={styles.statValue}>{user?.highScore || 0}</Text>
                            <Text style={styles.statLabel}>Kỷ lục</Text>
                        </View>
                        <View style={[styles.statCard, styles.statCardMiddle]}>
                            <Text style={styles.statEmoji}>⚡</Text>
                            <Text style={[styles.statValue, { color: Colors.primary }]}>Lv.{user?.level || 1}</Text>
                            <Text style={styles.statLabel}>Cấp độ</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statEmoji}>🎯</Text>
                            <Text style={styles.statValue}>{tier}</Text>
                            <Text style={styles.statLabel}>Hạng</Text>
                        </View>
                    </View>

                    {/* Level progress */}
                    <View style={styles.levelCard}>
                        <View style={styles.levelHeader}>
                            <Text style={styles.levelTitle}>Tiến độ thăng cấp</Text>
                            <Text style={styles.levelValue}>Lv.{user?.level || 1} → Lv.{(user?.level || 1) + 1}</Text>
                        </View>
                        <View style={styles.levelBarBg}>
                            <View style={[styles.levelBarFill, {
                                width: `${Math.min(((user?.highScore || 0) % 20) / 20 * 100, 100)}%`
                            }]} />
                        </View>
                        <Text style={styles.levelHint}>
                            {(user?.highScore || 0) % 20}/20 điểm để lên cấp tiếp theo
                        </Text>
                    </View>

                    {/* Logout */}
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
                        <Text style={styles.logoutText}>Đăng Xuất</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgApp },
    center: { flex: 1, backgroundColor: Colors.bgApp, justifyContent: 'center', alignItems: 'center' },

    // Header tím
    profileHeader: {
        backgroundColor: Colors.primary,
        paddingTop: 36, paddingBottom: 40,
        alignItems: 'center',
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },
    avatarRing: {
        padding: 4, borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 14,
    },
    avatar: {
        width: 90, height: 90, borderRadius: 45,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)',
    },
    avatarText: { fontSize: 38, fontWeight: '900', color: '#fff' },
    fullName: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
    username: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 14 },
    rankBadge: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 7,
        borderRadius: 20, gap: 6,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    },
    rankEmoji: { fontSize: 16 },
    rankText: { fontSize: 14, fontWeight: '800', color: '#fff' },

    // Body
    body: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },

    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    statCard: {
        flex: 1, backgroundColor: Colors.bgCard,
        borderRadius: 18, padding: 16, alignItems: 'center',
        borderWidth: 1, borderColor: Colors.border,
        elevation: 2,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 6,
    },
    statCardMiddle: { borderColor: Colors.primaryLight, borderWidth: 2 },
    statEmoji: { fontSize: 22, marginBottom: 6 },
    statValue: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary, marginBottom: 2 },
    statLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },

    levelCard: {
        backgroundColor: Colors.bgCard, borderRadius: 18,
        padding: 20, marginBottom: 20,
        borderWidth: 1, borderColor: Colors.border,
        elevation: 2,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 6,
    },
    levelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    levelTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
    levelValue: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
    levelBarBg: {
        height: 8, backgroundColor: Colors.bgApp,
        borderRadius: 4, marginBottom: 8,
    },
    levelBarFill: {
        height: 8, backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    levelHint: { fontSize: 12, color: Colors.textMuted },

    logoutBtn: {
        backgroundColor: '#FEE2E2',
        borderRadius: 14, paddingVertical: 16,
        alignItems: 'center', borderWidth: 1.5, borderColor: Colors.wrong,
    },
    logoutText: { color: Colors.wrong, fontSize: 15, fontWeight: '800' },
});
