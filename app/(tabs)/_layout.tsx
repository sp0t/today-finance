import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, ImageSourcePropType } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import SmallIcon from '@/components/ui/SmallIcon';
import images from '@/styles/images';

interface TabIconProps {
  focused: boolean;
  iconSource: ImageSourcePropType;
}

const CustomTabIcon: React.FC<TabIconProps> = ({ focused, iconSource }) => (
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


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 96,
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          paddingHorizontal: 20,
          paddingTop: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 10,
        }

      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => <CustomTabIcon focused={focused} iconSource={images.tab.TabMarket} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ color, focused }) => <CustomTabIcon focused={focused} iconSource={images.tab.TabFeed} />,
        }}
      />
      <Tabs.Screen
        name="send"
        options={{
          tabBarIcon: ({ color, focused }) => <CustomTabIcon focused={focused} iconSource={images.tab.TabSend} />,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarIcon: ({ color, focused }) => <CustomTabIcon focused={focused} iconSource={images.tab.TabSetting} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 10,
    borderRadius: 100,
  },
  activeIconContainer: {
    backgroundColor: '#F4F4F5',
  }
});