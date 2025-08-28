import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { dbHelpers } from '../services/supabase';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      const { error } = await dbHelpers.updateUserProfile(user.id, { name: name.trim() });
      if (error) throw error;
      
      Alert.alert('Success', 'Profile updated successfully');
      setEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const getUserTypeDisplayName = (userType: string) => {
    switch (userType) {
      case 'normal':
        return 'Food Explorer';
      case 'restaurant':
        return 'Restaurant Owner';
      case 'influencer':
        return 'Food Influencer';
      default:
        return userType;
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'normal':
        return '🍽️';
      case 'restaurant':
        return '👨‍🍳';
      case 'influencer':
        return '📱';
      default:
        return '👤';
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{getUserTypeIcon(user.user_type)}</Text>
        </View>
        <Text style={styles.userType}>{getUserTypeDisplayName(user.user_type)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              editable={!loading}
            />
          ) : (
            <Text style={styles.value}>{user.name}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Account Type</Text>
          <Text style={styles.value}>{getUserTypeDisplayName(user.user_type)}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Member Since</Text>
          <Text style={styles.value}>
            {new Date(user.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        {editing ? (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setEditing(false);
                setName(user.name);
              }}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => setEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.signOutButton]}
          onPress={handleSignOut}
          disabled={loading}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 32,
  },
  userType: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  actions: {
    gap: 12,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#34C759',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});