import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const dimensions = {
  screenWidth: width,
  screenHeight: height,
  padding: 16,
  margin: 16,
  borderRadius: 8,
  cardPadding: 16,
  headerHeight: 60,
  buttonHeight: 48,
  inputHeight: 48,
};
