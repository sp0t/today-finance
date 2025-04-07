import React, { useEffect, useState } from 'react';
import { Redirect } from "expo-router";
import { useRouter } from 'expo-router';
import { usePrivy } from '@privy-io/expo';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { ActivityIndicator } from 'react-native';

const Index = () => {
  const router = useRouter();
  const { user, isReady } = usePrivy();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isReady) {
      console.log("user:", user);
      if (!user) {
        router.replace('/(tabs)');
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

  return <Redirect href="/(tabs)" />;
};
export default Index;