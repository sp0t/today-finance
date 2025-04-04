import { StackActionType } from '@react-navigation/native';


export type NavigateProps = {
  (name: string, params?: unknown): void;
};

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

