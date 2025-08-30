import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { MainTabNavigator } from './MainTabNavigator';
import { CheckoutScreen, RestaurantDetailScreen } from '../screens';
import { Meal } from '../types';

export type MainStackParamList = {
  MainTabs: undefined;
  Checkout: { meal: Meal };
  RestaurantDetail: { restaurantId: string };
};

const Stack = createStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="RestaurantDetail" 
        component={RestaurantDetailScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};