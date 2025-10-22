/**
 * CreateRouteScreen
 * Multi-step wizard for creating routes
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, FONTS } from '../../constants/theme';
import { useRoute } from '../../context/RouteContext';
import { useBins } from '../../context/BinsContext';
import apiService from '../../services/api';

const STEPS = [
  { id: 1, title: 'Details', icon: '📋' },
  { id: 2, title: 'Bins', icon: '🗑️' },
  { id: 3, title: 'Order', icon: '📍' },
  { id: 4, title: 'Collector', icon: '👤' },
  { id: 5, title: 'Review', icon: '✅' },
];

const CreateRouteScreen = ({ navigation }) => {
  const { createRoute } = useRoute();
  const { bins, loading: binsLoading } = useBins();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [collectors, setCollectors] = useState([]);
  
  // Form data
  const [routeName, setRouteName] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [scheduledTime, setScheduledTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [selectedBins, setSelectedBins] = useState([]);
  const [orderedBins, setOrderedBins] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState(null);
  
  // Date/Time picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    fetchCollectors();
  }, []);

  const fetchCollectors = async () => {
    try {
      const response = await apiService.getAllUsers();
      // Filter to show only collectors
      const collectorUsers = response.data.users.filter(user => user.role === 'collector');
      setCollectors(collectorUsers);
      console.log('Fetched collectors:', collectorUsers.length);
    } catch (error) {
      console.error('Failed to fetch collectors:', error);
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep === 2) {
        setOrderedBins(selectedBins.map((bin, index) => ({
          binId: bin._id,
          order: index + 1,
          ...bin,
        })));
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!routeName.trim()) {
          Alert.alert('Error', 'Please enter a route name');
          return false;
        }
        return true;
      case 2:
        if (selectedBins.length === 0) {
          Alert.alert('Error', 'Please select at least one bin');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Format date and time
      const formattedDate = formatDate(scheduledDate);
      const formattedTime = formatTime(scheduledTime);
      
      const routeData = {
        routeName,
        scheduledDate: formattedDate,
        scheduledTime: formattedTime,
        notes,
        bins: orderedBins.map(bin => ({
          binId: bin._id,
          order: bin.order,
        })),
        assignedTo: selectedCollector?._id || null,
      };

      const result = await createRoute(routeData);
      
      if (result.success) {
        Alert.alert('Success', 'Route created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to create route');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create route');
    } finally {
      setLoading(false);
    }
  };

  const toggleBinSelection = (bin) => {
    const isSelected = selectedBins.some(b => b._id === bin._id);
    if (isSelected) {
      setSelectedBins(selectedBins.filter(b => b._id !== bin._id));
    } else {
      setSelectedBins([...selectedBins, bin]);
    }
  };

  const moveBinUp = (index) => {
    if (index > 0) {
      const newOrder = [...orderedBins];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      newOrder.forEach((bin, idx) => {
        bin.order = idx + 1;
      });
      setOrderedBins(newOrder);
    }
  };

  const moveBinDown = (index) => {
    if (index < orderedBins.length - 1) {
      const newOrder = [...orderedBins];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      newOrder.forEach((bin, idx) => {
        bin.order = idx + 1;
      });
      setOrderedBins(newOrder);
    }
  };

  // Date/Time picker handlers
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setScheduledDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setScheduledTime(selectedTime);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
  };

  const formatTime = (time) => {
    return time.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step) => (
        <View key={step.id} style={styles.stepItem}>
          <View
            style={[
              styles.stepCircle,
              currentStep >= step.id && styles.stepCircleActive,
            ]}
          >
            <Text style={styles.stepIcon}>{step.icon}</Text>
          </View>
          <Text style={[styles.stepTitle, currentStep === step.id && styles.stepTitleActive]}>
            {step.title}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.stepHeading}>Route Details</Text>
            
            <Text style={styles.label}>Route Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter route name"
              value={routeName}
              onChangeText={setRouteName}
            />
            
            <Text style={styles.label}>Scheduled Date *</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateTimeText}>📅 {formatDate(scheduledDate)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={scheduledDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
            
            <Text style={styles.label}>Scheduled Time *</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateTimeText}>🕐 {formatTime(scheduledTime)}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={scheduledTime}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}
            
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add any notes or instructions"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </ScrollView>
        );
      case 2:
        return (
          <View style={styles.stepContentFlex}>
            <Text style={styles.stepHeading}>Select Bins ({selectedBins.length} selected)</Text>
            <FlatList
              data={bins}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                const isSelected = selectedBins.some(b => b._id === item._id);
                return (
                  <TouchableOpacity
                    style={[styles.binItem, isSelected && styles.binItemSelected]}
                    onPress={() => toggleBinSelection(item)}
                  >
                    <View style={styles.checkboxContainer}>
                      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </View>
                    <View style={styles.binInfo}>
                      <Text style={styles.binId}>{item.binId}</Text>
                      <Text style={styles.binLocation}>{item.location} • {item.zone}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContentFlex}>
            <Text style={styles.stepHeading}>Order Bins</Text>
            <Text style={styles.stepSubheading}>Set the collection order by moving bins up or down</Text>
            <FlatList
              data={orderedBins}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => (
                <View style={styles.orderedBinItem}>
                  <Text style={styles.orderNumber}>{item.order}</Text>
                  <View style={styles.orderedBinInfo}>
                    <Text style={styles.binId}>{item.binId}</Text>
                    <Text style={styles.binLocation}>{item.location}</Text>
                  </View>
                  <View style={styles.orderControls}>
                    <TouchableOpacity 
                      onPress={() => moveBinUp(index)} 
                      disabled={index === 0}
                      style={[styles.orderButtonContainer, index === 0 && styles.orderButtonDisabled]}
                    >
                      <Text style={styles.orderButton}>↑</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => moveBinDown(index)} 
                      disabled={index === orderedBins.length - 1}
                      style={[styles.orderButtonContainer, index === orderedBins.length - 1 && styles.orderButtonDisabled]}
                    >
                      <Text style={styles.orderButton}>↓</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContentFlex}>
            <Text style={styles.stepHeading}>Assign Collector</Text>
            <Text style={styles.stepSubheading}>
              {collectors.length > 0 
                ? `Select a collector to assign this route (${collectors.length} available)` 
                : 'No collectors available'}
            </Text>
            {collectors.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>👤</Text>
                <Text style={styles.emptyStateText}>No collectors found</Text>
                <Text style={styles.emptyStateSubtext}>Please create collector accounts first</Text>
              </View>
            ) : (
              <FlatList
                data={collectors}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                  const isSelected = selectedCollector?._id === item._id;
                  return (
                    <TouchableOpacity
                      style={[styles.collectorItem, isSelected && styles.collectorItemSelected]}
                      onPress={() => setSelectedCollector(item)}
                    >
                      <View style={styles.collectorAvatar}>
                        <Text style={styles.collectorAvatarText}>
                          {item.firstName?.[0]}{item.lastName?.[0]}
                        </Text>
                      </View>
                      <View style={styles.collectorInfo}>
                        <Text style={styles.collectorName}>
                          {item.firstName} {item.lastName}
                        </Text>
                        <Text style={styles.collectorEmail}>{item.email}</Text>
                        <Text style={styles.collectorPhone}>{item.phoneNo}</Text>
                      </View>
                      {isSelected && (
                        <View style={styles.selectedBadge}>
                          <Text style={styles.selectedBadgeText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        );
      case 5:
        return (
          <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.stepHeading}>Review & Submit</Text>
            <Text style={styles.stepSubheading}>Please review the route details before creating</Text>
            
            <View style={styles.reviewSection}>
              <Text style={styles.reviewSectionTitle}>Route Information</Text>
              <View style={styles.reviewCard}>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Route Name:</Text>
                  <Text style={styles.reviewValue}>{routeName}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Date:</Text>
                  <Text style={styles.reviewValue}>{formatDate(scheduledDate)}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Time:</Text>
                  <Text style={styles.reviewValue}>{formatTime(scheduledTime)}</Text>
                </View>
                {notes.trim() && (
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Notes:</Text>
                    <Text style={styles.reviewValue}>{notes}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.reviewSection}>
              <Text style={styles.reviewSectionTitle}>Bins ({orderedBins.length})</Text>
              {orderedBins.map((bin, index) => (
                <View key={bin._id} style={styles.reviewBinItem}>
                  <Text style={styles.reviewBinOrder}>{index + 1}</Text>
                  <View>
                    <Text style={styles.reviewBinId}>{bin.binId}</Text>
                    <Text style={styles.reviewBinLocation}>{bin.location}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.reviewSection}>
              <Text style={styles.reviewSectionTitle}>Assigned Collector</Text>
              <View style={styles.reviewCard}>
                {selectedCollector ? (
                  <>
                    <Text style={styles.reviewCollectorName}>
                      {selectedCollector.firstName} {selectedCollector.lastName}
                    </Text>
                    <Text style={styles.reviewCollectorEmail}>{selectedCollector.email}</Text>
                    <Text style={styles.reviewCollectorPhone}>{selectedCollector.phoneNo}</Text>
                  </>
                ) : (
                  <Text style={styles.reviewNoCollector}>No collector assigned</Text>
                )}
              </View>
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Route</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stepIndicatorScroll}>
        {renderStepIndicator()}
      </ScrollView>

      {renderCurrentStep()}

      <View style={styles.footer}>
        {currentStep < 5 ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>Create</Text>}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.appBackground },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: COLORS.primaryDarkTeal },
  backIcon: { fontSize: 24, color: '#FFF', marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: FONTS.weight.bold, color: '#FFF' },
  stepIndicatorScroll: { maxHeight: 90, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  stepIndicator: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12 },
  stepItem: { alignItems: 'center', marginRight: 24 },
  stepCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  stepCircleActive: { backgroundColor: COLORS.primaryDarkTeal },
  stepIcon: { fontSize: 20 },
  stepTitle: { fontSize: 11, color: '#6B7280', fontWeight: FONTS.weight.medium },
  stepTitleActive: { color: COLORS.primaryDarkTeal, fontWeight: FONTS.weight.bold },
  stepContent: { padding: 16 },
  stepContentFlex: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  stepHeading: { fontSize: 22, fontWeight: FONTS.weight.bold, marginBottom: 8, color: '#1F2937' },
  stepSubheading: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: FONTS.weight.semiBold, color: '#374151', marginBottom: 8, marginTop: 8 },
  input: { backgroundColor: '#FFF', borderRadius: 8, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB', fontSize: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  dateTimeButton: { backgroundColor: '#FFF', borderRadius: 8, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  dateTimeText: { fontSize: 15, color: '#1F2937', fontWeight: FONTS.weight.medium },
  binItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 2, borderColor: '#E5E7EB' },
  binItemSelected: { borderColor: COLORS.primaryDarkTeal, backgroundColor: '#F0FDFA' },
  checkboxContainer: { marginRight: 12 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: COLORS.primaryDarkTeal, borderColor: COLORS.primaryDarkTeal },
  checkmark: { color: '#FFF', fontSize: 16, fontWeight: FONTS.weight.bold },
  binInfo: { flex: 1 },
  binId: { fontSize: 16, fontWeight: FONTS.weight.bold, color: '#1F2937' },
  binLocation: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  orderedBinItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  orderNumber: { fontSize: 20, fontWeight: FONTS.weight.bold, marginRight: 14, color: COLORS.primaryDarkTeal, width: 30, textAlign: 'center' },
  orderedBinInfo: { flex: 1 },
  orderControls: { flexDirection: 'row', gap: 8 },
  orderButtonContainer: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 6 },
  orderButtonDisabled: { opacity: 0.3 },
  orderButton: { fontSize: 20, color: COLORS.primaryDarkTeal },
  collectorItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 2, borderColor: '#E5E7EB' },
  collectorItemSelected: { borderColor: COLORS.primaryDarkTeal, backgroundColor: '#F0FDFA' },
  collectorAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primaryDarkTeal, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  collectorAvatarText: { color: '#FFF', fontSize: 18, fontWeight: FONTS.weight.bold },
  collectorInfo: { flex: 1 },
  collectorName: { fontSize: 16, fontWeight: FONTS.weight.bold, color: '#1F2937' },
  collectorEmail: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  collectorPhone: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  selectedBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  selectedBadgeText: { color: '#FFF', fontSize: 16, fontWeight: FONTS.weight.bold },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyStateIcon: { fontSize: 64, marginBottom: 16 },
  emptyStateText: { fontSize: 18, fontWeight: FONTS.weight.bold, color: '#1F2937' },
  emptyStateSubtext: { fontSize: 14, color: '#6B7280', marginTop: 8 },
  reviewSection: { marginBottom: 20 },
  reviewSectionTitle: { fontSize: 16, fontWeight: FONTS.weight.bold, color: '#1F2937', marginBottom: 10 },
  reviewCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  reviewRow: { marginBottom: 12 },
  reviewLabel: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  reviewValue: { fontSize: 15, fontWeight: FONTS.weight.semiBold, color: '#1F2937' },
  reviewBinItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  reviewBinOrder: { fontSize: 18, fontWeight: FONTS.weight.bold, color: COLORS.primaryDarkTeal, marginRight: 12, width: 30 },
  reviewBinId: { fontSize: 15, fontWeight: FONTS.weight.semiBold, color: '#1F2937' },
  reviewBinLocation: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  reviewCollectorName: { fontSize: 16, fontWeight: FONTS.weight.bold, color: '#1F2937', marginBottom: 6 },
  reviewCollectorEmail: { fontSize: 13, color: '#6B7280', marginBottom: 2 },
  reviewCollectorPhone: { fontSize: 13, color: '#6B7280' },
  reviewNoCollector: { fontSize: 14, color: '#9CA3AF', fontStyle: 'italic' },
  footer: { padding: 16, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  nextButton: { backgroundColor: COLORS.primaryDarkTeal, padding: 16, borderRadius: 8, alignItems: 'center' },
  nextButtonText: { color: '#FFF', fontSize: 16, fontWeight: FONTS.weight.bold },
  submitButton: { backgroundColor: '#10B981', padding: 16, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: FONTS.weight.bold },
});

export default CreateRouteScreen;
