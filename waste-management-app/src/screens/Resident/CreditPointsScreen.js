/**
 * Credit Points Screen
 * Display resident's credit points and recent collection history
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';

/**
 * CreditPointsScreen Component
 * Shows total points, recent actions, and claim points functionality
 */
const CreditPointsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [creditPoints, setCreditPoints] = useState(0);
  const [recentCollections, setRecentCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pointsClaimed, setPointsClaimed] = useState(false); // Track if points were claimed

  // Fetch credit points and recent collections
  const fetchData = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);

      // Fetch credit points
      const pointsResponse = await apiService.getUserCreditPoints(user.id);
      if (pointsResponse.success) {
        setCreditPoints(pointsResponse.data.creditPoints);
      }

      // Fetch recent collections
      const collectionsResponse = await apiService.getRecentCollections(user.id);
      if (collectionsResponse.success) {
        setRecentCollections(collectionsResponse.data.collections);
      }
    } catch (error) {
      console.error('Error fetching credit points data:', error);
      Alert.alert('Error', 'Failed to load credit points. Please try again.');
    } finally {
      setLoading(false);
      if (isRefreshing) setRefreshing(false);
    }
  };

  // Load data when screen focuses
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  // Handle claim points button
  const handleClaimPoints = () => {
    if (pointsClaimed) {
      return; // Already claimed, do nothing
    }
    
    setPointsClaimed(true); // Disable the button
    
    Alert.alert(
      'Credit Points',
      `You have ${creditPoints} points available!\n\nUse them in the Payment screen to get discounts on your waste collection services.`,
      [
        {
          text: 'Go to Payment',
          onPress: () => {
            // Navigate back to ResidentDashboard and switch to Payment tab
            navigation.navigate('ResidentDashboard', { 
              screen: 'Payment'
            });
          },
        },
        {
          text: 'OK',
          style: 'cancel',
          onPress: () => setPointsClaimed(false), // Reset if they cancel
        },
      ],
      { cancelable: false }
    );
  };

  // Get emoji for bin type
  const getBinTypeEmoji = (binType) => {
    switch (binType) {
      case 'Recyclable':
        return '♻️';
      case 'Organic':
        return '🌿';
      case 'General Waste':
        return '🗑️';
      case 'Hazardous':
        return '☢️';
      default:
        return '📦';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryDarkTeal} />
        <Text style={styles.loadingText}>Loading your credit points...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Credit Points</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Circular Progress - Total Points */}
      <View style={styles.pointsCard}>
        <Text style={styles.totalPointsLabel}>Total Points</Text>
        <View style={styles.circularProgress}>
          <View style={[styles.circle, creditPoints >= 100 && styles.circleActive]}>
            <Text style={styles.pointsNumber}>{creditPoints}</Text>
          </View>
        </View>
        <Text style={styles.pointsSubtext}>
          {creditPoints >= 50 
            ? '✅ Ready to redeem!' 
            : `Collect ${50 - creditPoints} more points to redeem`}
        </Text>
      </View>

      {/* Recent Actions */}
      <View style={styles.recentActionsContainer}>
        <Text style={styles.sectionTitle}>Recent Actions</Text>
        
        {recentCollections.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No collections yet</Text>
            <Text style={styles.emptySubtext}>
              Points will appear here when your bins are collected
            </Text>
          </View>
        ) : (
          recentCollections.map((collection, index) => (
            <View key={index} style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionEmoji}>
                  {getBinTypeEmoji(collection.binType)}
                </Text>
              </View>
              <View style={styles.actionDetails}>
                <Text style={styles.actionTitle}>{collection.binType}</Text>
                <Text style={styles.actionDate}>
                  {formatDate(collection.collectedAt)}
                </Text>
                <Text style={styles.actionTime}>
                  {formatTime(collection.collectedAt)}
                </Text>
                {collection.weight > 0 && (
                  <Text style={styles.actionWeight}>
                    {collection.weight.toFixed(1)} kg
                  </Text>
                )}
              </View>
              <View style={styles.actionPoints}>
                <Text style={styles.pointsEarned}>
                  +{collection.pointsEarned}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Claim Points Button */}
      <TouchableOpacity
        style={[
          styles.claimButton,
          (creditPoints < 50 || pointsClaimed) && styles.claimButtonDisabled
        ]}
        onPress={handleClaimPoints}
        disabled={creditPoints < 50 || pointsClaimed}
      >
        <Text style={styles.claimButtonText}>
          {pointsClaimed ? '✓ Points Claimed' : 'Claim My Points'}
        </Text>
      </TouchableOpacity>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 How it works</Text>
        <Text style={styles.infoText}>
          • Earn 10 points per kg of waste collected
        </Text>
        <Text style={styles.infoText}>
          • Earn 15 points per kg for recyclable waste
        </Text>
        <Text style={styles.infoText}>
          • Redeem 100 points for $5 discount
        </Text>
        <Text style={styles.infoText}>
          • Minimum 50 points required to redeem
        </Text>
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
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightBackground,
  },
  loadingText: {
    marginTop: 16,
    fontSize: FONTS.size.body,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.accentGreen,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  pointsCard: {
    backgroundColor: COLORS.lightCard,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  totalPointsLabel: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
    marginBottom: 16,
  },
  circularProgress: {
    marginBottom: 16,
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 12,
    borderColor: COLORS.iconGray + '30',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightBackground,
  },
  circleActive: {
    borderColor: COLORS.accentGreen,
  },
  pointsNumber: {
    fontSize: 48,
    fontWeight: FONTS.weight.bold,
    color: '#059669',
  },
  pointsSubtext: {
    fontSize: FONTS.size.body,
    color: '#1F2937',
    textAlign: 'center',
  },
  recentActionsContainer: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: '#111827',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.semiBold,
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: FONTS.size.body,
    color: COLORS.iconGray,
    textAlign: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightCard,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.primaryDarkTeal + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionEmoji: {
    fontSize: 28,
  },
  actionDetails: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.semiBold,
    color: '#111827',
    marginBottom: 4,
  },
  actionDate: {
    fontSize: FONTS.size.small,
    color: '#1F2937',
  },
  actionTime: {
    fontSize: FONTS.size.small,
    color: COLORS.iconGray,
  },
  actionWeight: {
    fontSize: FONTS.size.small,
    color: '#059669',
    fontWeight: FONTS.weight.semiBold,
    marginTop: 2,
  },
  actionPoints: {
    alignItems: 'flex-end',
  },
  pointsEarned: {
    fontSize: FONTS.size.heading,
    fontWeight: FONTS.weight.bold,
    color: '#059669',
  },
  claimButton: {
    backgroundColor: COLORS.primaryDarkTeal,
    marginHorizontal: 16,
    marginTop: 32,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  claimButtonDisabled: {
    backgroundColor: COLORS.iconGray,
    opacity: 0.5,
  },
  claimButtonText: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textPrimary,
  },
  infoCard: {
    backgroundColor: COLORS.primaryDarkTeal + '10',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primaryDarkTeal,
  },
  infoTitle: {
    fontSize: FONTS.size.subheading,
    fontWeight: FONTS.weight.bold,
    color: '#111827',
    marginBottom: 12,
  },
  infoText: {
    fontSize: FONTS.size.body,
    color: '#111827',
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default CreditPointsScreen;
