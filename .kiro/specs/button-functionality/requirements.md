# Tài liệu Yêu cầu

## Introduction

Tính năng **button-functionality** nhằm mục đích implement đầy đủ chức năng cho tất cả các nút bấm và liên kết trong ứng dụng QuizzMaster (React Native / Expo). Hiện tại, nhiều nút trong app không có hành động hoặc có logic điều hướng sai, gây ra trải nghiệm người dùng kém và các lỗi runtime. Phạm vi bao gồm: đăng ký màn hình thiếu trong navigator, sửa điều hướng sai, thêm phản hồi cho các nút placeholder, và implement logic power-up trong màn hình quiz.

## Bảng thuật ngữ

- **Navigator**: Stack.Navigator của React Navigation quản lý việc chuyển màn hình.
- **AppHeader**: Component header dùng chung hiển thị logo, tab điều hướng và các icon hành động.
- **Footer_Links**: Các liên kết văn bản ở cuối màn hình (Privacy Policy, Terms of Service, Help Center).
- **Power_Up**: Vật phẩm hỗ trợ trong QuizScreen giúp người chơi có lợi thế (thêm thời gian, đóng băng, bỏ qua).
- **ManageScreen**: Màn hình quản lý bộ câu hỏi dành cho giáo viên/người tạo nội dung.
- **QuestionTypeScreen**: Màn hình chọn loại câu hỏi khi tạo bài quiz mới.
- **PowerUpsScreen**: Màn hình cài đặt power-up, meme và âm nhạc.
- **ReportScreen**: Màn hình báo cáo và đánh giá kết quả lớp học.
- **LeaderboardScreen**: Màn hình bảng xếp hạng hiển thị sau khi hoàn thành quiz.
- **Alert**: Hộp thoại thông báo native của React Native.
- **gameType**: Tham số truyền vào QuizScreen để xác định chế độ chơi.
- **timeLeft**: Biến state trong QuizScreen lưu số giây còn lại của câu hỏi hiện tại.

---

## Requirements

### Requirement 1

**User Story:** Là một người dùng, tôi muốn có thể điều hướng đến tất cả các màn hình trong app, để tôi không gặp lỗi "route not found" khi nhấn nút.

#### Acceptance Criteria

1. THE Navigator SHALL đăng ký `ManageScreen` với tên route `"Manage"` trong Stack.Navigator của `App.js`.
2. THE Navigator SHALL đăng ký `PowerUpsScreen` với tên route `"PowerUps"` trong Stack.Navigator của `App.js`.
3. THE Navigator SHALL đăng ký `QuestionTypeScreen` với tên route `"QuestionType"` trong Stack.Navigator của `App.js`.
4. THE Navigator SHALL đăng ký `ReportScreen` với tên route `"Report"` trong Stack.Navigator của `App.js`.
5. WHEN bất kỳ màn hình nào gọi `navigation.navigate('Manage')`, `navigation.navigate('PowerUps')`, `navigation.navigate('QuestionType')`, hoặc `navigation.navigate('Report')`, THE Navigator SHALL điều hướng đến màn hình tương ứng mà không ném lỗi.

---

### Requirement 2

**User Story:** Là một người dùng, tôi muốn các nút icon trong header có phản hồi khi nhấn, để tôi biết chúng đang hoạt động và có thể truy cập tính năng tương ứng.

#### Acceptance Criteria

1. WHEN người dùng nhấn nút 🔔 trong `AppHeader`, THE AppHeader SHALL hiển thị một `Alert` với tiêu đề "Thông báo" và nội dung "Bạn không có thông báo mới."
2. WHEN người dùng nhấn nút ⚙️ trong `AppHeader`, THE AppHeader SHALL gọi `navigation.navigate('PowerUps')` để điều hướng đến `PowerUpsScreen`.

---

### Requirement 3

**User Story:** Là một người dùng, tôi muốn các liên kết footer phản hồi khi nhấn, để tôi biết chúng đang hoạt động ngay cả khi tính năng chưa được triển khai đầy đủ.

#### Acceptance Criteria

1. WHEN người dùng nhấn "Privacy Policy" trong footer của `HomeScreen`, `LandingScreen`, `ProfileScreen`, hoặc `ExploreScreen`, THE System SHALL hiển thị một `Alert` với tiêu đề "Chính sách bảo mật" và nội dung "Tính năng đang được phát triển."
2. WHEN người dùng nhấn "Terms of Service" trong footer của `HomeScreen`, `LandingScreen`, `ProfileScreen`, hoặc `ExploreScreen`, THE System SHALL hiển thị một `Alert` với tiêu đề "Điều khoản dịch vụ" và nội dung "Tính năng đang được phát triển."
3. WHEN người dùng nhấn "Help Center" trong footer của `HomeScreen`, `LandingScreen`, `ProfileScreen`, hoặc `ExploreScreen`, THE System SHALL hiển thị một `Alert` với tiêu đề "Trung tâm hỗ trợ" và nội dung "Tính năng đang được phát triển."
4. THE Footer_Links SHALL được bọc trong `TouchableOpacity` thay vì `Text` thuần để nhận sự kiện nhấn.

---

### Requirement 4

**User Story:** Là một người dùng, tôi muốn ô tìm kiếm trên trang Landing có thể nhập và tìm kiếm, để tôi có thể nhanh chóng tìm quiz theo chủ đề.

#### Acceptance Criteria

1. THE LandingScreen SHALL thay thế `View` tĩnh của `searchBox` bằng một `TextInput` có thể nhập liệu với state `searchQuery`.
2. WHEN người dùng nhập văn bản vào ô tìm kiếm và nhấn nút tìm kiếm hoặc submit bàn phím, THE LandingScreen SHALL gọi `navigation.navigate('Explore', { searchQuery: <văn bản đã nhập> })`.
3. WHEN `ExploreScreen` nhận được tham số `searchQuery` từ route params, THE ExploreScreen SHALL tự động điền giá trị đó vào `TextInput` tìm kiếm của màn hình.

---

### Requirement 5

**User Story:** Là một người dùng, tôi muốn các chip lọc và nút "Load More" hoạt động đúng chức năng, để tôi có thể lọc và xem thêm quiz theo nhu cầu.

#### Acceptance Criteria

1. WHEN người dùng nhấn chip "Popular", THE ExploreScreen SHALL sắp xếp danh sách `QUIZZES` theo số lượt chơi giảm dần.
2. WHEN người dùng nhấn chip "Newest", THE ExploreScreen SHALL sắp xếp danh sách `QUIZZES` theo thứ tự id giảm dần (mới nhất trước).
3. WHEN người dùng nhấn chip "Recommended", THE ExploreScreen SHALL hiển thị danh sách `QUIZZES` theo thứ tự được đề xuất khác với Popular và Newest.
4. WHEN người dùng nhấn "View All" trong phần Categories của `ExploreScreen`, THE ExploreScreen SHALL cuộn màn hình xuống phần "Trending Quizzes" thay vì navigate về chính nó.
5. WHEN người dùng nhấn "Load More Quizzes", THE ExploreScreen SHALL thêm ít nhất 2 quiz mock vào danh sách hiển thị thay vì điều hướng vào QuizScreen.

---

### Requirement 6

**User Story:** Là một người dùng, tôi muốn nút "View All Activity" điều hướng đến Leaderboard với dữ liệu đúng, để tôi có thể xem bảng xếp hạng thực sự.

#### Acceptance Criteria

1. WHEN người dùng nhấn "View All Activity →" trong `ProfileScreen`, THE ProfileScreen SHALL gọi `navigation.navigate('Leaderboard', { score: user?.highScore || 0, total: 10 })` thay vì truyền `score: 0` cứng.

---

### Requirement 7

**User Story:** Là một người dùng, sau khi xem bảng xếp hạng, tôi muốn nút "Tiếp tục" đưa tôi về màn hình chính thay vì bắt đầu quiz mới, để tôi có thể chọn hành động tiếp theo.

#### Acceptance Criteria

1. WHEN người dùng nhấn "▶ Tiếp tục Quiz" trong `LeaderboardScreen`, THE LeaderboardScreen SHALL gọi `navigation.navigate('Home')` thay vì `navigation.navigate('Quiz', { gameType: 'Quiz' })`.

---

### Requirement 8

**User Story:** Là một giáo viên, tôi muốn các nút quản lý quiz có phản hồi khi nhấn, để tôi biết hệ thống đã nhận lệnh của tôi ngay cả khi tính năng chưa hoàn thiện.

#### Acceptance Criteria

1. WHEN người dùng nhấn nút ✏️ của một quiz trong `ManageScreen`, THE ManageScreen SHALL hiển thị `Alert` với tiêu đề "Chỉnh sửa quiz" và nội dung "Tính năng đang được phát triển."
2. WHEN người dùng nhấn nút ⋮ của một quiz trong `ManageScreen`, THE ManageScreen SHALL hiển thị `Alert` với tiêu đề "Tùy chọn" và các nút: "Sửa", "Xoá", "Chia sẻ", và "Huỷ".
3. WHEN người dùng nhấn "Xem tất cả" trong `ManageScreen`, THE ManageScreen SHALL hiển thị toàn bộ danh sách quiz bao gồm các quiz ẩn nếu có.
4. WHEN người dùng nhấn "Nhập từ Excel" trong `ManageScreen`, THE ManageScreen SHALL hiển thị `Alert` với tiêu đề "Nhập từ Excel" và nội dung "Tính năng đang được phát triển."
5. WHEN người dùng nhấn "Nhập từ Google Forms" trong `ManageScreen`, THE ManageScreen SHALL hiển thị `Alert` với tiêu đề "Nhập từ Google Forms" và nội dung "Tính năng đang được phát triển."

---

### Requirement 9

**User Story:** Là một người chơi, tôi muốn các nút power-up trong màn hình quiz thực sự có tác dụng, để tôi có thể sử dụng chúng như một chiến lược trong khi làm bài.

#### Acceptance Criteria

1. WHEN người dùng nhấn nút +1 trong `QuizScreen`, THE QuizScreen SHALL cộng thêm 15 giây vào giá trị `timeLeft` hiện tại.
2. WHEN người dùng nhấn nút ❄ trong `QuizScreen`, THE QuizScreen SHALL tạm dừng bộ đếm thời gian trong 5 giây, sau đó tự động tiếp tục đếm ngược.
3. WHEN người dùng nhấn nút ⏩ trong `QuizScreen`, THE QuizScreen SHALL bỏ qua câu hỏi hiện tại mà không tính điểm và chuyển sang câu hỏi tiếp theo, hoặc kết thúc quiz nếu là câu cuối.
4. WHILE `answered === true`, THE QuizScreen SHALL vô hiệu hóa tất cả các nút power-up để tránh sử dụng sau khi đã trả lời.

---

### Requirement 10

**User Story:** Là một người dùng, tôi muốn các nút trong màn hình Power-ups có phản hồi, để tôi có thể hiểu chức năng của từng vật phẩm và tùy chỉnh cài đặt.

#### Acceptance Criteria

1. WHEN người dùng nhấn nút "Thiết lập" của một power-up trong `PowerUpsScreen`, THE PowerUpsScreen SHALL hiển thị `Alert` với tiêu đề là tên power-up và nội dung là mô tả chi tiết của power-up đó.
2. WHEN người dùng nhấn "+ Thêm bộ Meme mới" trong `PowerUpsScreen`, THE PowerUpsScreen SHALL hiển thị `Alert` với tiêu đề "Thêm bộ Meme" và nội dung "Tính năng đang được phát triển."
3. WHEN người dùng nhấn vào dropdown "Nhạc nền buổi học" trong `PowerUpsScreen`, THE PowerUpsScreen SHALL hiển thị `Alert` với các tùy chọn từ `MUSIC_OPTIONS` và cập nhật `selectedMusic` state khi người dùng chọn một tùy chọn.

---

### Requirement 11

**User Story:** Là một giáo viên, tôi muốn các nút trong màn hình báo cáo có phản hồi, để tôi có thể xem chi tiết và quản lý kết quả kiểm tra.

#### Acceptance Criteria

1. WHEN người dùng nhấn "Xem chi tiết" của một bài kiểm tra trong `ReportScreen`, THE ReportScreen SHALL hiển thị `Alert` với tiêu đề là tên bài kiểm tra và nội dung hiển thị ngày, số học sinh, và tỉ lệ hoàn thành.
2. WHEN người dùng nhấn "⋮" của một bài kiểm tra trong `ReportScreen`, THE ReportScreen SHALL hiển thị `Alert` với tiêu đề "Tùy chọn" và các nút: "Xuất PDF", "Xoá", và "Huỷ".
3. WHEN người dùng nhấn "⬇ Xuất Excel toàn bộ" trong `ReportScreen`, THE ReportScreen SHALL hiển thị `Alert` với tiêu đề "Xuất dữ liệu" và nội dung "Đang xuất file Excel, vui lòng chờ..."

---

### Requirement 12

**User Story:** Là một giáo viên, tôi muốn các nút trong màn hình chọn loại câu hỏi điều hướng đúng, để luồng tạo quiz hoạt động liền mạch.

#### Acceptance Criteria

1. WHEN người dùng nhấn "Dùng thử câu hỏi mẫu" trong `QuestionTypeScreen`, THE QuestionTypeScreen SHALL gọi `navigation.navigate('Quiz', { gameType: <gameType tương ứng với loại câu hỏi đầu tiên được chọn> })`.
2. WHEN người dùng nhấn "Tiếp tục →" trong `QuestionTypeScreen`, THE QuestionTypeScreen SHALL gọi `navigation.navigate('Manage')` thay vì `navigation.navigate('Home')`.
3. THE QuestionTypeScreen SHALL ánh xạ từng loại câu hỏi sang `gameType` tương ứng: "Trắc nghiệm" → `'Quiz'`, "Điền vào chỗ trống" → `'FillInBlank'`, "Câu hỏi mở" → `'Quiz'`, "Khảo sát" → `'Quiz'`, "Vẽ" → `'Flashcard'`, "Sắp xếp chữ tự" → `'WordScramble'`.
