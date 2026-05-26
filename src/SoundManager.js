import { Audio } from 'expo-av';

export const playSound = async (soundFile) => {
  try {
    // Tạo đối tượng âm thanh từ file
    const { sound } = await Audio.Sound.createAsync(soundFile);
    
    // Phát âm thanh
    await sound.playAsync();
    
    // Tự động giải phóng bộ nhớ khi phát xong
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error("Lỗi khi phát âm thanh:", error);
  }
};