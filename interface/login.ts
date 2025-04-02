import { ImageSourcePropType } from 'react-native';

export interface BackgroundItem {
    topImage: ImageSourcePropType;
    bottomImage: ImageSourcePropType;
    activeCorner: 'learn' | 'invest' | 'trade' | 'send';
}

  