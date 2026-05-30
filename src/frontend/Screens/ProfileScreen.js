import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ActivityIndicator, Alert, StatusBar, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import { Colors } from '../Styles/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const TIER_CONFIG = {
    'Đồng':  { color: '#cd7f32', emoji: '🥉' },
    'Bạc':   { color: '#c0c0c0', emoji: '🥈' },
    'Vàng':  { color: '#ffd700', emoji: '🥇' },
    'Bạch Kim': { color: '#e5e4e2', emoji: '💎' },
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
                <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    const tier = user?.tierName || 'Đồng';
    const tierInfo = TIER_CONFIG[tier] || TIER_CONFIG['Đồng'];
    const avatarLetter = user?.fullName?.charAt(0).toUpperCase() || 'U';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Avatar + tên */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarRing}>
                        <View style={[styles.avatar, { borderColor: tierInfo.color }]}>
                            <Text style={styles.avatarText}>{avatarLetter}</Text>
                        </View>
                    </View>
                    <Text style={styles.fullName}>{user?.fullName || 'Người chơi'}</Text>
                    <Text style={styles.username}>@{user?.username}</Text>

                    {/* Rank badge */}
                    <View style={[styles.rankBadge, { backgroundColor: tierInfo.color + '33', borderColor: tierInfo.color }]}>
                        <Text style={styles.rankEmoji}>{tierInfo.emoji}</Text>
                        <Text style={[styles.rankText, { color: tierInfo.color }]}>{tier}</Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statEmoji}>🏆</Text>
                        <Text style={styles.statValue}>{user?.highScore || 0}</Text>
                        <Text style={styles.statLabel}>Kỷ lục</Text>
                    </View>
                    <View style={[styles.statCard, styles.statCardMiddle]}>
                        <Text style={styles.statEmoji}>⚡</Text>
                        <Text style={styles.statValue}>Lv.{user?.level || 1}</Text>
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
                        {(user?.highScore || 0) % 20}/{20} điểm để lên cấp tiếp theo
                    </Text>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
                    <Text style={styles.logoutText}>Đăng Xuất</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgDark },
    center: { flex: 1, backgroundColor: Colors.bgDark, justifyContent: 'center', alignItems: 'center' },
    scroll: { paddingHorizontal: 20, paddingBottom: 40 },

    profileHeader: { alignItems: 'center', paddingTop: 30, marginBottom: 28 },
    avatarRing: {
        padding: 4, borderRadius: 60,
        backgroundColor: 'rgba(139,92,246,0.2)', marginBottom: 14,
    },
    avatar: {
        width: 96, height: 96, borderRadius: 48,
        backgroundColor: Colors.primary,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 3,
    },
    avatarText: { fontSize: 40, fontWeight: '900', color: '#fff' },
    fullName: { fontSize: 24, fontWeight: '900', color: Colors.textLight, marginBottom: 4 },
    username: { fontSize: 15, color: Colors.textMuted, marginBottom: 14 },
    rankBadge: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 7,
        borderRadius: 20, borderWidth: 1.5, gap: 6,
    },
    rankEmoji: { fontSize: 18 },
    rankText: { fontSize: 15, fontWeight: '800' },

    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    statCard: {
        flex: 1, backgroundColor: Colors.bgCard,
        borderRadius: 18, padding: 18, alignItems: 'center',
        borderWidth: 1, borderColor: Colors.border,
    },
    statCardMiddle: { borderColor: Colors.primary },
    statEmoji: { fontSize: 24, marginBottom: 6 },
    statValue: { fontSize: 20, fontWeight: '900', color: Colors.textLight, marginBottom: 2 },
    statLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },

    levelCard: {
        backgroundColor: Colors.bgCard, borderRadius: 18,
        padding: 20, marginBottom: 24,
        borderWidth: 1, borderColor: Colors.border,
    },
    levelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    levelTitle: { fontSize: 15, fontWeight: '700', color: Colors.textLight },
    levelValue: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
    levelBarBg: {
        height: 10, backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 5, marginBottom: 8,
    },
    levelBarFill: {
        height: 10, backgroundColor: Colors.primary,
        borderRadius: 5,
    },
    levelHint: { fontSize: 12, color: Colors.textMuted },

    logoutBtn: {
        backgroundColor: 'rgba(239,68,68,0.15)',
        borderRadius: 14, paddingVertical: 16,
        alignItems: 'center', borderWidth: 1.5, borderColor: Colors.wrong,
    },
    logoutText: { color: Colors.wrong, fontSize: 16, fontWeight: '800' },
});
