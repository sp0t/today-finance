import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Image } from 'react-native';

interface ToastProps {
  text: string;
  type?: 'success' | 'error' | 'info';
  timeout?: number;
  icon?: any; // Custom icon source
  position?: number; // Custom position from top
  backgroundColor?: string;
}

const CustomToast: React.FC<ToastProps> = ({
  text,
  type = 'info',
  timeout = 3000,
  icon,
  position = 50,
  backgroundColor,
}) => {
  const [visible, setVisible] = useState(true);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto-hide after timeout
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, timeout);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { top: position, backgroundColor: backgroundColor || getColor(type), opacity: fadeAnim },
      ]}
    >
      {icon && <Image source={icon} style={styles.icon} />}
      <Text style={styles.toastText}>{text}</Text>
    </Animated.View>
  );
};

// Function to determine background color based on type
const getColor = (type: 'success' | 'error' | 'info') => {
  switch (type) {
    case 'success': return '#28a745';
    case 'error': return '#dc3545';
    case 'info': return '#007bff';
    default: return '#333';
  }
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5, // Shadow effect
    zIndex: 1000,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default CustomToast;
