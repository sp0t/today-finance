import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Platform,
    ImageSourcePropType,
    ListRenderItemInfo
} from 'react-native';

import images from '@/styles/images';
import { useRouter } from 'expo-router';
import { usePrivy } from '@privy-io/expo';
import { useEffect, useState } from 'react';

interface feedItemProps {
    id: string;
    user: string;
    action: string;
    token: string;
    ticker?: string;  // ticker can be optional if needed
    time: string;
    avatar: any;
    tokenIcon: any;
    recipient?: string; // Mark as optional with '?'
}

// Sample data for the feed with many items to demonstrate scrolling
const feedData = [
    {
        id: '1',
        user: 'Heather',
        action: 'bought',
        token: 'Ondo Finance',
        ticker: 'ONDO',
        time: '2 mins ago',
        avatar: images.login.SendBottom,
        tokenIcon: images.login.SendBottom,
    },
    {
        id: '2',
        user: 'Ryan',
        action: 'sent',
        token: 'USDC',
        recipient: 'Sanjay',
        time: '20 mins ago',
        avatar: images.login.SendBottom,
        tokenIcon: images.login.SendBottom,
    },
    {
        id: '3',
        user: 'Kristina',
        action: 'sold',
        token: 'Pepe',
        ticker: 'PEPE',
        time: '2 mins ago',
        avatar: images.login.SendBottom,
        tokenIcon: images.login.SendBottom,
    },
    {
        id: '4',
        user: 'Luca',
        action: 'sent',
        token: 'USDC',
        recipient: 'Mike',
        time: '20 mins ago',
        avatar: images.login.SendBottom,
        tokenIcon: images.login.SendBottom,
    },
    {
        id: '5',
        user: 'Heather',
        action: 'bought',
        token: 'Ondo Finance',
        ticker: 'ONDO',
        time: '1 hr ago',
        avatar: images.login.SendBottom,
        tokenIcon: images.login.SendBottom,
    },
    {
        id: '6',
        user: 'Ryan',
        action: 'sent',
        token: 'USDC',
        recipient: 'Sanjay',
        time: '2 hrs ago',
        avatar: images.login.SendBottom,
        tokenIcon: images.login.SendBottom,
    },
    {
        id: '7',
        user: 'Heather',
        action: 'bought',
        token: 'Ondo Finance',
        ticker: 'ONDO',
        time: '2 hrs ago',
        avatar: images.login.SendBottom,
        tokenIcon: images.login.SendBottom,
    },
    {
        id: '8',
        user: 'Ryan',
        action: 'sent',
        token: 'USDC',
        recipient: 'Sanjay',
        time: '4 hrs ago',
        avatar: images.login.SendBottom,
        tokenIcon: images.login.SendBottom,
    },
    // Add more items to demonstrate scrolling
    {
        id: '9',
        user: 'Maria',
        action: 'bought',
        token: 'Bitcoin',
        ticker: 'BTC',
        time: '5 hrs ago',
        avatar: images.login.SendBottom,
        tokenIcon: images.login.SendBottom,
    },
    {
        id: '10',
        user: 'David',
        action: 'sold',
        token: 'Ethereum',
        ticker: 'ETH',
        time: '6 hrs ago',
        avatar: images.login.SendBottom,
        tokenIcon: images.login.SendBottom,
    },
    {
        id: '11',
        user: 'Sophie',
        action: 'sent',
        token: 'USDC',
        recipient: 'Alex',
        time: '7 hrs ago',
        avatar: images.login.SendBottom,
        tokenIcon: images.login.SendBottom,
    },
    {
        id: '12',
        user: 'Michael',
        action: 'bought',
        token: 'Solana',
        ticker: 'SOL',
        time: '8 hrs ago',
        avatar: images.login.SendBottom,
        tokenIcon: images.login.SendBottom,
    },
];

const FeedScreen = () => {
    const router = useRouter();
    const { user, isReady } = usePrivy();
    const [isLoading, setIsLoading] = useState(true);

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

    const renderFeedItem = ({ item }: ListRenderItemInfo<feedItemProps>) => (
        <View style={styles.feedItem}>
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.feedContent}>
                <Text style={styles.feedText}>
                    <Text style={styles.username}>{item.user}</Text>{' '}
                    <Text style={styles.action}>{item.action}</Text>{' '}
                    {renderTokenInfo(item)}
                    {item.recipient && (
                        <Text>
                            {' to '}
                            <Text style={styles.username}>{item.recipient}</Text>
                        </Text>
                    )}
                </Text>
                <Text style={styles.timeText}>{item.time}</Text>
            </View>
        </View>
    );

    // Helper to render token information remains the same
    const renderTokenInfo = (item: feedItemProps) => (
        <>
            <Image source={item.tokenIcon} style={styles.tokenIcon} />
            <Text style={styles.token}>{item.token}</Text>
            {item.ticker && <Text style={styles.ticker}>({item.ticker})</Text>}
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>What's happening</Text>
            </View>

            {/* Feed List - Fully Scrollable */}
            <FlatList<feedItemProps>
                data={feedData}
                renderItem={renderFeedItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.feedList}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
            />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
    },
    feedList: {
        paddingHorizontal: 16,
        paddingBottom: 16, // Added padding at the bottom to ensure all content is visible
    },
    feedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    feedContent: {
        flex: 1,
    },
    feedText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#000000',
    },
    username: {
        fontWeight: '600',
    },
    action: {
        fontWeight: '400',
    },
    tokenIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginHorizontal: 2,
    },
    token: {
        fontWeight: '500',
    },
    ticker: {
        fontWeight: '400',
        color: '#666666',
    },
    timeText: {
        fontSize: 12,
        color: '#777777',
        marginTop: 4,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#FFFFFF',
        // Make sure the tab bar stays at the bottom and doesn't scroll
        position: 'absolute',
        bottom: 20, // Added space for the bottom indicator
        left: 0,
        right: 0,
    },
    tabButton: {
        padding: 8,
    },
    activeTab: {
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
    },
    tabIcon: {
        width: 24,
        height: 24,
    },
    bottomIndicator: {
        height: 4,
        width: 40,
        backgroundColor: '#000000',
        alignSelf: 'center',
        borderRadius: 2,
        position: 'absolute',
        bottom: 8,
        left: '50%',
        marginLeft: -20, // Center the indicator
    },
});

export default FeedScreen;