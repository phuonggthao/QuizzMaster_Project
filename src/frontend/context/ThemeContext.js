import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { LightColors, DarkColors } from '../Styles/Colors';
import MusicService from './MusicService';

const ThemeContext = createContext();

const STORAGE_KEY = '@quizmaster_settings';

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [volume, setVolumeState] = useState(60);
  const [selectedMusic, setSelectedMusicState] = useState('Lofi Học Tập');
  const [fireworks, setFireworks] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);

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
          JSON.stringify({ isDark, volume, selectedMusic, fireworks, musicEnabled })
        );
      } catch (e) {
        console.warn('Không thể lưu cài đặt:', e);
      }
    };
    save();
  }, [isDark, volume, selectedMusic, fireworks, musicEnabled, settingsLoaded]);

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
