import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { UserType } from '../types/database';

interface SignupScreenProps {
  navigation: any;
}

interface UserTypeOption {
  type: UserType;
  title: string;
  description: string;
  icon: string;
}

const userTypeOptions: UserTypeOption[] = [
  {
    type: 'normal',
    title: 'Food Explorer',
    description: 'Discover and order amazing meals from local restaurants',
    icon: '🍽️',
  },
  {
    type: 'restaurant',
    title: 'Restaurant Owner',
    description: 'Share your delicious meals and accept orders',
    icon: '👨‍🍳',
  },
  {
    type: 'influencer',
    title: 'Food Influencer',
    description: 'Create content and discover trending meals',
    icon: '📱',
  },
];

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<UserType>('normal');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password, name.trim(), selectedUserType);
      Alert.alert(
        'Success',
        'Account created successfully! Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const renderUserTypeOption = (option: UserTypeOption) => (
    <TouchableOpacity
      key={option.type}
      style={[
        styles.userTypeOption,
        selectedUserType === option.type && styles.userTypeOptionSelected,
      ]}
      onPress={() => setSelectedUserType(option.type)}
      disabled={loading}
    >
      <Text style={styles.userTypeIcon}>{option.icon}</Text>
      <View style={styles.userTypeContent}>
        <Text style={styles.userTypeTitle}>{option.title}</Text>
        <Text style={styles.userTypeDescription}>{option.description}</Text>
      </View>
      <View
        style={[
          styles.radio,
          selectedUserType === option.type && styles.radioSelected,
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our community of food lovers</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoComplete="name"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
              editable={!loading}
            />

            <Text style={styles.sectionTitle}>I am a...</Text>
            <View style={styles.userTypeContainer}>
              {userTypeOptions.map(renderUserTypeOption)}
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.links}>
            <TouchableOpacity onPress={navigateToLogin} disabled={loading}>
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  userTypeContainer: {
    marginBottom: 24,
  },
  userTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  userTypeOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f7ff',
  },
  userTypeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  userTypeContent: {
    flex: 1,
  },
  userTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userTypeDescription: {
    fontSize: 14,
    color: '#666',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginLeft: 12,
  },
  radioSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  links: {
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
  },
  linkTextBold: {
    fontWeight: '600',
  },
});