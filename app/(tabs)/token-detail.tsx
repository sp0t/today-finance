import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiService } from '@/services/api.service';
import { tokenProps } from '@/interface/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import PrimaryButton from '@/components/ui/PrimaryButton';

const TokenDetailScreen = () => {
  const router = useRouter();
  const { tokenId } = useLocalSearchParams();
  const [token, setToken] = useState<tokenProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenDetail = async () => {
    //   try {
    //     // Replace with your actual API service method to get token details
    //     const response = await apiService.getTokenDetail(tokenId as string);
    //     if (response.code === 0) {
    //       setToken(response.value);
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch token details:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    };

    if (tokenId) {
      fetchTokenDetail();
    }
  }, [tokenId]);

  const handleDeposit = () => {
    // Handle deposit logic
    console.log("Deposit for token:", tokenId);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!token) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>Token not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{token.name}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Token info */}
        <View style={styles.tokenInfoContainer}>
          <Image 
            source={{ uri: token.logo }} 
            style={styles.tokenLogo} 
            resizeMode="cover"
          />
          <Text style={styles.tokenName}>{token.name}</Text>
          <Text style={styles.tokenSymbol}>{token.symbol}</Text>
          
          {/* Description */}
          <Text style={styles.description}>
            This is the description about {token.name}. This is the description about {token.name}. 
            This is the description about {token.name}. This is the description about {token.name}.
          </Text>
        </View>
      </ScrollView>

      {/* Deposit button */}
      <View style={styles.footer}>
        <PrimaryButton
          title="Deposit"
          style={{ width: "100%" }}
          onPress={handleDeposit}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 40, // To balance the header
  },
  tokenInfoContainer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  tokenLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 16,
  },
  tokenName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  tokenSymbol: {
    fontSize: 14,
    color: '#808080',
    fontWeight: '500',
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    width: '100%',
    bottom: 32,
    padding: 16,
  }
});

export default TokenDetailScreen;