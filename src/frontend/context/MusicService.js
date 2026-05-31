/**
 * MusicService.js
 * Quản lý phát nhạc nền lofi dùng expo-av
 * Nhạc từ Internet Archive (public domain / free use)
 */
import { Audio } from 'expo-av';

// Base URL - server thật từ archive.org metadata API
const BASE = 'https://ia601801.us.archive.org/4/items/kalaido-hanging-lanterns_202101';

// Danh sách track lofi chill - đã verify 200 OK từ archive.org (free for profit use)
export const MUSIC_TRACKS = {
  'Lofi Học Tập': [
    {
      title: 'Kalaido - Hanging Lanterns',
      uri: `${BASE}/Kalaido%20-%20Hanging%20Lanterns.mp3`,
    },
    {
      title: 'Tranquillity - Chill Lofi Hip Hop Beat',
      uri: `${BASE}/Tranquillity%20-%20Chill%20Lofi%20Hip%20Hop%20Beat%20(FREE%20FOR%20PROFIT%20USE).mp3`,
    },
    {
      title: 'Onion - Prod. by Lukrembo',
      uri: `${BASE}/Onion%20(Prod.%20by%20Lukrembo).mp3`,
    },
    {
      title: 'Matt Quentin - Waves',
      uri: `${BASE}/Matt%20Quentin%20-%20Waves.mp3`,
    },
    {
      title: 'flovry - car radio',
      uri: `${BASE}/flovry%20-%20car%20radio.mp3`,
    },
  ],
  'Nhạc Cổ Điển': [
    {
      title: 'Kalaido - Hanging Lanterns',
      uri: `${BASE}/Kalaido%20-%20Hanging%20Lanterns.mp3`,
    },
    {
      title: 'Matt Quentin - Waves',
      uri: `${BASE}/Matt%20Quentin%20-%20Waves.mp3`,
    },
  ],
  'Nhạc Thiên Nhiên': [
    {
      title: 'deep space - Ambient Lofi',
      uri: `${BASE}/deep%20space%20-%20Ambient%20Lofi%20Hip%20Hop%20Beat%20(FREE%20FOR%20PROFIT%20USE).mp3`,
    },
    {
      title: 'FREE Lo-fi Type Beat - Rain',
      uri: `${BASE}/(FREE)%20Lo-fi%20Type%20Beat%20-%20Rain.mp3`,
    },
  ],
  'Không có nhạc': [],
};

class MusicServiceClass {
  constructor() {
    this._sound = null;
    this._currentMusic = null;
    this._volume = 0.6;
    this._isPlaying = false;
    this._trackIndex = 0;
  }

  async _configureAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,   // tiếp tục phát khi app ở background
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (e) {
      console.warn('[MusicService] configureAudio error:', e);
    }
  }

  async play(musicName, volume = 0.6) {
    // Nếu đang phát cùng loại nhạc → chỉ cập nhật volume
    if (this._currentMusic === musicName && this._isPlaying) {
      await this.setVolume(volume);
      return;
    }

    // Dừng nhạc cũ
    await this.stop();

    const tracks = MUSIC_TRACKS[musicName];
    if (!tracks || tracks.length === 0) return; // "Không có nhạc"

    await this._configureAudio();

    const track = tracks[this._trackIndex % tracks.length];

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.uri },
        {
          shouldPlay: true,
          isLooping: true,
          volume: Math.min(1, Math.max(0, volume)),
        }
      );

      this._sound = sound;
      this._currentMusic = musicName;
      this._volume = volume;
      this._isPlaying = true;

      // Khi track kết thúc (nếu không loop) → chuyển track tiếp theo
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish && !status.isLooping) {
          this._trackIndex++;
          this.play(musicName, this._volume);
        }
      });

      console.log(`[MusicService] Playing: ${track.title}`);
    } catch (e) {
      console.warn('[MusicService] play error:', e);
      this._isPlaying = false;
    }
  }

  async stop() {
    if (this._sound) {
      try {
        await this._sound.stopAsync();
        await this._sound.unloadAsync();
      } catch (e) {
        // ignore
      }
      this._sound = null;
      this._isPlaying = false;
      this._currentMusic = null;
    }
  }

  async setVolume(vol) {
    this._volume = Math.min(1, Math.max(0, vol));
    if (this._sound) {
      try {
        await this._sound.setVolumeAsync(this._volume);
      } catch (e) {
        console.warn('[MusicService] setVolume error:', e);
      }
    }
  }

  async pause() {
    if (this._sound && this._isPlaying) {
      try {
        await this._sound.pauseAsync();
        this._isPlaying = false;
      } catch (e) {
        console.warn('[MusicService] pause error:', e);
      }
    }
  }

  async resume() {
    if (this._sound && !this._isPlaying) {
      try {
        await this._sound.playAsync();
        this._isPlaying = true;
      } catch (e) {
        console.warn('[MusicService] resume error:', e);
      }
    }
  }

  get isPlaying() {
    return this._isPlaying;
  }

  get currentMusic() {
    return this._currentMusic;
  }
}

// Singleton — dùng chung toàn app
const MusicService = new MusicServiceClass();
export default MusicService;
