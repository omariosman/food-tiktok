import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MyRequestsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Requests</Text>
      <Text style={styles.subtitle}>View your meal requests and order history</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});