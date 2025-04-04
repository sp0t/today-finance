import { get, getBaseRoute, post, put, remove } from './axios.service';
import {
    kReferenceLogin,
    kReferencefindUserByAddress,
    kReferencefindUserByEmail,
    kReferenceUpdateUser,
    kReferenceGetTokenBalanceList,
    kReferencetradeSwap
} from '@/constants/constants';
import { UserProps } from '@/interface/login';
import {
    TokenListApiProps,
    TradeSwapProps
} from '@/interface/types'

export class ApiService {
    constructor() { }

    async sginUp(userAddress: string, userEmail: string, userFirstName: string, userLastName: string, userProfileImage?: string, loginMethod?: string): Promise<UserProps> {
        var data = new FormData();
        data.append('userAddress', userAddress);
        data.append('userEmail', userEmail);
        data.append('userFirstName', userFirstName);
        data.append('userLastName', userLastName);

        if (userProfileImage) {
            data.append("userProfileImage", userProfileImage);
        }

        if (loginMethod) {
            data.append("loginMethod", loginMethod);
        }

        return new Promise((resolve, reject) => {
            post(getBaseRoute(kReferenceLogin), data)
                .then((response) => {
                    const result = response.data;
                    resolve(result);
                })
                .catch((error) => {
                    const result = error?.response;
                    reject(result);
                });
        });
    }

    async findUserByAddress(userAddress: string): Promise<string> {
        var data = new FormData();
        data.append('userAddress', userAddress);

        return new Promise((resolve, reject) => {
            post(getBaseRoute(kReferencefindUserByAddress), data)
                .then((response) => {
                    const result = response.data;
                    resolve(result);
                })
                .catch((error) => {
                    const result = error?.response;
                    reject(result);
                });
        });
    }

    async findUserByEmail(userEmail: string): Promise<string> {
        var data = new FormData();
        data.append('userEmail', userEmail);

        return new Promise((resolve, reject) => {
            post(getBaseRoute(kReferencefindUserByEmail), data)
                .then((response) => {
                    const result = response.data;
                    resolve(result);
                })
                .catch((error) => {
                    const result = error?.response;
                    reject(result);
                });
        });
    }

    async updateUser(userAddress: string, userEmail: string, userFirstName: string, userLastName: string, userProfileImage?: string, loginMethod?: string): Promise<UserProps> {
        var data = new FormData();
        data.append('userAddress', userAddress);
        data.append('userEmail', userEmail);
        data.append('userFirstName', userFirstName);
        data.append('userLastName', userLastName);

        if (userProfileImage) {
            data.append("userProfileImage", userProfileImage);
        }

        if (loginMethod) {
            data.append("loginMethod", loginMethod);
        }

        return new Promise((resolve, reject) => {
            post(getBaseRoute(kReferenceUpdateUser), data)
                .then((response) => {
                    const result = response.data;
                    resolve(result);
                })
                .catch((error) => {
                    const result = error?.response;
                    reject(result);
                });
        });
    }

    async getTokenBalanceList(userAddress: string, chain: string): Promise<TokenListApiProps> {
        var data = new FormData();
        data.append('userAddress', userAddress);
        data.append('chain', chain);

        return new Promise((resolve, reject) => {
            post(getBaseRoute(kReferenceGetTokenBalanceList), data)
                .then((response) => {
                    const result = response.data;
                    resolve(result);
                })
                .catch((error) => {
                    const result = error?.response;
                    reject(result);
                });
        });
    }

    async tradeSwap(tokenIn: string, tokenOut: string, amountIn: string): Promise<TradeSwapProps> {
        var data = new FormData();
        data.append('tokenIn', tokenIn);
        data.append('tokenOut', tokenOut);
        data.append('amountIn', amountIn);

        return new Promise((resolve, reject) => {
            post(getBaseRoute(kReferencetradeSwap), data)
                .then((response) => {
                    const result = response.data;
                    resolve(result);
                })
                .catch((error) => {
                    const result = error?.response;
                    reject(result);
                });
        });
    }
}

export const apiService = new ApiService();