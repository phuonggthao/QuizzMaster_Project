import { Platform } from 'react-native';

// ⚠️ ĐỔI IP NÀY = IP WiFi máy tính (dùng cho điện thoại thật)
// Chạy lệnh trong PowerShell để lấy IP:
// Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.*' }
const WIFI_IP = '192.168.2.6';
const PORT = '5000';

// Tự động chọn đúng URL:
// - Web browser trên máy tính → localhost (tránh CORS IP)
// - Điện thoại thật / Expo Go → IP WiFi
const BASE_URL = Platform.OS === 'web'
    ? `http://localhost:${PORT}/api`
    : `http://${WIFI_IP}:${PORT}/api`;

export default BASE_URL;
