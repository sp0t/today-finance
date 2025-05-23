import { useEffect, useState } from 'react';
import { Stack, useRouter, Redirect, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme, View, ActivityIndicator } from 'react-native';
import { PrivyProvider } from '@privy-io/expo';
import { PrivyElements } from '@privy-io/expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from "react-native-customizable-toast";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { usePrivy } from '@privy-io/expo';
// Required for ethers.js to work in React Native (Expo)
import 'react-native-get-random-values';
import '@ethersproject/shims';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PrivyProvider
      appId={'cm76p206400ey5b2sgwsn2acf'}
      clientId={'client-WY5gxmNC7Y288p2SAnCrTgb5kKnfAhB63h4RgUyZNaNM3'}
      config={{
        embedded: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>

        <AppNavigator />
        <StatusBar style="auto" />
        <Toaster />
        <PrivyElements />
      </GestureHandlerRootView>
    </PrivyProvider>
  );
}

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function AppNavigator() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}