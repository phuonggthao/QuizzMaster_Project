# Tasks

## Task 1: Đăng ký 4 màn hình còn thiếu vào App.js
- [x] 1.1 Import ManageScreen, PowerUpsScreen, QuestionTypeScreen, ReportScreen vào App.js
- [x] 1.2 Thêm Stack.Screen cho 'Manage', 'PowerUps', 'QuestionType', 'Report' vào Stack.Navigator

**File:** `e:\mont2\QuizzMaster_Project\App.js`
**Yêu cầu:** REQ-1

---

## Task 2: Gắn chức năng nút 🔔 và ⚙️ trong AppHeader
- [x] 2.1 Import Alert từ react-native trong AppHeader.js
- [x] 2.2 Nút 🔔: thêm `onPress={() => Alert.alert('Thông báo', 'Thông báo đang được phát triển')}`
- [x] 2.3 Nút ⚙️: thêm `onPress={() => navigation.navigate('PowerUps')}`

**File:** `e:\mont2\QuizzMaster_Project\src\frontend\Components\AppHeader.js`
**Phụ thuộc:** Task 1 (PowerUps route phải tồn tại)
**Yêu cầu:** REQ-2

---

## Task 3: Gắn chức năng Footer links trong HomeScreen
- [x] 3.1 Import Alert từ react-native (nếu chưa có)
- [x] 3.2 Bọc "Privacy Policy", "Terms of Service", "Help Center" trong TouchableOpacity với Alert

**File:** `e:\mont2\QuizzMaster_Project\src\frontend\Screens\HomeScreen.js`
**Yêu cầu:** REQ-3

---

## Task 4: Gắn chức năng searchBox và Footer links trong LandingScreen
- [x] 4.1 Bọc searchBox trong TouchableOpacity với `onPress={() => navigation.navigate('Explore')}`
- [x] 4.2 Bọc "Privacy Policy", "Terms of Service", "Help Center" trong TouchableOpacity với Alert

**File:** `e:\mont2\QuizzMaster_Project\src\frontend\Screens\LandingScreen.js`
**Yêu cầu:** REQ-3, REQ-4

---

## Task 5: Gắn chức năng Filter chips, View All, Load More trong ExploreScreen
- [x] 5.1 Thêm state `filteredQuizzes` khởi tạo bằng `QUIZZES`
- [x] 5.2 Thêm `useEffect` theo dõi `activeFilter` để cập nhật `filteredQuizzes` (Popular/Newest/Recommended)
- [x] 5.3 Thay `QUIZZES.map(...)` bằng `filteredQuizzes.map(...)` trong render
- [x] 5.4 Nút "View All" trong Categories: thêm `onPress={() => Alert.alert('Thông báo', 'Đang tải thêm danh mục...')}`
- [x] 5.5 Nút "Load More Quizzes": thay navigate Quiz bằng `Alert.alert('Thông báo', 'Đang tải thêm...')`

**File:** `e:\mont2\QuizzMaster_Project\src\frontend\Screens\ExploreScreen.js`
**Yêu cầu:** REQ-5, REQ-6

---

## Task 6: Sửa nút "View All Activity" và Footer links trong ProfileScreen
- [x] 6.1 Sửa `onPress` của "View All Activity →" thành `navigation.navigate('Leaderboard', { score: user?.highScore || 0, total: 10 })`
- [x] 6.2 Bọc "Privacy Policy", "Terms of Service", "Help Center" trong TouchableOpacity với Alert

**File:** `e:\mont2\QuizzMaster_Project\src\frontend\Screens\ProfileScreen.js`
**Yêu cầu:** REQ-3, REQ-7

---

## Task 7: Sửa nút "▶ Tiếp tục Quiz" trong LeaderboardScreen
- [x] 7.1 Sửa `onPress` của nút "▶ Tiếp tục Quiz" thành `navigation.navigate('Home')`

**File:** `e:\mont2\QuizzMaster_Project\src\frontend\Screens\LeaderboardScreen.js`
**Yêu cầu:** REQ-8

---

## Task 8: Gắn chức năng các nút trong ManageScreen
- [x] 8.1 Import Alert từ react-native
- [x] 8.2 Nút ✏️: thêm `onPress` với Alert "Tính năng chỉnh sửa đang phát triển"
- [x] 8.3 Nút ⋮: thêm `onPress` với Alert có options Xem trước / Xóa / Chia sẻ / Huỷ
- [x] 8.4 Nút "Xem tất cả": thêm `onPress` với Alert "Đang tải thêm bộ câu hỏi..."
- [x] 8.5 Nút "Nhập từ Excel": thêm `onPress` với Alert "Tính năng nhập Excel đang phát triển"
- [x] 8.6 Nút "Nhập từ Google Forms": thêm `onPress` với Alert "Tính năng nhập Google Forms đang phát triển"

**File:** `e:\mont2\QuizzMaster_Project\src\frontend\Screens\ManageScreen.js`
**Yêu cầu:** REQ-9

---

## Task 9: Gắn chức năng Power-up trong QuizScreen
- [x] 9.1 Thêm state: `doublePoints` (bool), `powerUpCount` (số, mặc định 2), `frozen` (bool)
- [x] 9.2 Hàm `handleDoublePoints`: set doublePoints=true, giảm powerUpCount, disabled nếu answered
- [x] 9.3 Hàm `handleFreeze`: dừng timer 5 giây rồi tiếp tục, disabled nếu answered hoặc frozen
- [x] 9.4 Hàm `handleSkip`: gọi nextQuestion(score) ngay, disabled nếu answered
- [x] 9.5 Trong `handleAnswer`: dùng `doublePoints ? 20 : 10` làm basePoints, reset doublePoints=false sau khi dùng
- [x] 9.6 Cập nhật badge số lần dùng của nút +1 hiển thị `powerUpCount` thay vì hardcode "2"
- [x] 9.7 Gắn các handler vào 3 nút power-up tương ứng, thêm `disabled={answered}` cho cả 3

**File:** `e:\mont2\QuizzMaster_Project\src\frontend\Screens\QuizScreen.js`
**Yêu cầu:** REQ-10

---

## Task 10: Sửa nút "Tiếp tục →" trong QuestionTypeScreen
- [x] 10.1 Sửa `handleContinue` thành `navigation.navigate('Admin')` thay vì `navigation.navigate('Home')`

**File:** `e:\mont2\QuizzMaster_Project\src\frontend\Screens\QuestionTypeScreen.js`
**Phụ thuộc:** Task 1 (Admin route đã có sẵn)
**Yêu cầu:** REQ-11

---

## Task 11: Gắn chức năng các nút trong ReportScreen
- [x] 11.1 Import Alert từ react-native
- [x] 11.2 Nút "Xem chi tiết": Alert với tên bài kiểm tra, ngày, số học sinh, tỉ lệ hoàn thành
- [x] 11.3 Nút ⋮: Alert với options Xuất PDF / Chia sẻ / Xóa / Huỷ
- [x] 11.4 Nút "⬇ Xuất Excel toàn bộ": Alert "Đang xuất file..."
- [x] 11.5 Nút 🔍 tìm kiếm: Alert "Tính năng tìm kiếm đang phát triển"

**File:** `e:\mont2\QuizzMaster_Project\src\frontend\Screens\ReportScreen.js`
**Yêu cầu:** REQ-12
