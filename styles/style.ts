// styles.ts or your component file (e.g., LoginScreen.tsx)
import { StyleSheet } from 'react-native';

const baseStyles = StyleSheet.create({
  bgImgContainer: {
    flex: 1,
    width: '100%',
  },
  bgImage: {
    flex: 1,
    width: '100%',
  },
  topContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 70,
  },
  bottomContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
});

export default baseStyles;
