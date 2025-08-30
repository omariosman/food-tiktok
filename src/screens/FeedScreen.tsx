import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VideoFeed } from '../components/VideoFeed';
import { Meal } from '../types';

interface FeedScreenProps {
  navigation?: any;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({ navigation }) => {
  const handleOrderPress = (meal: Meal) => {
    // Navigate to checkout screen with meal data
    navigation?.navigate('Checkout', { meal });
  };

  return (
    <View style={styles.container}>
      <VideoFeed onOrderPress={handleOrderPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});