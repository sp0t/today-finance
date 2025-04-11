import { StackActionType } from '@react-navigation/native';
import { ImageSourcePropType } from 'react-native';

export type NavigateProps = {
  (name: string, params?: unknown): void;
};

export enum ReturnCode {
  RETURN_OK,
  RETURN_ERROR,
}

export type ReturnType = {
  code: ReturnCode;
  description: string;
  value?: any;
}

export enum ResponseStatus {
  SUCCESS = 200,
  CLIENT_ERROR = 400,
  SERVER_ERROR = 500,
}

export type GenericNavigationProps = {
  navigate: NavigateProps;
  setOptions: (options: Partial<unknown>) => void;
  goBack: () => StackActionType;
  canGoBack: () => StackActionType;
};

export interface TokenListApiProps {
  userAddress: string,
  chain: string
}

export interface TradeSwapProps {
  tokenIn: string,
  tokenOut: string,
  amountIn: string
}

// Type definitions
export interface EducationalCard {
  id: string;
  title: string;
  duration: string;
  colors: string[];
  image: ImageSourcePropType;
}

export interface tokenProps {
  id: string;
  chain: string;
  address: string;
  name: string;
  symbol: string;
  decimals: string;
  totalSupply: Number;
  verified: string;
  description: string;
  markeCap: Number;
  price: Number;
  priceChange24H: Number;
  priceChangePercentage24H: Number;
  volume24H: Number;
  website: string;
  twitter: string;
  score: Number;
}

// Component prop types
export interface CarouselIndicatorsProps {
  items: Array<EducationalCard>;
  activeIndex: number;
}

export interface EducationalCardItemProps {
  item: EducationalCard;
  index: number;
  totalItems: number;
}

export interface TopGainerItemProps {
  item: tokenProps;
  index: number;
  totalItems: number;
}
