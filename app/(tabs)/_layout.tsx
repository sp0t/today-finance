import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { View, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import SmallIcon from '@/components/ui/SmallIcon';
import images from '@/styles/images';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          switch (route.name) {
            case 'Market':
              iconSource = images.tab.TabMarket;
              break;
            case 'Feed':
              iconSource = images.tab.TabFeed;
              break;
            case 'Send':
              iconSource = images.tab.TabSend;
              break;
            case 'Settings':
              iconSource = images.tab.TabSetting;
              break;
          }

          // Create a container with background for active tab
          return (
            <View style={[
              styles.iconContainer,
              focused ? styles.activeIconContainer : null
            ]}>
              <SmallIcon
                source={iconSource}
                style={focused ? { tintColor: '#000000' } : { tintColor: '#6B7280' }}
              />
            </View>
          );
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          height: 96,
          paddingBottom: 36,
          paddingTop: 16,
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          paddingHorizontal: 20,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name="index"
      />
      <Tabs.Screen
        name="feed"
      />
      <Tabs.Screen
        name="send"
      />
      <Tabs.Screen
        name="setting"
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 10,
    borderRadius: 100,
  },
  activeIconContainer: {
    backgroundColor: '#F4F4F5',  // Light gray background for active tab
  }
});