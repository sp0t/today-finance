import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { ImageProps } from '@/interface/component';

const SmallIcon: React.FC<ImageProps> = ({ source, style}) => {
    return (
        <Image
            style={[styles.input, style]}
            source={source}
        >
        </Image>
    );
};

const styles = StyleSheet.create({
    input: {
        width: 24,
        height: 24,
        color: '#000',
    },
});

export default SmallIcon;
