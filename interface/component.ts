import { TextStyle, StyleProp, ViewStyle, KeyboardTypeOptions, ImageSourcePropType, ImageStyle} from 'react-native';
import { AnimatedStyle } from 'react-native-reanimated';

export interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
}

export interface CornerTextProps {
    text: string;
    animatedStyle: AnimatedStyle<any>;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}

export interface InputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    style?: StyleProp<ViewStyle>;
    maxLength?: number;
}

export interface ImageProps {
    source: ImageSourcePropType;
    style?: StyleProp<ImageStyle>;
}

export type CustomToasterProps = {
    text: string;
    dismissible?: boolean;
    backgroundColor?: string;
  };