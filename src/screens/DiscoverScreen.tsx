import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface DiscoverScreenProps {
  navigation?: any;
}

interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
}

interface DealItem {
  id: string;
  title: string;
  originalPrice: string;
  salePrice: string;
  image: string;
  isBogo?: boolean;
}

const categories: CategoryItem[] = [
  { id: '1', name: 'Comfort Food', emoji: '🍕' },
  { id: '2', name: 'Italian', emoji: '🍝' },
  { id: '3', name: 'Salad', emoji: '🥗' },
  { id: '4', name: 'Korean', emoji: '🥢' },
  { id: '5', name: 'Poke', emoji: '🍣' },
];

const exclusiveDeals: DealItem[] = [
  {
    id: '1',
    title: 'Center of the Roll™',
    originalPrice: '$12.58',
    salePrice: '$6.29',
    image: 'https://via.placeholder.com/300x200/333/fff?text=Roll',
    isBogo: true,
  },
  {
    id: '2',
    title: 'Fresh Handmade X-L...',
    originalPrice: '$9.98',
    salePrice: '$4.99',
    image: 'https://via.placeholder.com/300x200/666/fff?text=Muffins',
    isBogo: true,
  },
];

const savedItems: DealItem[] = [
  {
    id: '1',
    title: 'Zest Sushi Roll',
    originalPrice: '$15.00',
    salePrice: '$12.00',
    image: 'https://via.placeholder.com/300x200/FF8C00/fff?text=Zest+Sushi',
  },
  {
    id: '2',
    title: 'Saved Item 2',
    originalPrice: '$20.00',
    salePrice: '$16.00',
    image: 'https://via.placeholder.com/300x200/ccc/fff?text=Saved2',
  },
];

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = React.useState('');

  const handleLocationPress = () => {
    // Handle location access
    console.log('Location access requested');
  };

  const handleCategoryPress = (category: CategoryItem) => {
    console.log('Category selected:', category.name);
  };

  const handleDealPress = (deal: DealItem) => {
    // Navigate to restaurant detail for Zest Sushi as example
    if (deal.title.includes('Roll') || deal.title.includes('Sushi')) {
      navigation?.navigate('RestaurantDetail', { restaurantId: 'zest-sushi' });
    } else {
      console.log('Deal selected:', deal.title);
    }
  };

  const renderCategoryItem = (item: CategoryItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
    >
      <View style={styles.categoryIcon}>
        <Text style={styles.categoryEmoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderDealItem = (item: DealItem, showBogoTag = false) => (
    <TouchableOpacity
      key={item.id}
      style={styles.dealCard}
      onPress={() => handleDealPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.dealImage} />
      {showBogoTag && item.isBogo && (
        <View style={styles.bogoTag}>
          <Text style={styles.bogoText}>BOGO</Text>
        </View>
      )}
      <View style={styles.dealContent}>
        <Text style={styles.dealTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          <Text style={styles.salePrice}>{item.salePrice}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.locationButton} onPress={handleLocationPress}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>Allow access to location</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cartButton}>
            <Text style={styles.cartIcon}>🛒</Text>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for dishes, restaurants..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(renderCategoryItem)}
        </ScrollView>

        {/* Exclusive Deals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🔥</Text>
            <Text style={styles.sectionTitle}>Exclusive Deals</Text>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dealsContainer}
            contentContainerStyle={styles.dealsContent}
          >
            {exclusiveDeals.map(item => renderDealItem(item, true))}
          </ScrollView>
        </View>

        {/* Saved Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🔖</Text>
            <Text style={styles.sectionTitle}>Saved</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dealsContainer}
            contentContainerStyle={styles.dealsContent}
          >
            {savedItems.map(item => renderDealItem(item, false))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
  },
  cartButton: {
    position: 'relative',
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    marginBottom: 25,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#f8f8f8',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  seeAll: {
    fontSize: 14,
    color: '#007AFF',
  },
  dealsContainer: {
    marginBottom: 10,
  },
  dealsContent: {
    paddingHorizontal: 20,
  },
  dealCard: {
    width: 280,
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
  dealImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  bogoTag: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bogoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dealContent: {
    padding: 15,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  salePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 30,
    height: 30,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});