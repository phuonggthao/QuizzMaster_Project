import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

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
                if (response.ok) {
                    setUser(data.user);
                } else {
                    Alert.alert("Lỗi", "Không thể tải thông tin hồ sơ.");
                }
            } catch (error) {
                Alert.alert("Lỗi mạng", "Không thể kết nối đến máy chủ.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.clear(); // Xóa sạch token và id đã lưu
        Alert.alert("Đăng xuất", "Thảo đã đăng xuất thành công!");
        navigation.replace('Login'); // Đá về màn hình đăng nhập gốc của App.js
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2196F3" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{user?.fullName?.charAt(0).toUpperCase() || 'U'}</Text>
            </View>

            <Text style={styles.nameText}>{user?.fullName || 'Người chơi'}</Text>
            <Text style={styles.usernameText}>@{user?.username}</Text>

            <View style={styles.statsCard}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{user?.highScore || 0}</Text>
                    <Text style={styles.statLabel}>Kỷ lục 🏆</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{user?.tierName || 'Đồng'}</Text>
                    <Text style={styles.statLabel}>Hạng Rank 🛡️</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutBtnText}>Đăng Xuất Tài Khoản</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#2196F3', justifyContent: 'center', alignItems: 'center', marginTop: 40, marginBottom: 15, elevation: 3 },
    avatarText: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
    nameText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    usernameText: { fontSize: 16, color: '#777', marginBottom: 30 },
    statsCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 20, borderRadius: 15, width: '100%', justifyContent: 'space-around', elevation: 2, marginBottom: 40 },
    statBox: { alignItems: 'center' },
    statNumber: { fontSize: 20, fontWeight: 'bold', color: '#2196F3' },
    statLabel: { fontSize: 14, color: '#666', marginTop: 5 },
    logoutBtn: { backgroundColor: '#f44336', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
    logoutBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});