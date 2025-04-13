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

import {
  EducationalCard,
  tokenProps,
  CarouselIndicatorsProps,
  EducationalCardItemProps,
  TopGainerItemProps
} from '@/interface/types'

// Constants for layout measurements
const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.5;
const GANINER_CARD_WIDTH = width * 0.86;
const CARD_GAP = 12;

// Sub-components
const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({ items, activeIndex }) => {
  return (
    <View style={styles.indicators}>
      {items.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            index === activeIndex && styles.activeIndicator
          ]}
        />
      ))}
    </View>
  );
};

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

const AmountInputView = ({ token, onBack, onReview }) => {
  const [amount, setAmount] = useState('0');
  const [isFocused, setIsFocused] = useState(false);
  
  const handleNumberPress = (num) => {
    // Don't add leading zeros
    if (amount === '0' && num === '0') return;
    
    // Replace initial zero or set the number
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
  
  const availableBalance = 254.43; // This would come from your wallet or props
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.amountInputContainer}
    >
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Buy {token.symbol}</Text>
        <View style={{ width: 40 }} /> {/* Empty view for balance */}
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <Text style={styles.amountText}>{amount}</Text>
      </View>
      
      <Text style={styles.availableText}>
        ${availableBalance.toFixed(2)} available to buy {token.symbol}
      </Text>
      
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
    </KeyboardAvoidingView>
  );
};

// Token Detail Modal Component
const TokenDetailModal = ({ 
  visible, 
  token, 
  onClose, 
  onDeposit 
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [modalView, setModalView] = useState('details'); // 'details' or 'amount'

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
    setModalView('amount');
  };

  const handleBack = () => {
    setModalView('details');
  };

  const handleReview = (amount) => {
    // Here you would handle the purchase review
    console.log(`Review purchase of ${amount} ${token?.symbol}`);
    onDeposit(); // For now, just call the existing onDeposit function
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
              {modalView === 'details' ? (
                // Token Details View
                <>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton}>
                      <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>{token.name}</Text>
                    <View style={{ width: 40 }} /> {/* Empty view for balance */}
                  </View>

                  <View style={styles.tokenIconContainer}>
                    <Image
                      source={{ uri: token.logo }}
                      style={styles.tokenIcon}
                      resizeMode="cover"
                    />
                    <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                  </View>

                  <Text style={styles.tokenDescription}>
                    This is the description about {token.name}. This is the description about {token.name}. 
                    This is the description about {token.name}. This is the description about {token.name}.
                  </Text>

                  <View style={styles.depositButtonContainer}>
                    <PrimaryButton
                      title="Deposit"
                      style={{ width: "100%" }}
                      onPress={handleDeposit}
                    />
                  </View>

                  <View style={styles.tabBar}>
                    <TouchableOpacity style={styles.tabItem}>
                      <Ionicons name="home-outline" size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabItem}>
                      <Ionicons name="list-outline" size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabItem}>
                      <Ionicons name="paper-plane-outline" size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabItem}>
                      <Ionicons name="document-outline" size={24} color="#000" />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                // Amount Input View
                <AmountInputView 
                  token={token}
                  onBack={handleBack}
                  onReview={handleReview}
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
  const { fundWallet } = useFundWallet();

  // Token detail modal state
  const [selectedToken, setSelectedToken] = useState<tokenProps | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (isReady) {
      console.log("user:", user);
      if (!user) {
        router.replace('/login');
      } else {
        console.log("Authenticated, staying on tabs");
      }
      setIsLoading(false);
    }
  }, [isReady, router]);

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
    ({ item }: { item: tokenProps[] }) => (
      <View style={{ width: GANINER_CARD_WIDTH + CARD_GAP }}>
        {item.map((gainer, index) => (
          <TopGainerItem
            key={gainer.id}
            item={gainer}
            index={index}
            totalItems={item.length}
            onPress={handleTokenPress}
          />
        ))}
      </View>
    ),
    [handleTokenPress]
  );

  const renderTrendingPage = useCallback(
    ({ item }: { item: tokenProps[] }) => (
      <View style={{ width: GANINER_CARD_WIDTH + CARD_GAP }}>
        {item.map((trending, index) => (
          <TopGainerItem
            key={trending.id}
            item={trending}
            index={index}
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
              keyExtractor={(_, index) => index.toString()}
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
              keyExtractor={(_, index) => index.toString()}
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
      <View style={[styles.footer, { marginBottom: 20 }]}>
        <PrimaryButton
          title="Deposit"
          style={{ width: "100%" }}
          onPress={handleFundWallet}
        />
      </View>

      {/* Token Detail Modal */}
      <TokenDetailModal
        visible={modalVisible}
        token={selectedToken}
        onClose={closeModal}
        onDeposit={handleFundWallet}
      />
    </SafeAreaView>
  );
};

// Updated styles with modal styles
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
    paddingTop: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // To balance with the back button
  },
  tokenIconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  tokenIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    color: '#808080',
  },
  tokenDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  depositButtonContainer: {
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 20,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 10,
  },
  tabItem: {
    padding: 10,
  },
  
  // Amount Input View styles
  amountInputContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 40,
    fontWeight: '600',
    color: '#000',
  },
  amountText: {
    fontSize: 72,
    fontWeight: '600',
    color: '#000',
  },
  availableText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  keypadContainer: {
    marginTop: 'auto',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  keypadButton: {
    width: width / 3 - 40,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  keypadButtonText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#000',
  },
  reviewButtonContainer: {
    marginTop: 'auto',
    marginBottom: 40,
  }
});

export default MarketScreen;