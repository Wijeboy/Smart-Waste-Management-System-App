import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

/**
 * SkeletonLoader component for displaying loading placeholders
 * @param {Object} props - Component props
 * @param {string} props.type - Type of skeleton (card, text, circle)
 * @param {number} props.width - Width of the skeleton
 * @param {number} props.height - Height of the skeleton
 * @param {number} props.borderRadius - Border radius of the skeleton
 * @param {Object} props.style - Additional styles
 */
const SkeletonLoader = ({ 
  type = 'text', 
  width: customWidth, 
  height: customHeight,
  borderRadius: customBorderRadius,
  style = {}
}) => {
  const theme = useTheme();
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  // Default dimensions based on type
  let defaultWidth, defaultHeight, defaultBorderRadius;

  switch (type) {
    case 'card':
      defaultWidth = width - 32;
      defaultHeight = 120;
      defaultBorderRadius = 8;
      break;
    case 'circle':
      defaultWidth = 50;
      defaultHeight = 50;
      defaultBorderRadius = 25;
      break;
    case 'text':
    default:
      defaultWidth = width * 0.7;
      defaultHeight = 16;
      defaultBorderRadius = 4;
      break;
  }

  const finalWidth = customWidth || defaultWidth;
  const finalHeight = customHeight || defaultHeight;
  const finalBorderRadius = customBorderRadius || defaultBorderRadius;

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: finalWidth,
          height: finalHeight,
          borderRadius: finalBorderRadius,
          backgroundColor: theme.colors.backdrop,
          opacity,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    marginVertical: 5,
  },
});

export default SkeletonLoader;