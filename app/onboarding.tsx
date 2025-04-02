import { useRouter } from 'expo-router';
import { View, Text, Button } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>onboarding Page</Text>
      <Button title="onboarding"/>
    </View>
  );
}
