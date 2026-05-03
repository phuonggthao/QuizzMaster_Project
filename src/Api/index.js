// 1. Nhập hàm kết nối từ mongoClient
import { connectDatabase } from './mongoClient';

// 2. Kích hoạt kết nối (Chỉ cần 1 lần duy nhất tại đây)
connectDatabase();

// 3. Xuất các hàm API để h sử dụng ở Frontend

export const fetchQuizQuestions = async () => {
   //  gọi logic từ backend/Service ở đây
};

// Ví dụ: Hàm xử lý đăng nhập cho Thảo/Nhung
export const loginUser = async (credentials) => {
   // Thảo gọi logic từ backend/Controller ở đây
};