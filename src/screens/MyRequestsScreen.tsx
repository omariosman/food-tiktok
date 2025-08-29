import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers, supabase } from '../services/supabase';
import { Order, OrderStatus } from '../types';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

interface FilterSortState {
  status: OrderStatus | 'all';
  sortBy: 'newest' | 'oldest';
  searchQuery: string;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return '#FF9500';
      case 'confirmed': return '#007AFF';
      case 'preparing': return '#FF9500';
      case 'delivered': return '#34C759';
      case 'cancelled': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTotal = (price: number) => {
    const deliveryFee = 2.99;
    const tax = price * 0.08;
    return price + deliveryFee + tax;
  };

  return (
    <TouchableOpacity style={styles.orderCard} onPress={onPress}>
      <View style={styles.orderHeader}>
        <View style={styles.mealImageContainer}>
          {order.meal?.video_url ? (
            <View style={styles.videoThumbnail}>
              <Text style={styles.videoIcon}>🎥</Text>
            </View>
          ) : (
            <View style={styles.noImagePlaceholder}>
              <Text style={styles.noImageIcon}>🍽️</Text>
            </View>
          )}
        </View>
        
        <View style={styles.orderInfo}>
          <Text style={styles.mealName} numberOfLines={1}>
            {order.meal?.name || 'Meal'}
          </Text>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {order.restaurant?.name || 'Restaurant'}
          </Text>
          <Text style={styles.orderDate}>
            {formatDate(order.created_at)}
          </Text>
        </View>
        
        <View style={styles.orderStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
          </View>
          <Text style={styles.orderTotal}>
            ${calculateTotal(order.meal?.price || 0).toFixed(2)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.orderAddress} numberOfLines={1}>
        📍 {order.address}
      </Text>
    </TouchableOpacity>
  );
};

export const MyRequestsScreen: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  const [filterSort, setFilterSort] = useState<FilterSortState>({
    status: 'all',
    sortBy: 'newest',
    searchQuery: '',
  });

  const loadOrders = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await dbHelpers.getUserOrders(user.id);
      
      if (error) {
        console.error('Error loading orders:', error);
        Alert.alert('Error', 'Failed to load your orders. Please try again.');
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  }, [loadOrders]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      await loadOrders();
      setLoading(false);
    };

    fetchOrders();
  }, [loadOrders]);

  // Real-time order status updates
  useEffect(() => {
    if (!user) return;
    
    const subscription = supabase
      .channel('orders_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `buyer_id=eq.${user.id}`
        },
        (payload: any) => {
          console.log('Order status update received:', payload);
          
          if (payload.eventType === 'UPDATE') {
            setOrders(prevOrders => 
              prevOrders.map(order => 
                order.id === payload.new.id 
                  ? { ...order, status: payload.new.status }
                  : order
              )
            );
          } else if (payload.eventType === 'INSERT') {
            // Reload orders to get complete order with relations
            loadOrders();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, loadOrders]);

  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (filterSort.status !== 'all') {
      filtered = filtered.filter(order => order.status === filterSort.status);
    }

    // Filter by search query
    if (filterSort.searchQuery.trim()) {
      const query = filterSort.searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.meal?.name.toLowerCase().includes(query) ||
        order.restaurant?.name?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return filterSort.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredOrders(filtered);
  }, [orders, filterSort]);

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setShowOrderDetails(false);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <OrderCard order={item} onPress={() => openOrderDetails(item)} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📦</Text>
      <Text style={styles.emptyStateTitle}>No Orders Yet</Text>
      <Text style={styles.emptyStateMessage}>
        You haven't placed any orders yet. Start exploring delicious meals!
      </Text>
    </View>
  );

  const renderFilterBar = () => (
    <View style={styles.filterContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search meals or restaurants..."
          placeholderTextColor="#999"
          value={filterSort.searchQuery}
          onChangeText={(text) => setFilterSort(prev => ({ ...prev, searchQuery: text }))}
        />
      </View>
      
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterSort.status === 'all' && styles.activeFilterButton
          ]}
          onPress={() => setFilterSort(prev => ({ ...prev, status: 'all' }))}
        >
          <Text style={[
            styles.filterButtonText,
            filterSort.status === 'all' && styles.activeFilterButtonText
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        {(['pending', 'confirmed', 'preparing', 'delivered'] as OrderStatus[]).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filterSort.status === status && styles.activeFilterButton
            ]}
            onPress={() => setFilterSort(prev => ({ ...prev, status }))}
          >
            <Text style={[
              styles.filterButtonText,
              filterSort.status === status && styles.activeFilterButtonText
            ]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => setFilterSort(prev => ({ 
          ...prev, 
          sortBy: prev.sortBy === 'newest' ? 'oldest' : 'newest' 
        }))}
      >
        <Text style={styles.sortButtonText}>
          {filterSort.sortBy === 'newest' ? '📅 Newest First' : '📅 Oldest First'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Requests</Text>
        <Text style={styles.orderCount}>
          {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
        </Text>
      </View>

      {renderFilterBar()}

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={filteredOrders.length === 0 ? styles.emptyContainer : styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF6B35']}
            tintColor="#FF6B35"
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      <OrderDetailsModal
        order={selectedOrder}
        visible={showOrderDetails}
        onClose={closeOrderDetails}
      />
    </View>
  );
};

interface OrderDetailsModalProps {
  order: Order | null;
  visible: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, visible, onClose }) => {
  if (!order) return null;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return '#FF9500';
      case 'confirmed': return '#007AFF';
      case 'preparing': return '#FF9500';
      case 'delivered': return '#34C759';
      case 'cancelled': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTotal = (price: number) => {
    const subtotal = price;
    const deliveryFee = 2.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;
    
    return {
      subtotal,
      deliveryFee,
      tax,
      total,
    };
  };

  const totals = calculateTotal(order.meal?.price || 0);

  const getOrderTimeline = (status: OrderStatus) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', completed: true },
      { key: 'confirmed', label: 'Order Confirmed', completed: false },
      { key: 'preparing', label: 'Preparing Food', completed: false },
      { key: 'delivered', label: 'Delivered', completed: false },
    ];

    const statusOrder = ['pending', 'confirmed', 'preparing', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex || (status === 'cancelled' && index === 0),
      current: index === currentIndex && status !== 'cancelled',
    }));
  };

  const timeline = getOrderTimeline(order.status);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <View style={styles.modalIndicator} />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Status Header */}
          <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
            </View>
            <Text style={styles.orderIdText}>Order #{order.id.slice(-8)}</Text>
            <Text style={styles.orderDateText}>{formatDate(order.created_at)}</Text>
          </View>

          {/* Meal Information */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Meal Details</Text>
            <View style={styles.mealDetailsCard}>
              <View style={styles.mealImageContainer}>
                {order.meal?.video_url ? (
                  <View style={styles.videoThumbnail}>
                    <Text style={styles.videoIcon}>🎥</Text>
                  </View>
                ) : (
                  <View style={styles.noImagePlaceholder}>
                    <Text style={styles.noImageIcon}>🍽️</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.mealDetailsInfo}>
                <Text style={styles.mealDetailsName}>{order.meal?.name || 'Meal'}</Text>
                <Text style={styles.restaurantDetailsName}>
                  {order.restaurant?.name || 'Restaurant'}
                </Text>
                {order.meal?.description && (
                  <Text style={styles.mealDescription}>{order.meal.description}</Text>
                )}
                <Text style={styles.mealPrice}>${order.meal?.price.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Order Timeline - Only show if not cancelled */}
          {order.status !== 'cancelled' && (
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Order Progress</Text>
              <View style={styles.timeline}>
                {timeline.map((step, index) => (
                  <View key={step.key} style={styles.timelineStep}>
                    <View style={styles.timelineLeft}>
                      <View style={[
                        styles.timelineCircle,
                        step.completed && styles.timelineCircleCompleted,
                        step.current && styles.timelineCircleCurrent,
                      ]}>
                        {step.completed && <Text style={styles.timelineCheckmark}>✓</Text>}
                      </View>
                      {index < timeline.length - 1 && (
                        <View style={[
                          styles.timelineLine,
                          step.completed && styles.timelineLineCompleted,
                        ]} />
                      )}
                    </View>
                    <Text style={[
                      styles.timelineLabel,
                      step.completed && styles.timelineLabelCompleted,
                      step.current && styles.timelineLabelCurrent,
                    ]}>
                      {step.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Delivery Information */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Delivery Information</Text>
            <View style={styles.deliveryInfo}>
              <View style={styles.deliveryRow}>
                <Text style={styles.deliveryLabel}>📍 Address</Text>
                <Text style={styles.deliveryValue}>{order.address}</Text>
              </View>
              <View style={styles.deliveryRow}>
                <Text style={styles.deliveryLabel}>📞 Phone</Text>
                <Text style={styles.deliveryValue}>{order.phone}</Text>
              </View>
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Order Summary</Text>
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${totals.subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>${totals.deliveryFee.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>${totals.tax.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${totals.total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderCount: {
    fontSize: 14,
    color: '#666',
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  filterButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterButton: {
    backgroundColor: '#FF6B35',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  sortButton: {
    alignSelf: 'flex-start',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 24,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 4,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  mealImageContainer: {
    marginRight: 12,
  },
  videoThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    fontSize: 20,
  },
  noImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageIcon: {
    fontSize: 20,
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  restaurantName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
  },
  orderStatus: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderAddress: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  modalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#e1e1e1',
    borderRadius: 2,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  modalContent: {
    flex: 1,
  },
  statusHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  orderIdText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  orderDateText: {
    fontSize: 14,
    color: '#666',
  },
  modalSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  mealDetailsCard: {
    flexDirection: 'row',
  },
  mealDetailsInfo: {
    flex: 1,
    marginLeft: 16,
  },
  mealDetailsName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantDetailsName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  mealDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    marginBottom: 12,
  },
  mealPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 60,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineCircleCompleted: {
    backgroundColor: '#4CAF50',
  },
  timelineCircleCurrent: {
    backgroundColor: '#FF6B35',
  },
  timelineCheckmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e1e1e1',
    marginTop: 8,
    minHeight: 36,
  },
  timelineLineCompleted: {
    backgroundColor: '#4CAF50',
  },
  timelineLabel: {
    fontSize: 16,
    color: '#999',
    paddingTop: 2,
    flex: 1,
  },
  timelineLabelCompleted: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  timelineLabelCurrent: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  deliveryInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  deliveryRow: {
    marginBottom: 12,
  },
  deliveryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  deliveryValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  orderSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});