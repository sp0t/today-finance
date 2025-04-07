import { ImageSourcePropType } from 'react-native';

export interface BackgroundItem {
    topImage: ImageSourcePropType;
    bottomImage: ImageSourcePropType;
    activeCorner: 'learn' | 'invest' | 'trade' | 'send';
}

export interface UserProps {
    userAddress: string;
    userEmail: string;
    userFirstName: string;
    userLastName: string;
    userProfileImage?: File;
    loginMethod?: string;
}
  