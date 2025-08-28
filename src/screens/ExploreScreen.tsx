import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VideoFeed } from '../components/VideoFeed';
import { Meal } from '../types';

interface ExploreScreenProps {
  navigation?: any;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
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