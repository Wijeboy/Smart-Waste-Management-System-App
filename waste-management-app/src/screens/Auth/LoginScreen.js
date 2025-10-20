/**
 * Login Screen
 * Allows users to login with username/email and password
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS } from '../../constants/theme';

const LoginScreen = ({ navigation }) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username or email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    const result = await login(formData.username, formData.password);

    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username or Email</Text>
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              placeholder="Enter your username or email"
              value={formData.username}
              onChangeText={(value) => handleChange('username', value)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textPrimary} />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Sign Up</Text>
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
    backgroundColor: COLORS.lightBackground,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: FONTS.size.heading + 8,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONTS.size.body,
    color: COLORS.iconGray,
  },
  form: {
    backgroundColor: COLORS.lightCard,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: FONTS.size.small,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.lightBackground,
    borderRadius: 8,
    padding: 14,
    fontSize: FONTS.size.body,
    borderWidth: 1,
    borderColor: COLORS.progressBarBg,
  },
  inputError: {
    borderColor: COLORS.alertRed,
  },
  errorText: {
    color: COLORS.alertRed,
    fontSize: FONTS.size.caption,
    marginTop: 4,
  },
  button: {
    backgroundColor: COLORS.primaryDarkTeal,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: FONTS.size.small,
    color: COLORS.iconGray,
  },
  linkText: {
    fontSize: FONTS.size.small,
    color: COLORS.primaryDarkTeal,
    fontWeight: FONTS.weight.bold,
  },
});

export default LoginScreen;
