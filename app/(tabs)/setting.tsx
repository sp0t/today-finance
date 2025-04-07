import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { usePrivy } from '@privy-io/expo';
import { useRouter } from 'expo-router';

export default function TabFirstScreen() {
  const { logout } = usePrivy();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Seting</ThemedText>
      </ThemedView>
      <PrimaryButton
        title="Log Out"
        style={{marginTop:50}}
        onPress={() => handleLogout()}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flex: 1
  },
});
