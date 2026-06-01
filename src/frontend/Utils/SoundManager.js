// src/Utils/SoundManager.js
import { Audio } from 'expo-av';

let backgroundSound = null;

export const SoundManager = {
  // Hàm này để phát nhạc
  playBackgroundMusic: async () => {
    try {
      if (!backgroundSound) {
        backgroundSound = new Audio.Sound();
        // LƯU Ý: Đặt file nhạc của bạn vào thư mục 'assets' ở gốc dự án
        await backgroundSound.loadAsync(require('../../../assets/backgroundmusic.mp3'), { 
          isLooping: true, 
          volume: 0.5 
        });
      }
      await backgroundSound.playAsync();
    } catch (error) {
      console.log("Lỗi phát nhạc:", error);
    }
  },

  // Hàm này để dừng nhạc
  stopBackgroundMusic: async () => {
    if (backgroundSound) await backgroundSound.stopAsync();
  },

  // Hàm chỉnh âm lượng
  setVolume: async (value) => {
    if (backgroundSound) await backgroundSound.setVolumeAsync(value);
  }
};