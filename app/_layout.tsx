import { useEffect, useState } from 'react';
import { Stack, useRouter, Redirect } from 'expo-router';
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

function AppNavigator() {
  const router = useRouter();
  const { user, isReady } = usePrivy();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (isReady) {
      console.log("user:", user);
      if (!user) {
        // router.replace('/');
      } else {
        console.log("Authenticated, staying on tabs");
      }
      setIsLoading(false);
    }
  }, [isReady, router]);
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}