import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ButtonProps } from "@/interface/component";

const TextButton: React.FC<ButtonProps> = ({ title, onPress, style, textStyle }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#101010',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
    },
});

export default TextButton;
