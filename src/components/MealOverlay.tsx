import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
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
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.locationButton}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>Allow access to location</Text>
        </TouchableOpacity>
        
        <View style={styles.topRightActions}>
          <TouchableOpacity style={styles.topActionButton}>
            <Text style={styles.topActionIcon}>⚖️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topActionButton}>
            <Text style={styles.topActionIcon}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        {/* Right side actions */}
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionButtonCircle}>
              <Text style={styles.actionIcon}>🔖</Text>
            </View>
            <Text style={styles.actionLabel}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionButtonCircle}>
              <Text style={styles.actionIcon}>⭐</Text>
            </View>
            <Text style={styles.actionLabel}>Reviews</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionButtonCircle}>
              <Text style={styles.actionIcon}>📤</Text>
            </View>
            <Text style={styles.actionLabel}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionButtonCircle}>
              <Text style={styles.actionIcon}>🔊</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Content */}
        <View style={styles.bottomContent}>
          {/* Swipe Hint */}
          <View style={styles.swipeHint}>
            <Text style={styles.swipeIcon}>《《</Text>
            <Text style={styles.swipeText}>
              Swipe left to see more{'\n'}dishes from this restaurant
            </Text>
          </View>

          {/* Meal Information */}
          <View style={styles.mealSection}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.mealDescription} numberOfLines={2}>
              {meal.description || 'Delicious meal crafted with premium ingredients...'}
            </Text>
            
            {/* Restaurant Info */}
            <View style={styles.restaurantRow}>
              <Text style={styles.restaurantIcon}>🏢</Text>
              <Text style={styles.restaurantName}>
                {meal.restaurant?.name || 'Restaurant Name'}
              </Text>
              <Text style={styles.deliveryTime}>35 min</Text>
            </View>

            {/* Rating */}
            <View style={styles.ratingRow}>
              <Text style={styles.ratingIcon}>❤️</Text>
              <Text style={styles.ratingText}>4.5</Text>
              <Text style={styles.ratingIcon}>🔥</Text>
              <Text style={styles.ratingText}>4.2</Text>
              <Text style={styles.reviewCount}>(100+)</Text>
            </View>
          </View>

          {/* Action Buttons Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuIcon}>🍽️</Text>
              <Text style={styles.menuText}>Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleOrderPress}
              activeOpacity={0.8}
            >
              <Text style={styles.cartIcon}>🛒</Text>
              <Text style={styles.addToCartText}>Add to cart</Text>
              <Text style={styles.cartPrice}>{formatPrice(meal.price)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  locationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  topRightActions: {
    flexDirection: 'row',
    gap: 12,
  },
  topActionButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topActionIcon: {
    fontSize: 18,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: 150,
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonCircle: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  swipeHint: {
    backgroundColor: 'rgba(139, 69, 19, 0.8)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  swipeIcon: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 8,
  },
  swipeText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  mealSection: {
    marginBottom: 16,
  },
  mealName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mealDescription: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    lineHeight: 18,
    marginBottom: 12,
  },
  restaurantRow: {
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
    fontWeight: '500',
    flex: 1,
  },
  deliveryTime: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
  },
  reviewCount: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  menuButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cartIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  cartPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});