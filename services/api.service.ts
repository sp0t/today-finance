import { get, getBaseRoute, post, put, remove } from './axios.service';
import {
    kReferenceLogin,
    kReferencefindUserByAddress,
    kReferencefindUserByEmail,
    kReferenceUpdateUser,
    kReferenceGetTokenBalanceList,
    kReferencetradeSwap,
    kReferenceGetTopGainers
} from '@/constants/constants';
import { UserProps } from '@/interface/login';
import {
    TokenListApiProps,
    TradeSwapProps,
    ReturnCode,
    ReturnType,
    ResponseStatus
} from '@/interface/types'

export class ApiService {
    constructor() { }

    async sginUp(userAddress: string, userEmail: string, userFirstName: string, userLastName: string, userProfileImage?: File, loginMethod?: string): Promise<ReturnType> {
        var data = {
            userAddress,
            userEmail,
            userFirstName,
            userLastName,
            userProfileImage,
            loginMethod
        }

        return new Promise((resolve, reject) => {
            post(getBaseRoute(kReferenceLogin), data, )
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

    async findUserByAddress(userAddress: string): Promise<ReturnType> {
        var data = {
            userAddress
        }

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

    async findUserByEmail(userEmail: string): Promise<ReturnType> {
        var data = {
            userEmail
        }

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

    async updateUser(userAddress: string, userEmail: string, userFirstName: string, userLastName: string, userProfileImage?: string, loginMethod?: string): Promise<ReturnType> {
        var data = {
            userAddress,
            userEmail,
            userFirstName,
            userLastName,
            userProfileImage,
            loginMethod
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

    async getTokenBalanceList(userAddress: string, chain: string): Promise<ReturnType> {
        var data = {
            userAddress,
            chain
        }

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

    async getTopGainers(): Promise<ReturnType> {

        return new Promise((resolve, reject) => {
            post(getBaseRoute(kReferenceGetTopGainers))
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

    async tradeSwap(tokenIn: string, tokenOut: string, amountIn: string): Promise<ReturnType> {
        var data = {
            tokenIn,
            tokenOut,
            amountIn
        }

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