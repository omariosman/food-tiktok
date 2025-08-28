import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import {
  ExploreScreen,
  MyRequestsScreen,
  UploadMealScreen,
  RequestsScreen,
  ProfileScreen,
} from '../screens';

export type MainTabParamList = {
  Explore: undefined;
  MyRequests: undefined;
  UploadMeal: undefined;
  Requests: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabBarIcon: React.FC<{ icon: string; focused: boolean }> = ({ icon, focused }) => (
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.6 }}>{icon}</Text>
);

export const MainTabNavigator: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getTabsForUserType = () => {
    const commonTabs = [
      {
        name: 'Explore' as keyof MainTabParamList,
        component: ExploreScreen,
        icon: '🔍',
        title: 'Explore',
      },
      {
        name: 'Profile' as keyof MainTabParamList,
        component: ProfileScreen,
        icon: '👤',
        title: 'Profile',
      },
    ];

    switch (user.user_type) {
      case 'normal':
        return [
          commonTabs[0], // Explore
          {
            name: 'MyRequests' as keyof MainTabParamList,
            component: MyRequestsScreen,
            icon: '📝',
            title: 'My Requests',
          },
          commonTabs[1], // Profile
        ];

      case 'restaurant':
        return [
          commonTabs[0], // Explore
          {
            name: 'UploadMeal' as keyof MainTabParamList,
            component: UploadMealScreen,
            icon: '📸',
            title: 'Upload Meal',
          },
          {
            name: 'Requests' as keyof MainTabParamList,
            component: RequestsScreen,
            icon: '📋',
            title: 'Requests',
          },
          commonTabs[1], // Profile
        ];

      case 'influencer':
        return [
          commonTabs[0], // Explore
          {
            name: 'MyRequests' as keyof MainTabParamList,
            component: MyRequestsScreen,
            icon: '📝',
            title: 'My Requests',
          },
          commonTabs[1], // Profile
        ];

      default:
        return commonTabs;
    }
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