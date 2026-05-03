import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const MainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  glassCard: {
    backgroundColor: Colors.glass,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingVertical: 12,
  }
});