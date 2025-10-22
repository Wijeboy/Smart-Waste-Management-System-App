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
} from 'react-native';
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
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedBins, setSelectedBins] = useState([]);
  const [orderedBins, setOrderedBins] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState(null);

  useEffect(() => {
    fetchCollectors();
  }, []);

  const fetchCollectors = async () => {
    try {
      const response = await apiService.getAllUsers({ role: 'collector' });
      setCollectors(response.data.users);
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
        if (!routeName.trim() || !scheduledDate.trim() || !scheduledTime.trim()) {
          Alert.alert('Error', 'Please fill all required fields');
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
      
      const routeData = {
        routeName,
        scheduledDate,
        scheduledTime,
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
          <View style={styles.stepContent}>
            <Text style={styles.stepHeading}>Route Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Route Name *"
              value={routeName}
              onChangeText={setRouteName}
            />
            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD) *"
              value={scheduledDate}
              onChangeText={setScheduledDate}
            />
            <TextInput
              style={styles.input}
              placeholder="Time (HH:MM) *"
              value={scheduledTime}
              onChangeText={setScheduledTime}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepHeading}>Select Bins ({selectedBins.length})</Text>
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
                    <Text style={styles.binId}>{item.binId}</Text>
                    <Text style={styles.binLocation}>{item.location}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepHeading}>Order Bins</Text>
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
                    <TouchableOpacity onPress={() => moveBinUp(index)} disabled={index === 0}>
                      <Text style={styles.orderButton}>↑</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => moveBinDown(index)} disabled={index === orderedBins.length - 1}>
                      <Text style={styles.orderButton}>↓</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepHeading}>Assign Collector (Optional)</Text>
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
                    <Text style={styles.collectorName}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text style={styles.collectorEmail}>{item.email}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        );
      case 5:
        return (
          <ScrollView style={styles.stepContent}>
            <Text style={styles.stepHeading}>Review & Submit</Text>
            <View style={styles.reviewCard}>
              <Text style={styles.reviewLabel}>Route: {routeName}</Text>
              <Text style={styles.reviewLabel}>Date: {scheduledDate}</Text>
              <Text style={styles.reviewLabel}>Time: {scheduledTime}</Text>
              <Text style={styles.reviewLabel}>Bins: {orderedBins.length}</Text>
              <Text style={styles.reviewLabel}>
                Collector: {selectedCollector ? `${selectedCollector.firstName} ${selectedCollector.lastName}` : 'None'}
              </Text>
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {renderStepIndicator()}
      </ScrollView>

      <View style={styles.content}>{renderCurrentStep()}</View>

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
  stepIndicator: { flexDirection: 'row', padding: 16, backgroundColor: '#FFF' },
  stepItem: { alignItems: 'center', marginRight: 20 },
  stepCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  stepCircleActive: { backgroundColor: COLORS.primaryDarkTeal },
  stepIcon: { fontSize: 18 },
  stepTitle: { fontSize: 10, color: '#6B7280' },
  stepTitleActive: { color: COLORS.primaryDarkTeal, fontWeight: FONTS.weight.bold },
  content: { flex: 1 },
  stepContent: { flex: 1, padding: 16 },
  stepHeading: { fontSize: 20, fontWeight: FONTS.weight.bold, marginBottom: 16 },
  input: { backgroundColor: '#FFF', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  textArea: { height: 80, textAlignVertical: 'top' },
  binItem: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 8, borderWidth: 2, borderColor: 'transparent' },
  binItemSelected: { borderColor: COLORS.primaryDarkTeal, backgroundColor: '#F0FDFA' },
  binId: { fontSize: 16, fontWeight: FONTS.weight.bold },
  binLocation: { fontSize: 14, color: '#6B7280' },
  orderedBinItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 8 },
  orderNumber: { fontSize: 18, fontWeight: FONTS.weight.bold, marginRight: 12, color: COLORS.primaryDarkTeal },
  orderedBinInfo: { flex: 1 },
  orderControls: { flexDirection: 'row', gap: 8 },
  orderButton: { fontSize: 20, padding: 8 },
  collectorItem: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 8, borderWidth: 2, borderColor: 'transparent' },
  collectorItemSelected: { borderColor: COLORS.primaryDarkTeal, backgroundColor: '#F0FDFA' },
  collectorName: { fontSize: 16, fontWeight: FONTS.weight.bold },
  collectorEmail: { fontSize: 14, color: '#6B7280' },
  reviewCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 8 },
  reviewLabel: { fontSize: 14, marginBottom: 8 },
  footer: { padding: 16, backgroundColor: '#FFF' },
  nextButton: { backgroundColor: COLORS.primaryDarkTeal, padding: 16, borderRadius: 8, alignItems: 'center' },
  nextButtonText: { color: '#FFF', fontSize: 16, fontWeight: FONTS.weight.bold },
  submitButton: { backgroundColor: '#10B981', padding: 16, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: FONTS.weight.bold },
});

export default CreateRouteScreen;
