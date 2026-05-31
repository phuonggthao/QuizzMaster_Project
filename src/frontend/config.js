import { Platform } from 'react-native';

// ⚠️ ĐỔI IP NÀY = IP WiFi máy tính (dùng cho điện thoại thật)
const WIFI_IP = '192.168.2.6';
const PORT = '5000';

const BASE_URL = Platform.OS === 'web'
    ? `http://localhost:${PORT}/api`
    : `http://${WIFI_IP}:${PORT}/api`;

export default BASE_URL;
