import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { CornerTextProps } from '@/interface/component';

const CornerText: React.FC<CornerTextProps> = ({
  text,
  animatedStyle,
  top,
  left,
  right,
  bottom,
}) => {
  const positionStyle = {
    position: 'absolute' as const,
    top,
    left,
    right,
    bottom,
  };

  return (
    <Animated.View style={[positionStyle, animatedStyle]}>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
});

export default CornerText;
