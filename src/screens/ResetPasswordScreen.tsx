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
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface ResetPasswordScreenProps {
  navigation: any;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setEmailSent(true);
      Alert.alert(
        'Reset Link Sent',
        'We\'ve sent you a password reset link. Please check your email and follow the instructions to reset your password.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          {emailSent
            ? 'Check your email for reset instructions'
            : 'Enter your email address and we\'ll send you a link to reset your password'}
        </Text>

        {!emailSent && (
          <View style={styles.form}>
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

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {emailSent && (
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>📧</Text>
            <Text style={styles.successText}>
              Reset link sent to {email}
            </Text>
            <Text style={styles.successSubtext}>
              Didn't receive the email? Check your spam folder or try again.
            </Text>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setEmailSent(false);
                setEmail('');
              }}
            >
              <Text style={styles.secondaryButtonText}>Try Different Email</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.links}>
          <TouchableOpacity onPress={navigateToLogin} disabled={loading}>
            <Text style={styles.linkText}>
              Remember your password? <Text style={styles.linkTextBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
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
    marginBottom: 48,
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    marginTop: 16,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
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