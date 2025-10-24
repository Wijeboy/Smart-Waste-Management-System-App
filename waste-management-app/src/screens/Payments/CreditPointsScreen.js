import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Card, Button, ActivityIndicator } from 'react-native-paper';

// Import services
import rewardsService from '../../services/rewardsService';

// Import components (assuming these exist in the project)
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Toast from '../../components/common/Toast';

const CreditPointsScreen = ({ navigation }) => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [credits, setCredits] = useState(null);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Mock user ID (would come from auth context in a real app)
  const residentId = 'user-123';

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Function to load all required data
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch data in parallel for better performance
      const [creditsData, activitiesData] = await Promise.all([
        rewardsService.checkCredits(residentId),
        rewardsService.getRecentActivities(residentId)
      ]);
      
      setCredits(creditsData);
      setActivities(activitiesData);
    } catch (err) {
      setError('Failed to load credit points data. Please try again.');
      console.error('Error loading credit points data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to claim pending points
  const handleClaimPoints = async () => {
    if (!credits || credits.pendingPoints === 0) return;
    
    setClaiming(true);
    
    try {
      const result = await rewardsService.claimCreditPoints(
        residentId, 
        credits.pendingPoints
      );
      
      // Update state with new data
      setCredits({
        ...credits,
        availablePoints: result.availablePoints,
        pendingPoints: result.pendingPoints
      });
      
      // Show success toast
      showToast('Points claimed successfully!', 'success');
    } catch (err) {
      showToast('Failed to claim points. Please try again.', 'error');
      console.error('Error claiming points:', err);
    } finally {
      setClaiming(false);
    }
  };

  // Helper function to show toast
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  // Format date for activity items
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <SkeletonLoader type="credits" />
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{color: "#EF4444", fontSize: 24, fontWeight: 'bold'}}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={loadData} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  // Calculate progress percentage for the progress bar
  const totalPoints = credits.availablePoints + credits.pendingPoints;
  const progressPercentage = totalPoints > 0 
    ? credits.availablePoints / totalPoints 
    : 1;

  return (
    <View style={styles.container}>
      {/* Credit Points Summary */}
      <Card style={styles.card}>
        <Card.Title title="Your Credit Points" />
        <Card.Content>
          <View style={styles.pointsContainer}>
            <View style={styles.pointsSection}>
              <Text style={styles.pointsLabel}>Available</Text>
              <Text style={styles.pointsValue}>{credits.availablePoints}</Text>
              <Text style={styles.pointsWorth}>
                Worth Rs. {(credits.availablePoints * credits.conversionRate).toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.pointsSection}>
              <Text style={styles.pointsLabel}>Pending</Text>
              <Text style={styles.pendingValue}>{credits.pendingPoints}</Text>
              <Text style={styles.pointsWorth}>
                Worth Rs. {(credits.pendingPoints * credits.conversionRate).toFixed(2)}
              </Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>
              {credits.availablePoints} of {totalPoints} points available
            </Text>
            <ProgressBar
              progress={progressPercentage}
              color="#34D399"
              style={styles.progressBar}
            />
          </View>
          
          {/* Claim Button */}
          <Button
            mode="contained"
            onPress={handleClaimPoints}
            disabled={claiming || credits.pendingPoints === 0}
            loading={claiming}
            style={styles.claimButton}
          >
            {claiming ? 'Claiming...' : 'Claim Points'}
          </Button>
        </Card.Content>
      </Card>

      {/* Recent Activities */}
      <Card style={[styles.card, styles.activitiesCard]}>
        <Card.Title title="Recent Activities" />
        <Card.Content>
          {activities.length === 0 ? (
            <Text style={styles.noActivitiesText}>
              No recent activities found.
            </Text>
          ) : (
            <FlatList
              data={activities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    <Text
                  style={{
                    fontSize: 24,
                    color: item.type === 'earned' ? '#34D399' : '#EF4444'
                  }}
                >
                  {item.type === 'earned' ? '↑' : '↓'}
                </Text>
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityDescription}>{item.description}</Text>
                    <Text style={styles.activityDate}>{formatDate(item.timestamp)}</Text>
                  </View>
                  <Text
                    style={[
                      styles.activityPoints,
                      item.type === 'earned' ? styles.pointsEarned : styles.pointsUsed
                    ]}
                  >
                    {item.type === 'earned' ? '+' : '-'}{item.points} pts
                  </Text>
                </View>
              )}
              ItemSeparatorComponent={() => <Divider style={styles.activityDivider} />}
              style={styles.activitiesList}
            />
          )}
        </Card.Content>
      </Card>

      {/* Toast notification */}
      {toastVisible && (
        <Toast
          visible={toastVisible}
          message={toastMessage}
          type={toastType}
          onDismiss={() => setToastVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#005257',
    marginTop: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pointsSection: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#005257',
  },
  pendingValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  pointsWorth: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  claimButton: {
    backgroundColor: '#3B82F6',
    marginTop: 16,
  },
  activitiesCard: {
    flex: 1,
  },
  noActivitiesText: {
    textAlign: 'center',
    color: '#6B7280',
    padding: 16,
  },
  activitiesList: {
    maxHeight: 300,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityIconContainer: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  activityDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  activityPoints: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  pointsEarned: {
    color: '#34D399',
  },
  pointsUsed: {
    color: '#EF4444',
  },
  activityDivider: {
    backgroundColor: '#E5E7EB',
  },
});

export default CreditPointsScreen;