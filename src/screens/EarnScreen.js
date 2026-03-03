import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const { height, width } = Dimensions.get('window');

// --- MOCK ADS FOR EXPO GO TESTING ---
// Real Google Ads require a custom Development Build. 
// These mocks allow you to test the UI and logic in the standard Expo Go app.
const TestIds = { REWARDED: 'mock-ad-unit-id' };
const RewardedAdEventType = {
  LOADED: 'loaded',
  EARNED_REWARD: 'earned',
  CLOSED: 'closed',
};

const createMockRewardedAd = () => {
  const listeners = {};
  return {
    load: () => {
      console.log('Mock Ad: Loading...');
      setTimeout(() => {
        console.log('Mock Ad: Loaded');
        if (listeners[RewardedAdEventType.LOADED]) listeners[RewardedAdEventType.LOADED]();
      }, 1500); // Simulate 1.5s load time
    },
    show: () => {
      Alert.alert(
        'Mock Ad Video',
        'This is a simulation of an ad. In the real app, a video would play here.',
        [
          {
            text: 'Close & Earn Reward',
            onPress: () => {
              if (listeners[RewardedAdEventType.EARNED_REWARD]) listeners[RewardedAdEventType.EARNED_REWARD]({ amount: 10 });
              if (listeners[RewardedAdEventType.CLOSED]) listeners[RewardedAdEventType.CLOSED]();
            }
          }
        ]
      );
    },
    addAdEventListener: (event, cb) => {
      listeners[event] = cb;
      return () => { delete listeners[event]; };
    }
  };
};

const adUnitId = TestIds.REWARDED;
const rewarded = createMockRewardedAd();
// ------------------------------------

const MOCK_ADS = [
  { id: '1', title: 'Crypto Exchange Pro', color: '#FF7675', points: 5 },
  { id: '2', title: 'NFT Marketplace', color: '#74B9FF', points: 20 },
  { id: '3', title: 'DeFi Wallet', color: '#55EFC4', points: 2 },
  { id: '4', title: 'Play to Earn Game', color: '#A29BFE', points: 15 },
  { id: '5', title: 'Metaverse Land', color: '#FD79A8', points: 10 },
];

// --- Components ---

const AdCard = React.memo(({ item, isLoaded, onWatch }) => {
  return (
    <View style={[styles.adContainer, { backgroundColor: item.color }]}>
      <Text style={styles.adTitle}>{item.title}</Text>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.watchButton, !isLoaded && styles.disabledButton]} 
          onPress={onWatch}
          disabled={!isLoaded}
          activeOpacity={0.8}
        >
          {isLoaded ? (
            <>
              <Ionicons name="play-circle" size={40} color="#2c3e50" />
              <Text style={styles.watchButtonText}>Watch Ad</Text>
            </>
          ) : (
            <ActivityIndicator size="small" color="#2c3e50" />
          )}
        </TouchableOpacity>
        <Text style={styles.pointsLabel}>Earn +{item.points} PTS</Text>
      </View>

      <Text style={styles.instruction}>
        Watch the full video to receive your reward
      </Text>
    </View>
  );
});

const Header = ({ points }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Watch & Earn</Text>
    <View style={styles.pointsBadge}>
      <Text style={styles.pointsText}>{points} PTS</Text>
    </View>
  </View>
);


// --- Main Screen ---

export default function EarnScreen() {
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  
  // Keep track of visible index in a ref for the event listener closure
  const visibleIndexRef = useRef(0);

  useEffect(() => {
    visibleIndexRef.current = visibleIndex;
  }, [visibleIndex]);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });
    
    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
      // Award points based on the currently visible card
      const currentAd = MOCK_ADS[visibleIndexRef.current];
      const pointsToAward = currentAd ? currentAd.points : 10;
      
      setEarnedPoints(prev => prev + pointsToAward);
      Alert.alert('Reward Earned!', `You received ${pointsToAward} points.`);
    });

    const unsubscribeClosed = rewarded.addAdEventListener(RewardedAdEventType.CLOSED, () => {
      setLoaded(false);
      rewarded.load(); // Pre-load the next ad
    });

    // Start loading the first ad
    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, []);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleIndex(viewableItems[0].index);
    }
  }, []);
  
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 }).current;

  const handleWatchAd = useCallback(() => {
    if (loaded) {
      rewarded.show();
    } else {
      Alert.alert('Loading...', 'Please wait for the ad to load.');
    }
  }, [loaded]);

  const renderItem = useCallback(({ item, index }) => (
    <AdCard 
      item={item} 
      isLoaded={loaded}
      onWatch={handleWatchAd}
    />
  ), [loaded, handleWatchAd]);


  return (
    <SafeAreaView style={styles.container}>
      <Header points={earnedPoints} />
      <FlatList
        data={MOCK_ADS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
      />
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    position: 'absolute',
    top: 50, // Adjusted for typical notch area
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  pointsBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  adContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  actionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  watchButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: '#ecf0f1',
  },
  watchButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  pointsLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  instruction: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    position: 'absolute',
    bottom: 120,
  },
});