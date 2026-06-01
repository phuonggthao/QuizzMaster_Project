import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { LightColors, DarkColors } from '../Styles/Colors';
import MusicService from './MusicService';

const ThemeContext = createContext();

const STORAGE_KEY = '@quizmaster_settings';

// Số lượng mặc định mỗi power-up mỗi lượt chơi
export const DEFAULT_POWER_UP_COUNTS = {
  doublePoints: 2,  // Nhân đôi điểm
  freeze: 1,        // Đóng băng
  eliminate: 1,     // Cây bút thần
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [volume, setVolumeState] = useState(60);
  const [selectedMusic, setSelectedMusicState] = useState('Lofi Học Tập');
  const [fireworks, setFireworks] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authState, setAuthState] = useState('loading'); // 'loading'|'none'|'guest'|'user'|'admin'

  // Power-ups settings
  const [powerUpsEnabled, setPowerUpsEnabled] = useState(true);
  const [powerUpCounts, setPowerUpCounts] = useState({ ...DEFAULT_POWER_UP_COUNTS });

  const appState = useRef(AppState.currentState);

  // ── Load settings từ AsyncStorage khi khởi động ──────────────────────────
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.isDark !== undefined) setIsDark(saved.isDark);
          if (saved.volume !== undefined) setVolumeState(saved.volume);
          if (saved.selectedMusic) setSelectedMusicState(saved.selectedMusic);
          if (saved.fireworks !== undefined) setFireworks(saved.fireworks);
          if (saved.musicEnabled !== undefined) setMusicEnabled(saved.musicEnabled);
          if (saved.powerUpsEnabled !== undefined) setPowerUpsEnabled(saved.powerUpsEnabled);
          if (saved.powerUpCounts) setPowerUpCounts({ ...DEFAULT_POWER_UP_COUNTS, ...saved.powerUpCounts });
        }
      } catch (e) {
        console.warn('Không thể tải cài đặt:', e);
      } finally {
        setSettingsLoaded(true);
      }
    };
    loadSettings();
  }, []);

  // ── Auto-save settings mỗi khi thay đổi ─────────────────────────────────
  useEffect(() => {
    if (!settingsLoaded) return;
    const save = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ isDark, volume, selectedMusic, fireworks, musicEnabled, powerUpsEnabled, powerUpCounts })
        );
      } catch (e) {
        console.warn('Không thể lưu cài đặt:', e);
      }
    };
    save();
  }, [isDark, volume, selectedMusic, fireworks, musicEnabled, powerUpsEnabled, powerUpCounts, settingsLoaded]);

  // ── Bắt đầu phát nhạc sau khi settings load xong ─────────────────────────
  useEffect(() => {
    if (!settingsLoaded) return;
    if (musicEnabled && selectedMusic !== 'Không có nhạc') {
      MusicService.play(selectedMusic, volume / 100);
    } else {
      MusicService.stop();
    }
  }, [settingsLoaded]); // chỉ chạy 1 lần sau khi load

  // ── Xử lý app vào background / foreground ────────────────────────────────
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (appState.current === 'active' && nextState.match(/inactive|background/)) {
        // App vào background → pause nhạc
        MusicService.pause();
      } else if (appState.current.match(/inactive|background/) && nextState === 'active') {
        // App trở lại foreground → resume nếu đang bật
        if (musicEnabled && selectedMusic !== 'Không có nhạc') {
          MusicService.resume();
        }
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, [musicEnabled, selectedMusic]);

  // ── Cleanup khi unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      MusicService.stop();
    };
  }, []);

  // ── Setters có side-effect ────────────────────────────────────────────────
  const setVolume = (val) => {
    setVolumeState(val);
    MusicService.setVolume(val / 100);
  };

  const setSelectedMusic = (name) => {
    setSelectedMusicState(name);
    if (musicEnabled) {
      if (name === 'Không có nhạc') {
        MusicService.stop();
      } else {
        MusicService.play(name, volume / 100);
      }
    }
  };

  const toggleMusic = () => {
    const next = !musicEnabled;
    setMusicEnabled(next);
    if (next && selectedMusic !== 'Không có nhạc') {
      MusicService.play(selectedMusic, volume / 100);
    } else {
      MusicService.stop();
    }
  };

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Reset power-up counts về mặc định (gọi khi bắt đầu game mới)
  const resetPowerUps = () => {
    setPowerUpCounts({ ...DEFAULT_POWER_UP_COUNTS });
  };

  // Dùng 1 power-up, trả về false nếu hết
  const usePowerUp = (type) => {
    if (!powerUpsEnabled) return false;
    if ((powerUpCounts[type] ?? 0) <= 0) return false;
    setPowerUpCounts((prev) => ({ ...prev, [type]: prev[type] - 1 }));
    return true;
  };

  const theme = isDark ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        theme,
        volume,
        setVolume,
        selectedMusic,
        setSelectedMusic,
        fireworks,
        setFireworks,
        musicEnabled,
        toggleMusic,
        powerUpsEnabled,
        setPowerUpsEnabled,
        powerUpCounts,
        setPowerUpCounts,
        resetPowerUps,
        usePowerUp,
        DEFAULT_POWER_UP_COUNTS,
        isAdmin,
        setIsAdmin,
        authState,
        setAuthState,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
