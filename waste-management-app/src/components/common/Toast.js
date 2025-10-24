import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';

/**
 * Toast component for displaying temporary messages
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Whether the toast is visible
 * @param {string} props.message - Message to display
 * @param {string} props.type - Type of toast (success, error, info)
 * @param {Function} props.onDismiss - Function to call when toast is dismissed
 */
const Toast = ({ 
  visible, 
  message, 
  type = 'success', 
  onDismiss 
}) => {
  const theme = useTheme();
  const translateY = React.useRef(new Animated.Value(100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, opacity]);

  // Determine background color based on type
  let backgroundColor;
  switch (type) {
    case 'success':
      backgroundColor = theme.colors.success || '#4CAF50';
      break;
    case 'error':
      backgroundColor = theme.colors.error;
      break;
    case 'info':
    default:
      backgroundColor = theme.colors.primary;
      break;
  }

  if (!visible && opacity._value === 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Toast;