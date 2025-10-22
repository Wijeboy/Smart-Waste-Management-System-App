/**
 * Registration Screen
 * Allows new users to register with required information
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS } from '../../constants/theme';

const RegisterScreen = ({ navigation }) => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nic: '',
    dateOfBirth: '',
    phoneNo: '',
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split('T')[0];
      handleChange('dateOfBirth', formattedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Select Date of Birth';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const validate = () => {
    const newErrors = {};

    // First Name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last Name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Username
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // NIC
    const nicRegex = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
    if (!formData.nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (!nicRegex.test(formData.nic)) {
      newErrors.nic = 'Please enter a valid NIC (9 digits + V/X or 12 digits)';
    }

    // Date of Birth (simple format check YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!dateRegex.test(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Please enter date in YYYY-MM-DD format';
    }

    // Phone Number
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNo)) {
      newErrors.phoneNo = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registrationData } = formData;

    const result = await register(registrationData);

    if (!result.success) {
      Alert.alert('Registration Failed', result.error);
    } else {
      // Navigate to login screen after successful registration
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully. Please login to continue.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              placeholder="Enter your first name"
              value={formData.firstName}
              onChangeText={(value) => handleChange('firstName', value)}
              autoCapitalize="words"
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              placeholder="Enter your last name"
              value={formData.lastName}
              onChangeText={(value) => handleChange('lastName', value)}
              autoCapitalize="words"
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>

          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              placeholder="Choose a username"
              value={formData.username}
              onChangeText={(value) => handleChange('username', value)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* NIC */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>NIC</Text>
            <TextInput
              style={[styles.input, errors.nic && styles.inputError]}
              placeholder="Enter your NIC (e.g., 123456789V)"
              value={formData.nic}
              onChangeText={(value) => handleChange('nic', value)}
              autoCapitalize="characters"
            />
            {errors.nic && (
              <Text style={styles.errorText}>{errors.nic}</Text>
            )}
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={[styles.datePickerButton, errors.dateOfBirth && styles.inputError]}
              onPress={showDatePickerModal}
            >
              <Text style={[
                styles.datePickerText,
                !formData.dateOfBirth && styles.datePickerPlaceholder
              ]}>
                {formatDisplayDate(formData.dateOfBirth)}
              </Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>
            {errors.dateOfBirth && (
              <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
            )}
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, errors.phoneNo && styles.inputError]}
              placeholder="Enter your phone number (10 digits)"
              value={formData.phoneNo}
              onChangeText={(value) => handleChange('phoneNo', value)}
              keyboardType="phone-pad"
            />
            {errors.phoneNo && (
              <Text style={styles.errorText}>{errors.phoneNo}</Text>
            )}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textPrimary} />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
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
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: FONTS.size.small,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.lightBackground,
    borderRadius: 8,
    padding: 12,
    fontSize: FONTS.size.small,
    borderWidth: 1,
    borderColor: COLORS.progressBarBg,
  },
  inputError: {
    borderColor: COLORS.alertRed,
  },
  datePickerButton: {
    backgroundColor: COLORS.lightBackground,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.progressBarBg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: FONTS.size.small,
    color: '#1F2937',
  },
  datePickerPlaceholder: {
    color: '#9CA3AF',
  },
  calendarIcon: {
    fontSize: 20,
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

export default RegisterScreen;
