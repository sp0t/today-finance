import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ButtonProps } from "@/interface/component";


const PrimaryButton: React.FC<ButtonProps> = ({ title, onPress, style, textStyle, disabled }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress} disabled = {disabled}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#101010',
        borderRadius: 12,
        width: '90%',
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
    },
});

export default PrimaryButton;
