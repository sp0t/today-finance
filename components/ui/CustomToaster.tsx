import React, { useRef, useState, useEffect } from 'react';
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

// Toast configurations
const TOAST_CONFIG: Record<ToastType, ToastConfig> = {
  success: {
    backgroundColor: '#4caf50',
    icon: 'checkmark-circle-outline',
    iconColor: 'white',
  },
  error: {
    backgroundColor: '#f44336',
    icon: 'close-circle-outline',
    iconColor: 'white',
  },
  info: {
    backgroundColor: '#2196f3',
    icon: 'information-circle-outline',
    iconColor: 'white',
  },
  warning: {
    backgroundColor: '#ff9800',
    icon: 'warning-outline',
    iconColor: 'white',
  },
};

// Global state to manage toast updates
let toastTimeout: NodeJS.Timeout | null = null;
let triggerToast: ((config: ToastProps) => void) | null = null;

// Main CustomToast component
const CustomToast = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [position, setPosition] = useState<ToastPosition>('top');
  const [duration, setDuration] = useState(3000);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const positionAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    triggerToast = (config) => {
      // Reset animation values before showing again
      fadeAnim.setValue(0);
      positionAnim.setValue(config.position === 'top' ? -100 : 100);

      setTitle(config.title || '');
      setMessage(config.message);
      setType(config.type || 'info');
      setPosition(config.position || 'top');
      setDuration(config.duration || 3000);
      setVisible(true);

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

      // Hide after duration
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(hide, config.duration || 3000);
    };
  }, []);

  const hide = () => {
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
      setVisible(false);
    });
  };

  if (!visible) return null;

  const toastConfig = TOAST_CONFIG[type] || TOAST_CONFIG.info;

  const positionStyle = {
    top: position === 'top' ? 100 : undefined, // Adjust to 100 from top
    bottom: position === 'bottom' ? 50 : undefined,
    transform: [
      { translateY: positionAnim },
      { scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
    ],
  };

  return (
    <Animated.View style={[styles.container, positionStyle, { backgroundColor: toastConfig.backgroundColor }]}>
      <TouchableOpacity style={styles.toastContent} onPress={hide}>
        <Ionicons name={toastConfig.icon} size={16} color={toastConfig.iconColor} />
        <View style={styles.textContainer}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <Text style={styles.message}>{message}</Text>
        </View>
        {/* <TouchableOpacity onPress={hide}>
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity> */}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Static methods
CustomToast.show = (config: ToastProps) => {
  if (triggerToast) {
    triggerToast(config);
  }
};

CustomToast.hide = () => {
  if (triggerToast) {
    triggerToast({
      title: '',
      message: '',
      type: 'info',
      position: 'top',
      duration: 0,
    });
  }
};

// Styles
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
    maxWidth: '90%',
    alignSelf: 'center',
  },
  toastContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    fontWeight: '500',
    fontSize: 12,
    lineHeight:22
  },
});

export default CustomToast;
