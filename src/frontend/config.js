// E:\QuizzMaster_Project\src\frontend\config.js
//
// ⚠️  ĐỔI IP NÀY THÀNH IP MÁY TÍNH ĐANG CHẠY BACKEND
//
// Cách lấy IP:
//   - Windows: mở CMD → gõ "ipconfig" → lấy "IPv4 Address" của WiFi/Ethernet
//   - Ví dụ: 192.168.1.5  hoặc  10.0.142.87
//
// KHÔNG dùng "localhost" hay "127.0.0.1" vì điện thoại/emulator không hiểu được.

const BACKEND_IP = '10.0.142.87'; // ← ĐỔI IP NÀY thành IP máy đang chạy backend
const BACKEND_PORT = '5000';

const BASE_URL = `http://${BACKEND_IP}:${BACKEND_PORT}/api`;

export default BASE_URL;
