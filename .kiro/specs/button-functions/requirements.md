# Requirements Document

## Introduction

Tính năng này hoàn thiện chức năng cho tất cả các nút và liên kết trong ứng dụng QuizzMaster (React Native / Expo) hiện đang có UI nhưng chưa có logic. Phạm vi bao gồm: đăng ký màn hình còn thiếu trong navigator, các nút header, bộ lọc danh sách, power-up trong màn hình quiz, điều hướng sai, và các liên kết footer. Không thêm thư viện mới; toàn bộ Alert dùng tiếng Việt; giữ nguyên style/UI hiện tại.

## Glossary

- **App**: Ứng dụng QuizzMaster chạy trên React Native / Expo.
- **Navigator**: Stack.Navigator của React Navigation được khai báo trong `App.js`.
- **AppHeader**: Component dùng chung hiển thị logo, tab điều hướng và hai nút icon (🔔, ⚙️).
- **ExploreScreen**: Màn hình khám phá quiz, chứa bộ lọc, danh sách quiz và nút "Load More".
- **LeaderboardScreen**: Màn hình bảng xếp hạng hiển thị sau khi hoàn thành quiz.
- **ManageScreen**: Màn hình quản lý bộ câu hỏi của giáo viên/người dùng.
- **QuizScreen**: Màn hình chơi quiz, chứa các power-up button.
- **ProfileScreen**: Màn hình hồ sơ người dùng.
- **PowerUpsScreen**: Màn hình cài đặt power-up và giao diện.
- **ManageScreen**: Màn hình quản lý bộ câu hỏi.
- **QuestionTypeScreen**: Màn hình chọn loại câu hỏi khi tạo quiz.
- **ReportScreen**: Màn hình báo cáo kết quả.
- **Power-up**: Vật phẩm hỗ trợ trong QuizScreen (Nhân đôi điểm, Đóng băng, Bỏ qua).
- **Filter chip**: Nút lọc "Popular / Newest / Recommended" trong ExploreScreen.
- **Footer link**: Các liên kết văn bản "Privacy Policy", "Terms of Service", "Help Center" ở cuối màn hình.
- **QUIZZES**: Mảng dữ liệu mock các quiz hiển thị trong ExploreScreen.
- **doublePoints**: Trạng thái power-up nhân đôi điểm đang kích hoạt trong QuizScreen.
- **frozen**: Trạng thái power-up đóng băng timer đang kích hoạt trong QuizScreen.

## Requirements

### Requirement 1: Đăng ký màn hình còn thiếu trong Navigator

**User Story:** Là một người dùng, tôi muốn điều hướng đến tất cả các màn hình trong ứng dụng, để tôi có thể sử dụng đầy đủ tính năng mà không gặp lỗi "undefined is not an object".

#### Acceptance Criteria

1. THE Navigator SHALL đăng ký `ManageScreen` với tên route `"Manage"`.
2. THE Navigator SHALL đăng ký `PowerUpsScreen` với tên route `"PowerUps"`.
3. THE Navigator SHALL đăng ký `QuestionTypeScreen` với tên route `"QuestionType"`.
4. THE Navigator SHALL đăng ký `ReportScreen` với tên route `"Report"`.
5. WHEN bất kỳ màn hình nào gọi `navigation.navigate('Manage')`, `navigation.navigate('PowerUps')`, `navigation.navigate('QuestionType')`, hoặc `navigation.navigate('Report')`, THE Navigator SHALL điều hướng đến màn hình tương ứng mà không báo lỗi.

---

### Requirement 2: AppHeader — Nút thông báo và cài đặt

**User Story:** Là một người dùng, tôi muốn các nút icon trên header phản hồi khi tôi nhấn, để tôi biết ứng dụng đang hoạt động và có thể truy cập cài đặt.

#### Acceptance Criteria

1. WHEN người dùng nhấn nút 🔔 trong AppHeader, THE AppHeader SHALL hiển thị Alert với tiêu đề "Thông báo" và nội dung "Tính năng thông báo sắp ra mắt".
2. WHEN người dùng nhấn nút ⚙️ trong AppHeader, THE AppHeader SHALL điều hướng đến màn hình `PowerUps`.
3. THE AppHeader SHALL nhận prop `navigation` và sử dụng nó để thực hiện điều hướng từ nút ⚙️.

---

### Requirement 3: ExploreScreen — Bộ lọc Filter chips

**User Story:** Là một người dùng, tôi muốn lọc danh sách quiz theo tiêu chí "Popular", "Newest", "Recommended", để tôi tìm được quiz phù hợp nhanh hơn.

#### Acceptance Criteria

1. WHEN người dùng nhấn chip "Popular", THE ExploreScreen SHALL hiển thị danh sách QUIZZES được sắp xếp theo số lượt chơi giảm dần (quiz có `hot: true` lên đầu).
2. WHEN người dùng nhấn chip "Newest", THE ExploreScreen SHALL hiển thị danh sách QUIZZES được sắp xếp theo `id` giảm dần (id lớn hơn = mới hơn).
3. WHEN người dùng nhấn chip "Recommended", THE ExploreScreen SHALL hiển thị danh sách QUIZZES được sắp xếp theo số câu hỏi giảm dần.
4. WHEN bộ lọc thay đổi, THE ExploreScreen SHALL cập nhật danh sách quiz hiển thị ngay lập tức mà không cần tải lại trang.

---

### Requirement 4: ExploreScreen — Nút "View All" trong Categories

**User Story:** Là một người dùng, tôi muốn nút "View All" trong phần Categories không gây vòng lặp điều hướng, để ứng dụng không bị treo hoặc hành xử bất thường.

#### Acceptance Criteria

1. THE ExploreScreen SHALL xóa hoặc vô hiệu hóa hành động `onPress` của nút "View All" trong phần Categories để tránh navigate về chính ExploreScreen.
2. IF nút "View All" vẫn hiển thị, THEN THE ExploreScreen SHALL không thực hiện bất kỳ điều hướng nào khi nhấn vào nút đó.

---

### Requirement 5: ExploreScreen — Nút "Load More Quizzes"

**User Story:** Là một người dùng, tôi muốn nhấn "Load More Quizzes" để xem thêm quiz, thay vì bị chuyển thẳng vào màn hình chơi quiz.

#### Acceptance Criteria

1. WHEN người dùng nhấn "Load More Quizzes", THE ExploreScreen SHALL thêm ít nhất 2 quiz mock mới vào cuối danh sách QUIZZES đang hiển thị.
2. WHEN người dùng nhấn "Load More Quizzes", THE ExploreScreen SHALL KHÔNG điều hướng đến QuizScreen.
3. WHEN danh sách quiz được mở rộng, THE ExploreScreen SHALL hiển thị tất cả quiz bao gồm cả các quiz mới được thêm vào.

---

### Requirement 6: LeaderboardScreen — Nút "Tiếp tục Quiz"

**User Story:** Là một người dùng, sau khi xem bảng xếp hạng, tôi muốn nhấn "Tiếp tục Quiz" để quay về màn hình Home, không phải bắt đầu một quiz mới.

#### Acceptance Criteria

1. WHEN người dùng nhấn nút "▶ Tiếp tục Quiz" trong LeaderboardScreen, THE LeaderboardScreen SHALL điều hướng đến màn hình `Home`.
2. THE LeaderboardScreen SHALL KHÔNG điều hướng đến QuizScreen khi nhấn nút "▶ Tiếp tục Quiz".

---

### Requirement 7: ManageScreen — Nút chỉnh sửa và menu quiz

**User Story:** Là một giáo viên, tôi muốn các nút hành động trên mỗi quiz phản hồi khi nhấn, để tôi biết tính năng đang được phát triển và có thể thực hiện các thao tác cơ bản.

#### Acceptance Criteria

1. WHEN người dùng nhấn nút ✏️ trên một quiz trong ManageScreen, THE ManageScreen SHALL hiển thị Alert với tiêu đề "Chỉnh sửa" và nội dung "Tính năng chỉnh sửa sắp ra mắt".
2. WHEN người dùng nhấn nút ⋮ trên một quiz trong ManageScreen, THE ManageScreen SHALL hiển thị Alert/ActionSheet với các tùy chọn: "Xem trước", "Chia sẻ", "Xóa".
3. WHEN người dùng nhấn "Xem tất cả" trong ManageScreen, THE ManageScreen SHALL điều hướng đến màn hình `Explore`.
4. WHEN người dùng nhấn "Nhập từ Excel", THE ManageScreen SHALL hiển thị Alert với tiêu đề "Nhập từ Excel" và nội dung "Tính năng nhập Excel sắp ra mắt".
5. WHEN người dùng nhấn "Nhập từ Google Forms", THE ManageScreen SHALL hiển thị Alert với tiêu đề "Nhập từ Google Forms" và nội dung "Tính năng nhập Google Forms sắp ra mắt".

---

### Requirement 8: QuizScreen — Power-up Nhân đôi điểm (+1)

**User Story:** Là một người chơi, tôi muốn sử dụng power-up Nhân đôi điểm để nhận +20 điểm thay vì +10 cho câu trả lời đúng tiếp theo, để tôi có chiến lược tăng điểm.

#### Acceptance Criteria

1. WHEN người dùng nhấn nút "+1" (Nhân đôi điểm) trong QuizScreen, THE QuizScreen SHALL kích hoạt trạng thái `doublePoints`.
2. WHILE trạng thái `doublePoints` đang kích hoạt, THE QuizScreen SHALL hiển thị badge "2X ACTIVE" gần nút "+1".
3. WHEN người dùng trả lời đúng câu hỏi tiếp theo WHILE `doublePoints` đang kích hoạt, THE QuizScreen SHALL cộng +20 điểm thay vì +10 điểm.
4. WHEN người dùng trả lời đúng WHILE `doublePoints` đang kích hoạt, THE QuizScreen SHALL tắt trạng thái `doublePoints` ngay lập tức sau khi điểm được trao (chỉ áp dụng một lần).

---

### Requirement 9: QuizScreen — Power-up Đóng băng (❄)

**User Story:** Là một người chơi, tôi muốn sử dụng power-up Đóng băng để dừng đồng hồ đếm ngược 5 giây, để tôi có thêm thời gian suy nghĩ.

#### Acceptance Criteria

1. WHEN người dùng nhấn nút ❄ (Đóng băng) trong QuizScreen, THE QuizScreen SHALL dừng timer trong 5 giây.
2. WHILE timer đang bị đóng băng, THE QuizScreen SHALL hiển thị badge "FROZEN" gần nút ❄.
3. WHEN 5 giây đóng băng kết thúc, THE QuizScreen SHALL tiếp tục đếm ngược từ giá trị `timeLeft` hiện tại.
4. WHILE timer đang bị đóng băng, THE QuizScreen SHALL KHÔNG giảm giá trị `timeLeft`.

---

### Requirement 10: QuizScreen — Power-up Bỏ qua (⏩)

**User Story:** Là một người chơi, tôi muốn sử dụng power-up Bỏ qua để chuyển sang câu hỏi tiếp theo mà không cần trả lời, để tôi có thể bỏ qua câu hỏi quá khó.

#### Acceptance Criteria

1. WHEN người dùng nhấn nút ⏩ (Bỏ qua) trong QuizScreen, THE QuizScreen SHALL chuyển sang câu hỏi tiếp theo mà không tính điểm cho câu hiện tại.
2. WHEN người dùng nhấn ⏩ ở câu hỏi cuối cùng, THE QuizScreen SHALL điều hướng đến LeaderboardScreen với điểm hiện tại.
3. WHEN người dùng nhấn ⏩, THE QuizScreen SHALL reset trạng thái `answered`, `selectedAnswer`, `textInput` và `timeLeft` như khi chuyển câu bình thường.

---

### Requirement 11: ProfileScreen — "View All Activity"

**User Story:** Là một người dùng, tôi muốn nhấn "View All Activity" để xem bảng xếp hạng với điểm thực của mình, không phải điểm mặc định là 0.

#### Acceptance Criteria

1. WHEN người dùng nhấn "View All Activity →" trong ProfileScreen, THE ProfileScreen SHALL điều hướng đến màn hình `Leaderboard` với tham số `score` là điểm cao nhất của người dùng (`user?.highScore`).
2. IF `user?.highScore` không có giá trị, THEN THE ProfileScreen SHALL truyền `score: 0` khi điều hướng đến Leaderboard.

---

### Requirement 12: Footer links — Privacy Policy, Terms of Service, Help Center

**User Story:** Là một người dùng, tôi muốn nhấn vào các liên kết footer để xem thông tin tương ứng, để tôi biết ứng dụng có phản hồi và có thể tìm hiểu thêm.

#### Acceptance Criteria

1. WHEN người dùng nhấn "Privacy Policy" trong bất kỳ màn hình nào (HomeScreen, LandingScreen, ProfileScreen, ExploreScreen), THE màn hình đó SHALL hiển thị Alert với tiêu đề "Chính sách bảo mật" và nội dung mô tả ngắn về chính sách bảo mật bằng tiếng Việt.
2. WHEN người dùng nhấn "Terms of Service" trong bất kỳ màn hình nào, THE màn hình đó SHALL hiển thị Alert với tiêu đề "Điều khoản dịch vụ" và nội dung mô tả ngắn về điều khoản dịch vụ bằng tiếng Việt.
3. WHEN người dùng nhấn "Help Center" trong bất kỳ màn hình nào, THE màn hình đó SHALL hiển thị Alert với tiêu đề "Trung tâm hỗ trợ" và nội dung hướng dẫn liên hệ hỗ trợ bằng tiếng Việt.
4. THE footer links SHALL được bọc trong `TouchableOpacity` thay vì `Text` thuần để nhận sự kiện nhấn.
