import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Meal } from '../types';

interface MealOverlayProps {
  meal: Meal;
  onOrderPress: (meal: Meal) => void;
}

export const MealOverlay: React.FC<MealOverlayProps> = ({ meal, onOrderPress }) => {
  const handleOrderPress = () => {
    onOrderPress(meal);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      {/* Left side content */}
      <View style={styles.contentContainer}>
        {/* Restaurant info */}
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantIcon}>👨‍🍳</Text>
          <Text style={styles.restaurantName}>
            {meal.restaurant?.name || 'Unknown Restaurant'}
          </Text>
        </View>

        {/* Meal info */}
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{meal.name}</Text>
          {meal.description && (
            <Text style={styles.mealDescription} numberOfLines={2}>
              {meal.description}
            </Text>
          )}
        </View>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price:</Text>
          <Text style={styles.price}>{formatPrice(meal.price)}</Text>
        </View>
      </View>

      {/* Right side actions */}
      <View style={styles.actionsContainer}>
        {/* Order button */}
        <TouchableOpacity
          style={styles.orderButton}
          onPress={handleOrderPress}
          activeOpacity={0.8}
        >
          <Text style={styles.orderButtonIcon}>🛒</Text>
          <Text style={styles.orderButtonText}>Order Now</Text>
          <Text style={styles.orderButtonPrice}>{formatPrice(meal.price)}</Text>
        </TouchableOpacity>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>❤️</Text>
            <Text style={styles.actionCount}>12.3K</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionCount}>1.2K</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionCount}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    marginRight: 16,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  restaurantName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  mealInfo: {
    marginBottom: 12,
  },
  mealName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mealDescription: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginRight: 8,
  },
  price: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionsContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  orderButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  orderButtonPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionCount: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
});