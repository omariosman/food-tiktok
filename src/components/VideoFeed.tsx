import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native';
import { VideoPlayer } from './VideoPlayer';
import { MealOverlay } from './MealOverlay';
import { Meal } from '../types';
import { dbHelpers } from '../services/supabase';

interface VideoFeedProps {
  onOrderPress: (meal: Meal) => void;
}

interface VideoFeedItem {
  meal: Meal;
  isVisible: boolean;
}

const { height: screenHeight } = Dimensions.get('window');

export const VideoFeed: React.FC<VideoFeedProps> = ({ onOrderPress }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  
  const flatListRef = useRef<FlatList>(null);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
    waitForInteraction: false,
  });

  // Load initial meals
  const loadMeals = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (!refresh && meals.length === 0) {
        setLoading(true);
      }

      const { data, error } = await dbHelpers.getMeals();
      
      if (error) {
        console.error('Error loading meals:', error);
        return;
      }

      if (data) {
        setMeals(data);
        setHasMoreData(data.length >= 20); // Assume 20 is page size
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [meals.length]);

  // Load more meals for infinite scrolling
  const loadMoreMeals = useCallback(async () => {
    if (loadingMore || !hasMoreData) return;

    try {
      setLoadingMore(true);
      // In a real app, you'd implement pagination here
      // For now, we'll just prevent loading more if we have data
      if (meals.length > 0) {
        setLoadingMore(false);
        return;
      }
    } catch (error) {
      console.error('Error loading more meals:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMoreData, meals.length]);

  // Handle scroll and determine which video should be visible
  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const visibleIndex = viewableItems[0].index;
      setCurrentVisibleIndex(visibleIndex);
    }
  }, []);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    loadMeals(true);
  }, [loadMeals]);

  // Load meals on component mount
  useEffect(() => {
    loadMeals();
  }, []);

  // Render each video item
  const renderVideoItem = ({ item, index }: { item: Meal; index: number }) => {
    const isVisible = index === currentVisibleIndex;

    return (
      <View style={styles.videoContainer}>
        <VideoPlayer
          meal={item}
          isVisible={isVisible}
          onLoadStart={() => console.log(`Loading video for ${item.name}`)}
          onLoad={() => console.log(`Loaded video for ${item.name}`)}
          onError={(error) => console.error(`Video error for ${item.name}:`, error)}
        />
        <MealOverlay
          meal={item}
          onOrderPress={onOrderPress}
        />
      </View>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading delicious meals...</Text>
      </View>
    );
  }

  // Render empty state
  if (meals.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🍽️</Text>
        <Text style={styles.emptyTitle}>No meals available</Text>
        <Text style={styles.emptySubtitle}>
          Check back later for amazing meal videos!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={meals}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={screenHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig.current}
        onViewableItemsChanged={onViewableItemsChanged}
        onEndReached={loadMoreMeals}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B35"
            colors={['#FF6B35']}
          />
        }
        ListFooterComponent={() => 
          loadingMore ? (
            <View style={styles.loadMoreContainer}>
              <ActivityIndicator size="small" color="#FF6B35" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    height: screenHeight,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadMoreContainer: {
    padding: 20,
    alignItems: 'center',
  },
});