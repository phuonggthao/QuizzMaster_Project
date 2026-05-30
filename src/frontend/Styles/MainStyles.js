import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const MainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgApp,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
  },
  buttonOutline: {
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
});
