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
  ScrollView
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
const { width } = Dimensions.get('window');
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

const TopGainerItem: React.FC<TopGainerItemProps> = ({ item, index, totalItems }) => {
  return (
    <View
      style={[
        styles.gainerCard,
        {
          width: GANINER_CARD_WIDTH,
          marginRight: index === totalItems - 1 ? 0 : CARD_GAP,
          marginLeft: index < 4 ? 20 : 0
        }
      ]}
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
        {item.priceChangePercentage24H >= 0 && <Text style={[styles.priceChange, {color:'green'}]}><Ionicons name="arrow-up" size={24} color="green" />{item.priceChangePercentage24H.toFixed(2)}%</Text>}
        {item.priceChangePercentage24H < 0 && <Text style={[styles.priceChange, {color:'red'}]}><Ionicons name="arrow-down" size={24} color="red" />{item.priceChangePercentage24H.toFixed(2)}%</Text>}
      </View>
    </View>
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

  const renderTopGainerPage = useCallback(
    ({ item }: { item: tokenProps[] }) => (
      <View style={{ width: GANINER_CARD_WIDTH + CARD_GAP }}>
        {item.map((gainer, index) => (
          <TopGainerItem
            key={gainer.id}
            item={gainer}
            index={index}
            totalItems={item.length} // or groupedPages.length if you prefer overall count
          />
        ))}
      </View>
    ),
    [groupedGainerPages.length]
  );

  const renderTrendingPage = useCallback(
    ({ item }: { item: tokenProps[] }) => (
      <View style={{ width: GANINER_CARD_WIDTH + CARD_GAP }}>
        {item.map((trending, index) => (
          <TopGainerItem
            key={trending.id}
            item={trending}
            index={index}
            totalItems={item.length} // or groupedPages.length if you prefer overall count
          />
        ))}
      </View>
    ),
    [groupedTrendingPages.length]
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

  // Optional: Navigate to specific card programmatically
  const scrollToEducationalCard = useCallback((index: number) => {
    topCarouselRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  const scrollToGainer = useCallback((index: number) => {
    bottomCarouselRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  const handleFundWalle = async () => {
    fundWallet({
      address: account?.address,
      chain: base,
    });
  }

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
          onPress={handleFundWalle}
        />
      </View>
    </SafeAreaView>

  );
};

// Typed styles
interface IStyles {
  container: ViewStyle;
  header: ViewStyle;
  welcomeText: TextStyle;
  dateContainer: ViewStyle;
  dateText: TextStyle;
  marketStatus: ViewStyle;
  statusDot: ViewStyle;
  statusText: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  sectionSubtitle: TextStyle;
  carouselContainer: ViewStyle;
  carouselContent: ViewStyle;
  educationalCard: ViewStyle;
  cardGradient: ViewStyle;
  cardImage: ImageStyle;
  cardContent: ViewStyle;
  cardDuration: TextStyle;
  cardTitle: TextStyle;
  indicators: ViewStyle;
  indicator: ViewStyle;
  activeIndicator: ViewStyle;
  gainerCard: ViewStyle;
  gainerIcon: ImageStyle;
  gainerIconText: TextStyle;
  gainerInfo: ViewStyle;
  gainerName: TextStyle;
  gainerTicker: TextStyle;
  gainerPrice: ViewStyle;
  priceValue: TextStyle;
  priceChange: TextStyle;
  footer: ViewStyle;
}

const styles = StyleSheet.create<IStyles>({
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
  }
});

export default MarketScreen;