import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { UserType } from '../types/database';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedUserTypes?: UserType[];
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  allowedUserTypes = ['normal', 'restaurant', 'influencer'],
  fallback 
}) => {
  const { user } = useAuth();

  if (!user) {
    return fallback || (
      <View style={styles.container}>
        <Text style={styles.message}>Please sign in to access this feature</Text>
      </View>
    );
  }

  if (!allowedUserTypes.includes(user.user_type)) {
    return fallback || (
      <View style={styles.container}>
        <Text style={styles.message}>You don't have permission to access this feature</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});