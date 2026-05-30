# Tài liệu Thiết kế

## Tổng quan

Tất cả thay đổi chỉ nằm ở **frontend** — không có thay đổi backend, không thêm thư viện mới. Mỗi file được sửa độc lập với nhau.

## Kiến trúc thay đổi

```
App.js                    ← Thêm 4 màn hình vào Stack.Navigator
AppHeader.js              ← Thêm Alert + navigate cho 🔔 và ⚙️
HomeScreen.js             ← Footer links → TouchableOpacity + Alert
LandingScreen.js          ← searchBox → TouchableOpacity + navigate; Footer links
ExploreScreen.js          ← Filter chips logic; View All Alert; Load More Alert
ProfileScreen.js          ← View All Activity → truyền điểm thực; Footer links
LeaderboardScreen.js      ← Tiếp tục Quiz → navigate Home
ManageScreen.js           ← ✏️ Alert; ⋮ Alert; Xem tất cả Alert; Import Alerts
QuizScreen.js             ← Power-up: doublePoints, freeze timer, skip
QuestionTypeScreen.js     ← Tiếp tục → navigate Admin
ReportScreen.js           ← Xem chi tiết Alert; ⋮ Alert; Xuất Excel Alert; 🔍 Alert
```

## Chi tiết từng file

### 1. App.js
Thêm 4 import và 4 `Stack.Screen`:
```js
import ManageScreen       from './src/frontend/Screens/ManageScreen';
import PowerUpsScreen     from './src/frontend/Screens/PowerUpsScreen';
import QuestionTypeScreen from './src/frontend/Screens/QuestionTypeScreen';
import ReportScreen       from './src/frontend/Screens/ReportScreen';

<Stack.Screen name="Manage"       component={ManageScreen} />
<Stack.Screen name="PowerUps"     component={PowerUpsScreen} />
<Stack.Screen name="QuestionType" component={QuestionTypeScreen} />
<Stack.Screen name="Report"       component={ReportScreen} />
```

### 2. AppHeader.js
- Import `Alert` từ react-native
- Nút 🔔: `onPress={() => Alert.alert('Thông báo', 'Thông báo đang được phát triển')}`
- Nút ⚙️: `onPress={() => navigation.navigate('PowerUps')}`

### 3. HomeScreen.js / LandingScreen.js / ProfileScreen.js
Footer links: thay `<Text>` bằng `<TouchableOpacity onPress={() => Alert.alert('Thông báo', 'Tính năng đang được phát triển')}>`

### 4. LandingScreen.js (thêm)
searchBox: bọc trong `<TouchableOpacity onPress={() => navigation.navigate('Explore')}>`

### 5. ExploreScreen.js
```js
// Thêm state
const [filteredQuizzes, setFilteredQuizzes] = useState(QUIZZES);

// useEffect khi activeFilter thay đổi
useEffect(() => {
  if (activeFilter === 'Popular') setFilteredQuizzes([...QUIZZES]);
  else if (activeFilter === 'Newest') setFilteredQuizzes([...QUIZZES].reverse());
  else if (activeFilter === 'Recommended') setFilteredQuizzes([...QUIZZES].sort(() => Math.random() - 0.5));
}, [activeFilter]);

// View All → Alert
// Load More → Alert
// Render filteredQuizzes thay vì QUIZZES
```

### 6. ProfileScreen.js (thêm)
```js
// View All Activity
onPress={() => navigation.navigate('Leaderboard', { score: user?.highScore || 0, total: 10 })}
```

### 7. LeaderboardScreen.js
```js
// Tiếp tục Quiz
onPress={() => navigation.navigate('Home')}
```

### 8. ManageScreen.js
```js
// ✏️
onPress={() => Alert.alert('Chỉnh sửa', 'Tính năng chỉnh sửa đang phát triển')}

// ⋮
onPress={() => Alert.alert('Tùy chọn', 'Chọn hành động', [
  { text: 'Xem trước', onPress: () => {} },
  { text: 'Xóa', style: 'destructive', onPress: () => {} },
  { text: 'Chia sẻ', onPress: () => {} },
  { text: 'Huỷ', style: 'cancel' },
])}

// Xem tất cả
onPress={() => Alert.alert('Thông báo', 'Đang tải thêm bộ câu hỏi...')}

// Import Excel
onPress={() => Alert.alert('Thông báo', 'Tính năng nhập Excel đang phát triển')}

// Import Google Forms
onPress={() => Alert.alert('Thông báo', 'Tính năng nhập Google Forms đang phát triển')}
```

### 9. QuizScreen.js
```js
// State mới
const [doublePoints, setDoublePoints] = useState(false);
const [powerUpCount, setPowerUpCount] = useState(2); // số lần dùng +1
const [frozen, setFrozen] = useState(false);

// Power-up +1 (Nhân đôi điểm)
const handleDoublePoints = () => {
  if (answered || powerUpCount <= 0) return;
  setDoublePoints(true);
  setPowerUpCount(prev => prev - 1);
};

// Power-up ❄ (Đóng băng 5 giây)
const handleFreeze = () => {
  if (answered || frozen) return;
  setFrozen(true);
  clearInterval(timerRef.current);
  setTimeout(() => {
    setFrozen(false);
    // restart timer
    timerRef.current = setInterval(() => { ... }, 1000);
  }, 5000);
};

// Power-up ⏩ (Bỏ qua)
const handleSkip = () => {
  if (answered) return;
  clearInterval(timerRef.current);
  nextQuestion(score);
};

// Trong handleAnswer: nếu doublePoints thì cộng 20 thay vì 10
const basePoints = doublePoints ? 20 : 10;
setDoublePoints(false); // reset sau khi dùng
```

### 10. QuestionTypeScreen.js
```js
const handleContinue = () => {
  navigation.navigate('Admin'); // thay vì 'Home'
};
```

### 11. ReportScreen.js
```js
// Xem chi tiết
onPress={() => Alert.alert(test.title, `📅 ${test.date}\n👥 ${test.students} học sinh\n✅ Hoàn thành ${test.completion}%`)}

// ⋮
onPress={() => Alert.alert('Tùy chọn', 'Chọn hành động', [
  { text: 'Xuất PDF', onPress: () => {} },
  { text: 'Chia sẻ', onPress: () => {} },
  { text: 'Xóa', style: 'destructive', onPress: () => {} },
  { text: 'Huỷ', style: 'cancel' },
])}

// Xuất Excel
onPress={() => Alert.alert('Thông báo', 'Đang xuất file...')}

// 🔍 Tìm kiếm
onPress={() => Alert.alert('Thông báo', 'Tính năng tìm kiếm đang phát triển')}
```

## Luồng Navigation mới

```
Login → Landing → Home → Quiz → Leaderboard → Home (✓ fixed)
                       ↓
                    Explore (filter chips hoạt động)
                       ↓
                    Profile → Leaderboard (với điểm thực)
                       ↓
                    PowerUps (từ ⚙️ header) (✓ new route)
                       ↓
                    Manage → QuestionType → Admin (✓ fixed)
                       ↓
                    Report (✓ new route)
```

## Không thay đổi
- Backend (src/Api, src/backend)
- Styles / Colors
- useQuiz hook
- Cấu trúc dữ liệu
- Giao diện UI (chỉ thêm TouchableOpacity wrapper khi cần)
