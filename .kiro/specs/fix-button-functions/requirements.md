# Tài liệu Yêu cầu

## Giới thiệu

Dự án QuizzMaster (React Native / Expo) hiện có nhiều nút bấm và liên kết không hoạt động đúng chức năng. Tính năng này nhằm:

1. Đăng ký các màn hình còn thiếu (`ManageScreen`, `PowerUpsScreen`, `QuestionTypeScreen`, `ReportScreen`) vào `App.js`
2. Gắn chức năng cho tất cả các nút hiện đang "chết" (không làm gì khi nhấn)
3. Sửa các lỗi điều hướng sai logic

Không thêm thư viện mới, không thay đổi giao diện — chỉ thêm logic xử lý sự kiện và điều hướng.

## Bảng thuật ngữ

- **App**: Ứng dụng QuizzMaster chạy trên React Native / Expo
- **Stack.Navigator**: Bộ điều hướng ngăn xếp của React Navigation dùng trong `App.js`
- **Navigation**: Hệ thống điều hướng giữa các màn hình
- **Alert**: Hộp thoại thông báo gốc của React Native (`Alert.alert`)
- **Dead button**: Nút bấm có `onPress` trống hoặc không có `onPress`
- **Power-up**: Vật phẩm hỗ trợ trong màn hình chơi quiz (nhân đôi điểm, đóng băng, bỏ qua)
- **Filter chip**: Nút lọc dạng chip (Popular / Newest / Recommended) trong ExploreScreen
- **Footer link**: Liên kết văn bản ở cuối trang (Privacy Policy, Terms of Service, Help Center)
- **ManageScreen**: Màn hình quản lý bộ câu hỏi của giáo viên
- **PowerUpsScreen**: Màn hình cài đặt power-up và giao diện
- **QuestionTypeScreen**: Màn hình chọn loại câu hỏi khi tạo quiz
- **ReportScreen**: Màn hình báo cáo và đánh giá kết quả lớp học
- **FAB**: Nút hành động nổi (Floating Action Button)

---

## Yêu cầu

### Yêu cầu 1: Đăng ký màn hình còn thiếu vào App.js

**User Story:** Là một lập trình viên, tôi muốn tất cả các màn hình được đăng ký trong Stack.Navigator, để người dùng có thể điều hướng đến chúng mà không gặp lỗi "undefined is not an object".

#### Tiêu chí chấp nhận

1. THE App SHALL import và đăng ký `ManageScreen` với tên route `'Manage'` trong `Stack.Navigator`
2. THE App SHALL import và đăng ký `PowerUpsScreen` với tên route `'PowerUps'` trong `Stack.Navigator`
3. THE App SHALL import và đăng ký `QuestionTypeScreen` với tên route `'QuestionType'` trong `Stack.Navigator`
4. THE App SHALL import và đăng ký `ReportScreen` với tên route `'Report'` trong `Stack.Navigator`
5. WHEN bất kỳ màn hình nào gọi `navigation.navigate('Manage' | 'PowerUps' | 'QuestionType' | 'Report')`, THE App SHALL điều hướng thành công đến màn hình tương ứng mà không báo lỗi

---

### Yêu cầu 2: Gắn chức năng cho các nút trong AppHeader

**User Story:** Là một người dùng, tôi muốn các nút thông báo và cài đặt trong header hoạt động, để tôi có thể truy cập nhanh các tính năng liên quan.

#### Tiêu chí chấp nhận

1. WHEN người dùng nhấn nút 🔔 trong `AppHeader`, THE AppHeader SHALL hiển thị `Alert.alert` với tiêu đề "Thông báo" và nội dung "Thông báo đang được phát triển"
2. WHEN người dùng nhấn nút ⚙️ trong `AppHeader`, THE AppHeader SHALL gọi `navigation.navigate('PowerUps')` để điều hướng đến màn hình PowerUps
3. THE AppHeader SHALL nhận prop `navigation` và truyền nó vào handler của cả hai nút

---

### Yêu cầu 3: Gắn chức năng cho Footer links

**User Story:** Là một người dùng, tôi muốn các liên kết footer phản hồi khi nhấn, để tôi biết chúng đang hoạt động dù tính năng chưa hoàn thiện.

#### Tiêu chí chấp nhận

1. WHEN người dùng nhấn "Privacy Policy" trong footer của `HomeScreen`, `LandingScreen`, hoặc `ProfileScreen`, THE Screen SHALL hiển thị `Alert.alert` với nội dung "Tính năng đang được phát triển"
2. WHEN người dùng nhấn "Terms of Service" trong footer của `HomeScreen`, `LandingScreen`, hoặc `ProfileScreen`, THE Screen SHALL hiển thị `Alert.alert` với nội dung "Tính năng đang được phát triển"
3. WHEN người dùng nhấn "Help Center" trong footer của `HomeScreen`, `LandingScreen`, hoặc `ProfileScreen`, THE Screen SHALL hiển thị `Alert.alert` với nội dung "Tính năng đang được phát triển"
4. THE Footer links SHALL được bọc trong `TouchableOpacity` thay vì `Text` thuần để nhận sự kiện nhấn

---

### Yêu cầu 4: Gắn chức năng cho ô tìm kiếm trong LandingScreen

**User Story:** Là một người dùng, tôi muốn ô tìm kiếm trên trang Landing hoạt động, để tôi có thể tìm kiếm chủ đề quiz nhanh chóng.

#### Tiêu chí chấp nhận

1. WHEN người dùng nhấn vào ô tìm kiếm (`searchBox`) trong `LandingScreen`, THE LandingScreen SHALL gọi `navigation.navigate('Explore')` để điều hướng đến màn hình Explore
2. THE searchBox SHALL được bọc trong `TouchableOpacity` với `activeOpacity={0.8}` để phản hồi thị giác khi nhấn

---

### Yêu cầu 5: Gắn chức năng cho Filter chips trong ExploreScreen

**User Story:** Là một người dùng, tôi muốn các chip lọc "Popular/Newest/Recommended" thực sự lọc danh sách quiz, để tôi có thể tìm quiz phù hợp với nhu cầu.

#### Tiêu chí chấp nhận

1. WHEN người dùng nhấn chip "Popular", THE ExploreScreen SHALL hiển thị danh sách `QUIZZES` theo thứ tự mặc định (index tăng dần)
2. WHEN người dùng nhấn chip "Newest", THE ExploreScreen SHALL hiển thị danh sách `QUIZZES` theo thứ tự đảo ngược (index giảm dần)
3. WHEN người dùng nhấn chip "Recommended", THE ExploreScreen SHALL hiển thị danh sách `QUIZZES` theo thứ tự ngẫu nhiên (shuffle)
4. THE ExploreScreen SHALL dùng state `filteredQuizzes` để render danh sách quiz thay vì dùng trực tiếp `QUIZZES`
5. WHEN `activeFilter` thay đổi, THE ExploreScreen SHALL cập nhật `filteredQuizzes` tương ứng

---

### Yêu cầu 6: Sửa nút "View All" và "Load More Quizzes" trong ExploreScreen

**User Story:** Là một người dùng, tôi muốn nút "View All" và "Load More Quizzes" hoạt động đúng, để tôi không bị điều hướng nhầm vào màn hình Quiz.

#### Tiêu chí chấp nhận

1. WHEN người dùng nhấn "View All" trong phần Categories của `ExploreScreen`, THE ExploreScreen SHALL hiển thị `Alert.alert` với nội dung "Đang tải thêm danh mục..."
2. WHEN người dùng nhấn "Load More Quizzes", THE ExploreScreen SHALL hiển thị `Alert.alert` với nội dung "Đang tải thêm..." thay vì điều hướng vào Quiz

---

### Yêu cầu 7: Sửa nút "View All Activity" trong ProfileScreen

**User Story:** Là một người dùng, tôi muốn nút "View All Activity →" điều hướng đến Leaderboard với điểm thực của tôi, để tôi thấy vị trí xếp hạng chính xác.

#### Tiêu chí chấp nhận

1. WHEN người dùng nhấn "View All Activity →" trong `ProfileScreen`, THE ProfileScreen SHALL gọi `navigation.navigate('Leaderboard', { score: user?.highScore || 0, total: 10 })` để truyền điểm thực của user
2. IF `user` là null hoặc `user.highScore` không tồn tại, THEN THE ProfileScreen SHALL truyền `score: 0` làm giá trị mặc định

---

### Yêu cầu 8: Sửa nút "▶ Tiếp tục Quiz" trong LeaderboardScreen

**User Story:** Là một người dùng, sau khi xem bảng xếp hạng, tôi muốn nút "Tiếp tục Quiz" đưa tôi về Home thay vì bắt đầu quiz mới, để tôi có thể chọn chế độ chơi tiếp theo.

#### Tiêu chí chấp nhận

1. WHEN người dùng nhấn "▶ Tiếp tục Quiz" trong `LeaderboardScreen`, THE LeaderboardScreen SHALL gọi `navigation.navigate('Home')` thay vì `navigation.navigate('Quiz', { gameType: 'Quiz' })`

---

### Yêu cầu 9: Gắn chức năng cho các nút trong ManageScreen

**User Story:** Là một giáo viên, tôi muốn các nút trong màn hình quản lý quiz hoạt động, để tôi có thể tương tác với danh sách bộ câu hỏi của mình.

#### Tiêu chí chấp nhận

1. WHEN người dùng nhấn nút ✏️ (sửa quiz) trong `ManageScreen`, THE ManageScreen SHALL hiển thị `Alert.alert` với tiêu đề "Chỉnh sửa" và nội dung "Tính năng chỉnh sửa đang phát triển"
2. WHEN người dùng nhấn nút ⋮ (menu) trong `ManageScreen`, THE ManageScreen SHALL hiển thị `Alert.alert` với tiêu đề "Tùy chọn" và các lựa chọn: "Xem trước", "Xóa", "Chia sẻ", "Huỷ"
3. WHEN người dùng nhấn "Xem tất cả" trong phần "Bộ câu hỏi của tôi", THE ManageScreen SHALL hiển thị `Alert.alert` với nội dung "Đang tải thêm bộ câu hỏi..."
4. WHEN người dùng nhấn "Nhập từ Excel", THE ManageScreen SHALL hiển thị `Alert.alert` với nội dung "Tính năng nhập Excel đang phát triển"
5. WHEN người dùng nhấn "Nhập từ Google Forms", THE ManageScreen SHALL hiển thị `Alert.alert` với nội dung "Tính năng nhập Google Forms đang phát triển"

---

### Yêu cầu 10: Gắn chức năng Power-up trong QuizScreen

**User Story:** Là một người chơi, tôi muốn các nút power-up trong màn hình quiz hoạt động, để tôi có thể sử dụng vật phẩm hỗ trợ trong lúc chơi.

#### Tiêu chí chấp nhận

1. WHEN người dùng nhấn nút +1 (Nhân đôi điểm) trong `QuizScreen`, THE QuizScreen SHALL kích hoạt trạng thái `doublePoints = true` và giảm số lần dùng còn lại của power-up đó đi 1
2. WHEN `doublePoints` là `true` và người dùng trả lời đúng câu tiếp theo, THE QuizScreen SHALL cộng điểm gấp đôi (20 điểm thay vì 10) và đặt lại `doublePoints = false`
3. WHEN người dùng nhấn nút ❄ (Đóng băng) trong `QuizScreen`, THE QuizScreen SHALL dừng timer trong 5 giây rồi tiếp tục đếm ngược bình thường
4. WHEN người dùng nhấn nút ⏩ (Bỏ qua) trong `QuizScreen`, THE QuizScreen SHALL bỏ qua câu hiện tại và chuyển sang câu tiếp theo mà không tính điểm
5. IF người dùng đang ở câu cuối cùng và nhấn ⏩, THEN THE QuizScreen SHALL điều hướng đến `Leaderboard` với điểm hiện tại
6. WHILE `answered` là `true`, THE QuizScreen SHALL vô hiệu hóa tất cả các nút power-up để tránh dùng sau khi đã trả lời

---

### Yêu cầu 11: Sửa nút "Tiếp tục →" trong QuestionTypeScreen

**User Story:** Là một giáo viên, tôi muốn nút "Tiếp tục →" trong màn hình chọn loại câu hỏi điều hướng đến màn hình tạo câu hỏi, không phải về Home.

#### Tiêu chí chấp nhận

1. WHEN người dùng nhấn "Tiếp tục →" trong `QuestionTypeScreen`, THE QuestionTypeScreen SHALL gọi `navigation.navigate('Admin')` thay vì `navigation.navigate('Home')`

---

### Yêu cầu 12: Gắn chức năng cho các nút trong ReportScreen

**User Story:** Là một giáo viên, tôi muốn các nút trong màn hình báo cáo hoạt động, để tôi có thể xem chi tiết và xuất dữ liệu kết quả lớp học.

#### Tiêu chí chấp nhận

1. WHEN người dùng nhấn "Xem chi tiết" trong `ReportScreen`, THE ReportScreen SHALL hiển thị `Alert.alert` với tiêu đề là tên bài kiểm tra và nội dung gồm ngày, số học sinh, tỉ lệ hoàn thành
2. WHEN người dùng nhấn nút ⋮ trong `ReportScreen`, THE ReportScreen SHALL hiển thị `Alert.alert` với tiêu đề "Tùy chọn" và các lựa chọn: "Xuất PDF", "Chia sẻ", "Xóa", "Huỷ"
3. WHEN người dùng nhấn "⬇ Xuất Excel toàn bộ" trong `ReportScreen`, THE ReportScreen SHALL hiển thị `Alert.alert` với nội dung "Đang xuất file..."
4. WHEN người dùng nhấn nút 🔍 tìm kiếm trong `ReportScreen`, THE ReportScreen SHALL hiển thị `Alert.alert` với nội dung "Tính năng tìm kiếm đang phát triển"
