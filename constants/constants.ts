import { BackgroundItem } from '@/interface/login';
import images from '@/styles/images';

export enum Routes {
    ONBOARDING = 'Onboarding',
    LOGIN = 'Login',
    MARKET = 'Market',
    FEED = 'Feed',
    SETTING = 'Setting',
    SEND = 'Send'
  }

export const enum ACTIVECORNER {
    LEARN = 'learn',
    INVEST = 'invest',
    TRADE = 'trade',
    SEND = 'send',
}

export const loginBackgroundData: BackgroundItem[] = [
    {
        topImage: images.login.LearnTop,
        bottomImage: images.login.LearnBottom,
        activeCorner: ACTIVECORNER.LEARN,
    },
    {
        topImage: images.login.InvestTop,
        bottomImage: images.login.InvestBottom,
        activeCorner: ACTIVECORNER.INVEST,
    },
    {
        topImage: images.login.TradeTop,
        bottomImage: images.login.TradeBottom,
        activeCorner: ACTIVECORNER.TRADE,
    },
    {
        topImage: images.login.SendTop,
        bottomImage: images.login.SendBottom,
        activeCorner: ACTIVECORNER.SEND,
    },
]