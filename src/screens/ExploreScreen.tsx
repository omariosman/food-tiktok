import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { VideoFeed } from '../components/VideoFeed';
import { Meal } from '../types';

interface ExploreScreenProps {
  navigation?: any;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const handleOrderPress = (meal: Meal) => {
    // TODO: Navigate to checkout screen when implemented
    Alert.alert(
      'Order Meal',
      `Would you like to order "${meal.name}" for $${meal.price.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Order Now', 
          onPress: () => {
            // TODO: Implement checkout flow
            Alert.alert('Coming Soon', 'Checkout functionality will be implemented soon!');
          }
        },
      ]
    );
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