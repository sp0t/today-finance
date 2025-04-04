// CustomToast.tsx
import React, { useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define our types
type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastPosition = 'top' | 'bottom';

interface ToastConfig {
  backgroundColor: string;
  icon: string;
  iconColor: string;
}

interface ToastProps {
  title?: string;
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
}

// Toast type configurations
const TOAST_CONFIG: Record<ToastType, ToastConfig> = {
  success: {
    backgroundColor: '#4caf50',
    icon: 'checkmark-circle',
    iconColor: 'white',
  },
  error: {
    backgroundColor: '#f44336',
    icon: 'close-circle',
    iconColor: 'white',
  },
  info: {
    backgroundColor: '#2196f3',
    icon: 'information-circle',
    iconColor: 'white',
  },
  warning: {
    backgroundColor: '#ff9800',
    icon: 'warning',
    iconColor: 'white',
  },
};

// Static variables to store state across renders
let toastVisible = false;
let toastMessage = '';
let toastTitle = '';
let toastType: ToastType = 'info';
let toastPosition: ToastPosition = 'top';
let toastDuration = 3000;
let toastTimeout: NodeJS.Timeout | null = null;
let updateToast: ((params: {
  visible: boolean;
  message: string;
  title: string;
  type: ToastType;
  position: ToastPosition;
  duration: number;
}) => void) | null = null;

// Main CustomToast component
const CustomToast = (): React.ReactElement | null => {
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<ToastType>('info');
  const [position, setPosition] = useState<ToastPosition>('top');
  const [duration, setDuration] = useState<number>(3000);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const positionAnim = useRef(new Animated.Value(-100)).current;

  // Store update function in static variable
  updateToast = (params) => {
    setVisible(params.visible);
    setMessage(params.message);
    setTitle(params.title);
    setType(params.type);
    setPosition(params.position);
    setDuration(params.duration);
  };
  
  // Hide the toast
  const hide = (): void => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(positionAnim, {
        toValue: position === 'top' ? -100 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (updateToast) {
        updateToast({
          visible: false,
          message,
          title,
          type,
          position,
          duration
        });
      }
    });
  };

  if (!visible) return null;

  const toastConfig = TOAST_CONFIG[type] || TOAST_CONFIG.info;
  
  const positionStyle = {
    top: position === 'top' ? 50 : undefined,
    bottom: position === 'bottom' ? 50 : undefined,
    transform: [
      { translateY: positionAnim },
      { scale: fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1],
      })},
    ],
  };

  // Animate in when visible changes to true
  if (visible) {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(positionAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Set timeout to hide
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(hide, duration);
  }

  return (
    <Animated.View
      style={[
        styles.container,
        positionStyle,
        { opacity: fadeAnim, backgroundColor: toastConfig.backgroundColor }
      ]}
    >
      <TouchableOpacity style={styles.toastContent} onPress={hide}>
        {/* <Ionicons name={toastConfig.icon} size={24} color={toastConfig.iconColor} /> */}
        <View style={styles.textContainer}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <Text style={styles.message}>{message}</Text>
        </View>
        <TouchableOpacity onPress={hide}>
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Static methods
CustomToast.show = (config: ToastProps): void => {
  toastMessage = config.message;
  toastTitle = config.title || '';
  toastType = config.type || 'info';
  toastPosition = config.position || 'top';
  toastDuration = config.duration || 3000;
  toastVisible = true;
  
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }
  
  if (updateToast) {
    updateToast({
      visible: true,
      message: toastMessage,
      title: toastTitle,
      type: toastType,
      position: toastPosition,
      duration: toastDuration
    });
  }
};

CustomToast.hide = (): void => {
  if (updateToast) {
    updateToast({
      visible: false,
      message: toastMessage,
      title: toastTitle,
      type: toastType,
      position: toastPosition,
      duration: toastDuration
    });
  }
};

// Styles
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#333',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
    maxWidth: 450,
    alignSelf: 'center',
    width: '90%',
  },
  toastContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  message: {
    color: 'white',
    fontSize: 14,
  },
});

export default CustomToast;