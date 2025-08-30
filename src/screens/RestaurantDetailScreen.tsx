import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

interface RestaurantDetailScreenProps {
  navigation?: any;
  route?: any;
}

interface MenuItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category?: string;
  description?: string;
}

const highlightedItems: MenuItem[] = [
  {
    id: '1',
    name: 'Purple Fries',
    price: '$8.99',
    image: 'https://via.placeholder.com/300x200/6B46C1/fff?text=Purple+Fries',
  },
  {
    id: '2',
    name: 'Chicken Katsu',
    price: '$12.99',
    image: 'https://via.placeholder.com/300x200/F97316/fff?text=Chicken+Katsu',
  },
];

const soupSaladItems: MenuItem[] = [
  {
    id: '1',
    name: 'Kani Salad',
    description: 'Spicy Available',
    price: '$9.00',
    image: 'https://via.placeholder.com/80x80/10B981/fff?text=Salad',
    category: 'Soup & Salad',
  },
];

export const RestaurantDetailScreen: React.FC<RestaurantDetailScreenProps> = ({ 
  navigation 
}) => {
  const handleBackPress = () => {
    navigation?.goBack();
  };

  const handleMenuItemPress = (item: MenuItem) => {
    console.log('Menu item selected:', item.name);
  };

  const handleAddItem = (item: MenuItem) => {
    console.log('Add item to cart:', item.name);
  };

  const renderHighlightedItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.highlightedCard}
      onPress={() => handleMenuItemPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.highlightedImage} />
      <View style={styles.highlightedContent}>
        <Text style={styles.highlightedName}>{item.name}</Text>
      </View>
      <TouchableOpacity 
        style={styles.highlightedAddButton}
        onPress={() => handleAddItem(item)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuItemPress(item)}
    >
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.menuItemDescription}>{item.description}</Text>
        )}
        <Text style={styles.menuItemPrice}>{item.price}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.menuItemImage} />
      <TouchableOpacity 
        style={styles.menuAddButton}
        onPress={() => handleAddItem(item)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar backgroundColor="#FF8C00" barStyle="light-content" />
      <View style={styles.container}>
        {/* Orange Header */}
        <View style={styles.orangeHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>⊖</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>ℹ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>↗</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🔍</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Restaurant Info */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.restaurantInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.restaurantName}>Zest Sushi</Text>
              <TouchableOpacity style={styles.openButton}>
                <Text style={styles.openButtonText}>Open</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.address}>249 Broome St • 0.9 miles away</Text>
            
            <View style={styles.ratingsRow}>
              <View style={styles.ratingItem}>
                <Text style={styles.ratingIcon}>🔒</Text>
                <Text style={styles.ratingText}>8.2</Text>
              </View>
              <View style={styles.ratingItem}>
                <Text style={styles.ratingIcon}>G</Text>
                <Text style={styles.ratingText}>4.6</Text>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.reviewCount}>(650+)</Text>
              </View>
              <View style={styles.ratingItem}>
                <Text style={styles.ratingIcon}>🔴</Text>
                <Text style={styles.ratingText}>4.3</Text>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.reviewCount}>(990+)</Text>
              </View>
            </View>
            
            {/* Delivery Info */}
            <View style={styles.deliveryInfo}>
              <View style={styles.deliveryItem}>
                <Text style={styles.deliveryValue}>$0.00</Text>
                <Text style={styles.deliveryLabel}>Delivery Fee</Text>
              </View>
              <View style={styles.deliveryItem}>
                <Text style={styles.deliveryValue}>35 min</Text>
                <Text style={styles.deliveryLabel}>Earliest Arrival</Text>
              </View>
              <View style={styles.deliveryItem}>
                <Text style={styles.deliveryValue}>$18</Text>
                <Text style={styles.deliveryLabel}>Minimum Order</Text>
              </View>
            </View>
          </View>

          {/* Highlighted Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Highlighted items</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.highlightedContainer}
              contentContainerStyle={styles.highlightedScrollContent}
            >
              {highlightedItems.map(renderHighlightedItem)}
            </ScrollView>
          </View>

          {/* Menu Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Soup & Salad</Text>
            {soupSaladItems.map(renderMenuItem)}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  orangeHeader: {
    backgroundColor: '#FF8C00',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 15,
  },
  backButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  actionIcon: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  restaurantInfo: {
    padding: 20,
    backgroundColor: '#fff',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  openButton: {
    backgroundColor: '#fff',
    borderColor: '#4CAF50',
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  openButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  ratingsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  ratingIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 2,
  },
  deliveryInfo: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-around',
  },
  deliveryItem: {
    alignItems: 'center',
  },
  deliveryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  highlightedContainer: {
    marginBottom: 10,
  },
  highlightedScrollContent: {
    paddingHorizontal: 20,
  },
  highlightedCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  highlightedImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  highlightedContent: {
    padding: 12,
  },
  highlightedName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  highlightedAddButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    position: 'relative',
  },
  menuItemContent: {
    flex: 1,
    marginRight: 15,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  menuAddButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 28,
    height: 28,
    backgroundColor: '#007AFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});