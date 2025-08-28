import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const RequestsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requests</Text>
      <Text style={styles.subtitle}>Manage incoming meal requests from customers</Text>
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