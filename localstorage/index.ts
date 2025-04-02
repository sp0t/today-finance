import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveLocalStorage = async (key: string, value: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to local storage for key', key);
        console.error(error);
    }
}

export const getLocalStorage = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error getting from local storage for key', key);
        console.error(error);
    }
}

export const removeLocalStorage = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from local storage for key', key);
        console.error(error);
    }
}

export const clearLocalStorage = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('Error clearing local storage');
        console.error(error);
    }
}