import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { PrivyProvider } from '@privy-io/expo';
import { PrivyElements } from '@privy-io/expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from "react-native-customizable-toast";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import Constants from "expo-constants";


export default function RootLayout() {
  const colorScheme = useColorScheme();
  useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

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
      {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
      <GestureHandlerRootView>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <Toaster />
        <PrivyElements />
      </GestureHandlerRootView>
      {/* </ThemeProvider> */}
    </PrivyProvider>
  );
}