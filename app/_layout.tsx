import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { PrivyProvider } from '@privy-io/expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from "react-native-customizable-toast";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView>
        <PrivyProvider
          appId="cm76p206400ey5b2sgwsn2acf"
          clientId="client-WY5gxmNC7Y288p2SAnCrTgb5kKnfAhB63h4RgUyZNaNM3"
          config={{
            embedded: {
              ethereum: {
                createOnLogin: 'users-without-wallets',
              },
            },
          }}
        >
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </PrivyProvider>
        <Toaster />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}