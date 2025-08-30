import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import {
  FeedScreen,
  SavedScreen,
  DiscoverScreen,
  ActivityScreen,
  ProfileScreen,
  MyRequestsScreen,
  UploadMealScreen,
  RequestsScreen,
} from '../screens';

export type MainTabParamList = {
  Feed: undefined;
  Saved: undefined;
  Discover: undefined;
  Activity: undefined;
  Profile: undefined;
  MyRequests: undefined;
  UploadMeal: undefined;
  Requests: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabBarIcon: React.FC<{ icon: string; focused: boolean }> = ({ icon, focused }) => (
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.6 }}>{icon}</Text>
);

export const MainTabNavigator: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getTabsForUserType = () => {
    // Base navigation tabs that everyone sees (matches design)
    const baseTabs = [
      {
        name: 'Feed' as keyof MainTabParamList,
        component: FeedScreen,
        icon: '📺',
        title: 'Feed',
      },
      {
        name: 'Saved' as keyof MainTabParamList,
        component: SavedScreen,
        icon: '🔖',
        title: 'Saved',
      },
      {
        name: 'Discover' as keyof MainTabParamList,
        component: DiscoverScreen,
        icon: '🔍',
        title: 'Discover',
      },
      {
        name: 'Activity' as keyof MainTabParamList,
        component: ActivityScreen,
        icon: '🔔',
        title: 'Activity',
      },
      {
        name: 'Profile' as keyof MainTabParamList,
        component: ProfileScreen,
        icon: '👤',
        title: 'Profile',
      },
    ];

    // Return base tabs for all user types (can add role-specific tabs later if needed)
    return baseTabs;
  };

  const tabs = getTabsForUserType();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: 8,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.title,
            tabBarIcon: ({ focused }) => <TabBarIcon icon={tab.icon} focused={focused} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};