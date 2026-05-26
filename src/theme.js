import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#000080',    // Xanh Navy - Nhận diện chính
    secondary: '#FF8C00',  // Cam - Nhấn (nút, thông báo)
    tertiary: '#228B22',   // Xanh lá - Trạng thái đúng
  },
};