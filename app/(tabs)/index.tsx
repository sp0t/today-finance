import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ListRenderItemInfo,
  ScrollView,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import images from '@/styles/images';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useRouter } from 'expo-router';
import {
  usePrivy,
  getUserEmbeddedEthereumWallet,
  useFundWallet
} from '@privy-io/expo';
import { base } from 'viem/chains';
import { apiService } from '@/services/api.service';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';

import {
  EducationalCard,
  tokenProps,
  EducationalCardItemProps,
  TopGainerItemProps
} from '@/interface/types';

import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers } from 'ethers';
import { rpcUrl, COINMARKETCAP_API_URL, COINMARKETCAP_API_KEY } from '@/constants/constants';
import ERC20_ABI from "@/constants/ERC20_ABI.json";

// Constants for layout measurements
const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.5;
const GANINER_CARD_WIDTH = width * 0.86;
const CARD_GAP = 12;

// Define types for modal views
type ModalView = 'details' | 'amount' | 'confirm';
const provider = new ethers.providers.JsonRpcProvider(
  rpcUrl
);
// Define types for our new components
interface AmountInputViewProps {
  token: tokenProps;
  tradeType: string;
  usdBalance: number;
  ethBalance: string | null;
  tokenBalance: string | null;
  onBack: () => void;
  onReview: (amount: string) => void;
}

interface ConfirmModalViewProps {
  token: tokenProps;
  amount: string;
  onBack: () => void;
  onConfirm: () => void;
}

interface TokenDetailModalProps {
  visible: boolean;
  token: tokenProps | null;
  usdBalance: number;
  ethBalance: string | null;
  onClose: () => void;
}

const EducationalCardItem: React.FC<EducationalCardItemProps> = ({ item, index, totalItems }) => {
  return (
    <TouchableOpacity
      style={[
        styles.educationalCard,
        {
          width: CARD_WIDTH,
          marginRight: index === totalItems - 1 ? 0 : CARD_GAP,
          marginLeft: index === 0 ? 20 : 0
        }
      ]}
      activeOpacity={0.9}
    >
      <View
      >
        <Image
          source={item.image}
          style={styles.cardImage}
          resizeMode="stretch"
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardDuration}>{item.duration}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TopGainerItem: React.FC<TopGainerItemProps> = ({ item, index, totalItems, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.gainerCard,
        {
          width: GANINER_CARD_WIDTH,
          marginRight: index === totalItems - 1 ? 0 : CARD_GAP,
          marginLeft: index < 4 ? 20 : 0
        }
      ]}
      onPress={() => onPress(item)}
      key={item.id} // Added unique key prop
    >
      <Image
        source={{ uri: item?.logo }}
        style={styles.gainerIcon}
        resizeMode='cover'
      />
      <View style={styles.gainerInfo}>
        <Text style={styles.gainerName}>{item.name}</Text>
        <Text style={styles.gainerTicker}>{item.symbol}</Text>
      </View>
      <View style={styles.gainerPrice}>
        <Text style={styles.priceValue}>${item.price.toFixed(5)}</Text>
        {item.priceChangePercent24H >= 0 ? (
          <Text style={[styles.priceChange, { color: 'green' }]}>
            <Ionicons name="arrow-up" size={12} color="green" />
            {item.priceChangePercent24H.toFixed(2)}%
          </Text>
        ) : (
          <Text style={[styles.priceChange, { color: 'red' }]}>
            <Ionicons name="arrow-down" size={12} color="red" />
            {item.priceChangePercent24H.toFixed(2)}%
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const AmountInputView: React.FC<AmountInputViewProps> = ({ token, tradeType, usdBalance, ethBalance, tokenBalance, onBack, onReview }) => {
  const [amount, setAmount] = useState('0');
  const [isFocused, setIsFocused] = useState(false);

  const handleNumberPress = (num: string) => {
    if (amount === '0' && num === '0') return;

    if (amount === '0') {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount('0');
    }
  };

  const handleDecimalPoint = () => {
    if (!amount.includes('.')) {
      setAmount(amount + '.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.amountInputContainer}
    >
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>{tradeType == 'buy' ? 'Buy' : 'Sell'} {token.name}</Text>
      </View>
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <View style={styles.amountContainer}>
          {tradeType === 'buy' && <Text style={styles.currencySymbol}>$</Text>}
          <Text style={styles.amountText}>{amount}</Text>
        </View>

        {tradeType === 'buy' && <Text style={styles.availableText}>
          ${usdBalance.toFixed(5)} available to buy {token.symbol}
        </Text>}
        {tradeType === 'sell' && <Text style={styles.availableText}>
          {parseFloat(tokenBalance || '0').toFixed(5)} {token.symbol} available to sell
        </Text>}

        <View style={styles.keypadContainer}>
          {/* Row 1 */}
          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handleNumberPress('1')}
            >
              <Text style={styles.keypadButtonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handleNumberPress('2')}
            >
              <Text style={styles.keypadButtonText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handleNumberPress('3')}
            >
              <Text style={styles.keypadButtonText}>3</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2 */}
          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handleNumberPress('4')}
            >
              <Text style={styles.keypadButtonText}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handleNumberPress('5')}
            >
              <Text style={styles.keypadButtonText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handleNumberPress('6')}
            >
              <Text style={styles.keypadButtonText}>6</Text>
            </TouchableOpacity>
          </View>

          {/* Row 3 */}
          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handleNumberPress('7')}
            >
              <Text style={styles.keypadButtonText}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handleNumberPress('8')}
            >
              <Text style={styles.keypadButtonText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handleNumberPress('9')}
            >
              <Text style={styles.keypadButtonText}>9</Text>
            </TouchableOpacity>
          </View>

          {/* Row 4 */}
          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={handleDecimalPoint}
            >
              <Text style={styles.keypadButtonText}>.</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handleNumberPress('0')}
            >
              <Text style={styles.keypadButtonText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={handleBackspace}
            >
              <Ionicons name="backspace-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.reviewButtonContainer}>
          <PrimaryButton
            title="Review"
            style={{ width: "100%" }}
            onPress={() => onReview(amount)}
            disabled={amount === '0' || parseFloat(amount) === 0}
          />
        </View>
      </View>

    </KeyboardAvoidingView>
  );
};

// New Confirm Modal View Component
const ConfirmModalView: React.FC<ConfirmModalViewProps> = ({
  token,
  amount,
  onBack,
  onConfirm
}) => {
  // Calculate costs and fees
  const tokenPrice = 0.09479;
  const costForAsset = parseFloat(amount);
  const networkFee = 0.01; // Example, in a real app this would be dynamic
  const protocolFee = 3.50;
  const transactionFee = 5.89;
  const totalCost = costForAsset + protocolFee + transactionFee;

  // Calculate number of tokens received
  const tokenAmount = costForAsset / tokenPrice;

  return (
    <View style={styles.confirmContainer}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Review</Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={styles.confirmSection}>
          <Text style={styles.confirmSectionTitle}>You receive</Text>
          <View style={styles.tokenReceiveCard}>
            <Image
              source={{ uri: token.logo }}
              style={styles.tokenReceiveIcon}
              resizeMode="cover"
            />
            <Text style={styles.tokenReceiveAmount}>${costForAsset.toFixed(2)}</Text>
            <Text style={styles.tokenReceiveTokens}>
              {tokenAmount.toFixed(3)} {token.symbol}
            </Text>
          </View>
        </View>
        <View style={styles.confirmSection}>
          <Text style={styles.confirmSectionTitle}>Cost breakdown</Text>

          <View style={[styles.costItem, { marginTop: 16 }]}>
            <Text style={styles.costItemLabel}>{token.symbol} price</Text>
            <Text style={styles.costItemValue}>${tokenPrice.toFixed(5)}</Text>
          </View>

          <View style={styles.costItem}>
            <Text style={styles.costItemLabel}>Cost for asset</Text>
            <Text style={styles.costItemValue}>${costForAsset.toFixed(2)}</Text>
          </View>

          <View style={styles.costItem}>
            <Text style={styles.costItemLabel}>Network fee</Text>
            <View style={styles.feeContainer}>
              <Text style={styles.freeTag}>FREE</Text>
            </View>
          </View>

          <View style={styles.costItem}>
            <Text style={styles.costItemLabel}>Protocol fee</Text>
            <Text style={styles.costItemValue}>${protocolFee.toFixed(2)}</Text>
          </View>

          <View style={styles.costItem}>
            <Text style={styles.costItemLabel}>Transaction fee</Text>
            <Text style={styles.costItemValue}>${transactionFee.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total cost</Text>
          <Text style={styles.totalValue}>${totalCost.toFixed(2)}</Text>
        </View>

        <View style={styles.confirmButtonContainer}>
          <PrimaryButton
            title="Confirm"
            style={{ width: "100%" }}
            onPress={onConfirm}
          />
        </View>
      </View>

    </View>
  );
};

// Token Detail Modal Component
const TokenDetailModal: React.FC<TokenDetailModalProps> = ({
  visible,
  token,
  usdBalance,
  ethBalance,
  onClose
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [modalView, setModalView] = useState<ModalView>('details');
  const [purchaseAmount, setPurchaseAmount] = useState('0');
  const [tokenAmount, setTokenAmount] = useState<string | null>('0.0')
  const [tradeType, setTradeType] = useState<string>('buy')
  const { user, isReady } = usePrivy();
  const account = getUserEmbeddedEthereumWallet(user);
  const { fundWallet } = useFundWallet();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const contract = new ethers.Contract(token?.address, ERC20_ABI, provider);
        const rawBalance = await contract.balanceOf(account?.address);
        const decimals = await contract.decimals();
        const formatted = ethers.utils.formatUnits(rawBalance, decimals);
        // setTokenAmount(formatted);
        setTokenAmount('0.1');

      } catch (error) {
        setTokenAmount('0.0');
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
      // Reset to details view when modal closes
      setTimeout(() => {
        if (!visible) setModalView('details');
      }, 300);
    }
  }, [visible, slideAnim]);

  const handleDeposit = () => {
    fundWallet({
      address: account?.address,
      chain: base,
    });
  };

  const handleBuy = () => {
    setTradeType('buy');
    setModalView('amount');
  }

  const handleSell = () => {
    setTradeType('sell');
    setModalView('amount');
  }

  const handleBack = () => {
    if (modalView === 'amount') {
      setModalView('details');
    } else if (modalView === 'confirm') {
      setModalView('amount');
    }
  };

  const handleReview = (amount: string) => {
    setPurchaseAmount(amount);
    setModalView('confirm');
  };

  const handleConfirm = () => {
    // Here you would handle the purchase confirmation
    console.log(`Confirming purchase of ${purchaseAmount} ${token?.symbol}`);
    onClose(); // Close the modal after confirming
  };

  if (!token) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ translateY: slideAnim }] }
              ]}
            >
              {modalView === 'details' && (
                // Token Details View
                <>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose}>
                      <Ionicons name="arrow-back" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>{token.name}</Text>
                  </View>

                  <View style={styles.tokenIconContainer}>
                    <Image
                      source={{ uri: token.logo }}
                      style={styles.tokenIcon}
                      resizeMode="cover"
                    />
                    <Text style={styles.tokenName}>{token.name}</Text>
                    <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                  </View>

                  <Text style={styles.tokenDescription}>
                    {token.description}
                  </Text>

                  {usdBalance === 0 && <View style={styles.depositButtonContainer}>
                    <PrimaryButton
                      title="Deposit"
                      style={{ width: "100%" }}
                      onPress={handleDeposit}
                    />
                  </View>}
                  {usdBalance > 0 && parseFloat(tokenAmount || '0') === 0 &&
                    <View style={styles.depositButtonContainer}>
                      <PrimaryButton
                        title="Buy"
                        style={{ width: "100%" }}
                        onPress={handleBuy}
                      />
                    </View>}
                  {usdBalance > 0 && parseFloat(tokenAmount || '0') !== 0 &&
                    <View style={[styles.depositButtonContainer, { flexDirection: 'row', gap: 20 }]}>
                      <PrimaryButton
                        title="Buy"
                        style={{ width: (width - 60) * 0.5 }}
                        onPress={handleBuy}
                      />
                      <PrimaryButton
                        title="Sell"
                        style={{ width: (width - 60) * 0.5 }}
                        onPress={handleSell}
                      />
                    </View>}

                  {/* <View style={styles.tabBar}>
                    <TouchableOpacity
                      style={[styles.tabItem, activeTab === 'home' && styles.activeTabItem]}
                      onPress={() => setActiveTab('home')}>
                      <Ionicons name="home-outline" size={24} color={activeTab === 'home' ? '#000' : '#9CA3AF'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tabItem, activeTab === 'list' && styles.activeTabItem]}
                      onPress={() => setActiveTab('list')}>
                      <Ionicons name="list-outline" size={24} color={activeTab === 'list' ? '#000' : '#9CA3AF'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tabItem, activeTab === 'send' && styles.activeTabItem]}
                      onPress={() => setActiveTab('send')}>
                      <Ionicons name="paper-plane-outline" size={24} color={activeTab === 'send' ? '#000' : '#9CA3AF'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tabItem, activeTab === 'document' && styles.activeTabItem]}
                      onPress={() => setActiveTab('document')}>
                      <Ionicons name="document-outline" size={24} color={activeTab === 'document' ? '#000' : '#9CA3AF'} />
                    </TouchableOpacity>
                  </View> */}
                </>
              )}

              {modalView === 'amount' && (
                // Amount Input View
                <AmountInputView
                  token={token}
                  tradeType={tradeType}
                  usdBalance={usdBalance}
                  ethBalance={ethBalance}
                  tokenBalance={tokenAmount}
                  onBack={handleBack}
                  onReview={handleReview}
                />
              )}

              {modalView === 'confirm' && (
                // Confirmation View
                <ConfirmModalView
                  token={token}
                  amount={purchaseAmount}
                  onBack={handleBack}
                  onConfirm={handleConfirm}
                />
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Main component
const MarketScreen: React.FC = () => {
  const router = useRouter();
  const { user, isReady } = usePrivy();
  const account = getUserEmbeddedEthereumWallet(user);
  const [isLoading, setIsLoading] = useState(true);
  const [topGainer, setTopGainer] = useState<tokenProps[]>([]);
  const [trendings, setTrendings] = useState<tokenProps[]>([]);
  const [balance, setBalance] = useState<number | 0>(0);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const { fundWallet } = useFundWallet();

  // Token detail modal state
  const [selectedToken, setSelectedToken] = useState<tokenProps | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (isReady) {
      if (!user) {
        router.replace('/login');
      } else {
        console.log("Authenticated, staying on tabs");
        fetchBalance();
      }
      setIsLoading(false);
    }
  }, [isReady, router]);

  const fetchBalance = async () => {
    try {
      const rawBalance = await provider.getBalance(account?.address,);
      const ethBalance = ethers.utils.formatEther(rawBalance);

      setEthBalance(ethBalance);

      const priceInfoResponse = await axios.get(`${COINMARKETCAP_API_URL}/v2/tools/price-conversion`, {
        headers: {
          "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY,
        },
        params: {
          amount: ethBalance,
          id: 1027
        }
      });

      const usdValue = priceInfoResponse?.data?.data?.quote?.USD?.price ?? 0;
      setBalance(usdValue.toFixed(2));

    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0);
      setEthBalance('error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gainersResponse, trendingsResponse] = await Promise.all([
        apiService.getTopGainers(),
        apiService.getTrendings(),
      ]);

      if (gainersResponse.code === 0) {
        setTopGainer(gainersResponse.value);
      } else {
        setTopGainer([]);
      }

      if (trendingsResponse.code === 0) {
        setTrendings(trendingsResponse.value);
      } else {
        setTrendings([]);
      }

    } catch (error) {
      console.error("Failed to fetch data:", error);
      setTopGainer([]);
      setTrendings([]);
    }
  };

  const educationalCards: EducationalCard[] = [
    {
      id: '1',
      title: 'What is DeFi?',
      duration: '56 seconds total',
      colors: ['#9333EA', '#3B82F6'],
      image: images.login.InvestBottom
    },
    {
      id: '2',
      title: 'What is yield?',
      duration: '40 seconds total',
      colors: ['#FB7185', '#EF4444'],
      image: images.login.InvestBottom
    }
  ];

  const groupedGainerPages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < topGainer.length; i += 4) {
      pages.push(topGainer.slice(i, i + 4));
    }
    return pages;
  }, [topGainer]);

  const groupedTrendingPages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < trendings.length; i += 4) {
      pages.push(trendings.slice(i, i + 4));
    }
    return pages;
  }, [trendings]);

  // Refs and state
  const topCarouselRef = useRef<FlatList<EducationalCard>>(null);
  const bottomCarouselRef = useRef<FlatList<tokenProps[]>>(null);
  const [topActiveIndex, setTopActiveIndex] = useState<number>(0);
  const [bottomActiveIndex, setBottomActiveIndex] = useState<number>(0);

  // Handlers with proper TypeScript event types
  const handleTopScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_WIDTH + CARD_GAP));
    setTopActiveIndex(index);
  }, []);

  const handleBottomScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (GANINER_CARD_WIDTH + CARD_GAP));
    setBottomActiveIndex(index);
  }, []);

  // Render functions with proper typing
  const renderEducationalCard = useCallback(
    ({ item, index }: ListRenderItemInfo<EducationalCard>) => (
      <EducationalCardItem
        item={item}
        index={index}
        totalItems={educationalCards.length}
      />
    ),
    [educationalCards.length]
  );

  const handleTokenPress = useCallback((token: tokenProps) => {
    // Instead of navigating, show the modal
    setSelectedToken(token);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const renderTopGainerPage = useCallback(
    ({ item, index }: { item: tokenProps[], index: number }) => (
      <View style={{ width: GANINER_CARD_WIDTH + CARD_GAP }} key={`gainer-page-${index}`}>
        {item.map((gainer, gainerIndex) => (
          <TopGainerItem
            key={`gainer-item-${index}-${gainerIndex}-${gainer.id || gainerIndex}`}
            item={gainer}
            index={gainerIndex}
            totalItems={item.length}
            onPress={handleTokenPress}
          />
        ))}
      </View>
    ),
    [handleTokenPress]
  );

  const renderTrendingPage = useCallback(
    ({ item, index }: { item: tokenProps[], index: number }) => (
      <View style={{ width: GANINER_CARD_WIDTH + CARD_GAP }} key={`trending-page-${index}`}>
        {item.map((trending, trendingIndex) => (
          <TopGainerItem
            key={`trending-item-${index}-${trendingIndex}-${trending.id || trendingIndex}`}
            item={trending}
            index={trendingIndex}
            totalItems={item.length}
            onPress={handleTokenPress}
          />
        ))}
      </View>
    ),
    [handleTokenPress]
  );

  // Item layout calculator for optimized FlatList performance
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: CARD_WIDTH + CARD_GAP,
      offset: (CARD_WIDTH + CARD_GAP) * index,
      index,
    }),
    []
  );

  const getGainerItemLayout = useCallback(
    (_: any, index: number) => ({
      length: GANINER_CARD_WIDTH + CARD_GAP,
      offset: (GANINER_CARD_WIDTH + CARD_GAP) * index,
      index,
    }),
    []
  );

  const handleFundWallet = async () => {
    fundWallet({
      address: account?.address,
      chain: base,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.dateText}>Monday, March 5th</Text>
          </View>
          <View>
            <Text style={styles.statusText}>Markets are always open</Text>
          </View>
        </View>

        {/* Learn about finance section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learn about the future of finance</Text>
          <View style={styles.carouselContainer}>
            <FlatList
              ref={topCarouselRef}
              data={educationalCards}
              renderItem={renderEducationalCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={CARD_WIDTH + CARD_GAP}
              decelerationRate="fast"
              contentContainerStyle={styles.carouselContent}
              onMomentumScrollEnd={handleTopScrollEnd}
              initialScrollIndex={0}
              getItemLayout={getItemLayout}
              removeClippedSubviews={true}
            />
          </View>
        </View>

        {/* Top Gainers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top gainers</Text>
          <Text style={styles.sectionSubtitle}>Price rising over the past 24 hours</Text>
          <View style={styles.carouselContainer}>
            <FlatList
              ref={bottomCarouselRef}
              data={groupedGainerPages}
              renderItem={renderTopGainerPage}
              keyExtractor={(_, index) => `gainer-page-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={GANINER_CARD_WIDTH + CARD_GAP}
              decelerationRate="fast"
              contentContainerStyle={styles.carouselContent}
              onMomentumScrollEnd={handleBottomScrollEnd}
              initialScrollIndex={0}
              getItemLayout={getGainerItemLayout}
              removeClippedSubviews={true}
            />
          </View>
        </View>

        {/* Trending */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending</Text>
          <Text style={styles.sectionSubtitle}>Popular assets over the past 24 hours</Text>
          <View style={styles.carouselContainer}>
            <FlatList
              ref={bottomCarouselRef}
              data={groupedTrendingPages}
              renderItem={renderTrendingPage}
              keyExtractor={(_, index) => `trending-page-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={GANINER_CARD_WIDTH + CARD_GAP}
              decelerationRate="fast"
              contentContainerStyle={styles.carouselContent}
              onMomentumScrollEnd={handleBottomScrollEnd}
              initialScrollIndex={0}
              getItemLayout={getGainerItemLayout}
              removeClippedSubviews={true}
            />
          </View>
        </View>
      </ScrollView>

      {/* Deposit button */}
      {balance != 0 && <View style={[styles.footer, { marginBottom: 20 }]}>
        <PrimaryButton
          title="Deposit"
          style={{ width: "100%" }}
          onPress={handleFundWallet}
        />
      </View>}

      {/* Token Detail Modal */}
      <TokenDetailModal
        visible={modalVisible}
        token={selectedToken}
        usdBalance={balance}
        ethBalance={ethBalance}
        onClose={closeModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: 10,
    color: '#F30AA1',
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginTop: 4
  },
  marketStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '400'
  },
  section: {
    paddingTop: 32
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.1,
    lineHeight: 22,
    paddingHorizontal: 20
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#808080',
    letterSpacing: -0.1,
    fontWeight: '400',
    paddingHorizontal: 20,
    marginTop: 6
  },
  carouselContainer: {
    position: 'relative',
    paddingTop: 12
  },
  carouselContent: {
    paddingRight: 16,
  },
  educationalCard: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: 12,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: 146,
    opacity: 0.7,
    backgroundColor: 'green'
  },
  cardContent: {
    padding: 12,
  },
  cardDuration: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  indicators: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 4,
  },
  activeIndicator: {
    width: 16,
    backgroundColor: '#FFFFFF',
  },
  gainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 20,
    marginBottom: 10
  },
  gainerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gainerIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gainerInfo: {
    flex: 1,
  },
  gainerName: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  gainerTicker: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '500',
    color: '#808080',
  },
  gainerPrice: {
    marginTop: 4,
    alignItems: 'flex-end',
    alignContent: 'space-between'
  },
  priceValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  priceChange: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: '#0BA72A',
  },
  footer: {
    position: 'absolute',
    width: '100%',
    bottom: 110,
    padding: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '100%',
    paddingTop: 80,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    height: 20,
    width: 28
  },
  modalTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 30,
  },
  tokenIconContainer: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 20
  },
  tokenIcon: {
    width: 48,
    height: 48,
    borderRadius: 32,
  },
  tokenName: {
    fontSize: 32,
    fontWeight: '500',
    marginTop: 8,
    color: '#000000',
  },
  tokenSymbol: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    color: '#808080',
  },
  tokenDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: '#737373',
    paddingHorizontal: 20,
    marginTop: 20
  },
  depositButtonContainer: {
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 60,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
  },
  tabItem: {
    padding: 10,
    borderRadius: 100,
  },
  activeTabItem: {
    backgroundColor: '#F4F4F5',
  },

  // Amount Input View styles
  amountInputContainer: {
    flex: 1,
  },
  amountContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 42,
    fontWeight: '500',
    color: '#000',
  },
  amountText: {
    fontSize: 72,
    fontWeight: '500',
    color: '#000',
  },
  availableText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#737373',
    textAlign: 'center',
    marginBottom: 50,
  },
  keypadContainer: {
    marginTop: 'auto',
    marginBottom: 20
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  keypadButton: {
    width: width / 3 - 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#0A0A0A',
  },
  reviewButtonContainer: {
    marginTop: 'auto',
    marginBottom: 60,
  },
  confirmContainer: {
    flex: 1,
  },
  confirmSection: {
    marginTop: 24
  },
  confirmSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#000000',
  },
  tokenReceiveCard: {
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 18,
  },
  tokenReceiveIconContainer: {
    backgroundColor: '#fff',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tokenReceiveIcon: {
    width: 36,
    height: 36,
    borderRadius: 40,
  },
  tokenReceiveAmount: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '600',
    color: '#000',
    marginTop: 12,
  },
  tokenReceiveTokens: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 24,
    color: '#A1A1A1',
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  costItemLabel: {
    fontSize: 12,
    lineHeight: 22,
    fontWeight: '500',
    color: '#000000',
  },
  costItemValue: {
    fontSize: 12,
    lineHeight: 22,
    fontWeight: '400',
    color: '#000',
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeTag: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    bottom: 0,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 12,
    lineHeight: 22,
    fontWeight: '500',
    color: '#000',
  },
  totalValue: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '600',
    color: '#000',
  },
  confirmButtonContainer: {
    marginTop: 'auto',
    marginBottom: 60,
  }
});

export default MarketScreen;