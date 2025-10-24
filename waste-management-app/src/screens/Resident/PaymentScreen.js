/**
 * Payment Screen (Placeholder)
 * Placeholder for future payment feature
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

const PaymentScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>💳</Text>
      </View>
      
      <Text style={styles.title}>Payment Feature</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
      
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          We're working on bringing you a seamless payment experience for waste collection services.
        </Text>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Planned Features:</Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>View your monthly billing statements</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Pay bills online securely</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Track payment history</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Set up automatic payments</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Receive payment reminders</Text>
          </View>
        </View>
        
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>
            Stay tuned for updates! We'll notify you when this feature becomes available.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 100, // Extra padding for tab bar
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.accentGreen,
    marginBottom: 32,
    textAlign: 'center',
  },
  descriptionContainer: {
    width: '100%',
    maxWidth: 400,
  },
  description: {
    fontSize: FONTS.size.body,
    color: COLORS.iconGray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresContainer: {
    backgroundColor: COLORS.lightCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primaryDarkTeal,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 18,
    color: COLORS.accentGreen,
    marginRight: 12,
    fontWeight: FONTS.weight.bold,
  },
  featureText: {
    fontSize: FONTS.size.body,
    color: COLORS.primaryDarkTeal,
    flex: 1,
  },
  noticeContainer: {
    backgroundColor: COLORS.primaryDarkTeal + '10',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primaryDarkTeal,
  },
  noticeText: {
    fontSize: FONTS.size.small,
    color: COLORS.primaryDarkTeal,
    fontWeight: FONTS.weight.semiBold,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PaymentScreen;
