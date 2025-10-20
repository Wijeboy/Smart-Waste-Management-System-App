/**
 * RouteManagementScreen Integration Test Suite
 * Tests the complete bin collection workflow
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import RouteManagementScreen from '../RouteManagementScreen';
import { RouteProvider } from '../../../context/RouteContext';

// Mock the navigation hook
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock BinDetailsModal to simplify testing the flow
jest.mock('../../../components/BinDetailsModal', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return ({ visible, binId, location, status, weight, fillLevel, onUpdate, onClose }) => {
    if (!visible) return null;
    return (
      <View testID="bin-details-modal">
        <Text testID="modal-bin-id">{binId}</Text>
        <Text testID="modal-location">{location}</Text>
        <Text testID="modal-status">{status}</Text>
        <Text testID="modal-weight">{weight}</Text>
        <Text testID="modal-fill-level">{fillLevel}</Text>
        <TouchableOpacity 
          testID="update-button" 
          onPress={() => onUpdate({ status: 'completed', weight: weight, fillLevel: fillLevel })}
        >
          <Text>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="close-modal-button" onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

// Mock the mockData import with test data
jest.mock('../../../api/mockData', () => ({
  MOCK_STOPS: [
    {
      id: 1,
      binId: 'BIN-023',
      address: '567 Cedar Ave',
      status: 'pending',
      priority: 'high',
      distance: '0.2 km',
      fillLevel: 95,
      weight: 18.5,
      collectionType: 'general',
    },
    {
      id: 2,
      binId: 'BIN-024',
      address: '890 Birch St',
      status: 'pending',
      priority: 'normal',
      distance: '0.5 km',
      fillLevel: 78,
      weight: 14.2,
      collectionType: 'recyclable',
    },
    {
      id: 3,
      binId: 'BIN-025',
      address: '234 Maple Dr',
      status: 'pending',
      priority: 'normal',
      distance: '0.8 km',
      fillLevel: 65,
      weight: 12.8,
      collectionType: 'organic',
    },
    {
      id: 4,
      binId: 'BIN-026',
      address: '456 Oak Avenue, Westside',
      status: 'completed',
      priority: 'high',
      distance: '1.2 km',
      fillLevel: 88,
      weight: 16.3,
      collectionType: 'general',
    },
    {
      id: 5,
      binId: 'BIN-027',
      address: '789 Pine Road, Eastside',
      status: 'completed',
      priority: 'normal',
      distance: '1.5 km',
      fillLevel: 72,
      weight: 13.5,
      collectionType: 'recyclable',
    },
    {
      id: 6,
      binId: 'BIN-028',
      address: '321 Maple Drive, Northside',
      status: 'completed',
      priority: 'normal',
      distance: '1.8 km',
      fillLevel: 55,
      weight: 10.2,
      collectionType: 'organic',
    },
    {
      id: 7,
      binId: 'BIN-029',
      address: '654 Elm Street, Southside',
      status: 'completed',
      priority: 'high',
      distance: '2.1 km',
      fillLevel: 92,
      weight: 17.8,
      collectionType: 'general',
    },
  ],
  MOCK_ROUTE_INFO: {
    routeNumber: 'Route #12',
    district: 'Central District',
    assignedTo: 'Alex',
  },
  MOCK_IMPACT_METRICS: {
    recycled: { value: 1.2, unit: 'tons' },
    co2Saved: { value: 89, unit: 'kg' },
    treesSaved: { value: 3.2, unit: '' },
  },
  MOCK_COLLECTIONS_BY_TYPE: [
    { id: 1, type: 'General', icon: 'trash', count: 28 },
    { id: 2, type: 'Recyclable', icon: 'recycle', count: 15 },
    { id: 3, type: 'Organic', icon: 'leaf', count: 12 },
  ],
}));

describe('RouteManagementScreen Integration Tests', () => {
  /**
   * Integration Test: Simulate successful bin collection and verify status change
   */
  it('updates the first item status to completed after updating in modal', async () => {
    // Arrange - Render the full screen with RouteProvider
    render(
      <RouteProvider>
        <RouteManagementScreen />
      </RouteProvider>
    );

    // Verify initial state - check completed count is 4 (from mock data)
    const completedCard = screen.getByTestId('stat-card-completed');
    expect(completedCard).toHaveTextContent('4');
    expect(completedCard).toHaveTextContent('Completed');

    // Act - Press the first route item to open the modal
    const firstItem = screen.getByTestId('next-stop-card-1');
    fireEvent.press(firstItem);

    // Assert - Modal should appear with bin details
    await waitFor(() => {
      const modal = screen.getByTestId('bin-details-modal');
      expect(modal).toBeTruthy();
      expect(screen.getByTestId('modal-bin-id')).toHaveTextContent('BIN-023');
      expect(screen.getByTestId('modal-status')).toHaveTextContent('pending');
    });

    // Act - Update the bin details (status to completed)
    const updateButton = screen.getByTestId('update-button');
    fireEvent.press(updateButton);

    // Assert - Modal should close
    await waitFor(() => {
      expect(screen.queryByTestId('bin-details-modal')).toBeNull();
    });

    // Assert - Completed count should increase to 5
    await waitFor(() => {
      const updatedCompletedCard = screen.getByTestId('stat-card-completed');
      expect(updatedCompletedCard).toHaveTextContent('5');
    });

    // Assert - Remaining count should decrease to 2
    const remainingCard = screen.getByTestId('stat-card-remaining');
    expect(remainingCard).toHaveTextContent('2');
  });

  /**
   * Integration Test: Verify other items remain unchanged
   */
  it('only updates the selected item status, leaving others unchanged', async () => {
    // Arrange
    render(
      <RouteProvider>
        <RouteManagementScreen />
      </RouteProvider>
    );

    // Act - Complete the first item
    const firstItem = screen.getByTestId('next-stop-card-1');
    fireEvent.press(firstItem);

    await waitFor(() => {
      expect(screen.getByTestId('bin-details-modal')).toBeTruthy();
    });

    const updateButton = screen.getByTestId('update-button');
    fireEvent.press(updateButton);

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByTestId('bin-details-modal')).toBeNull();
    });

    // Assert - Completed count should be 5 (4 initially completed + 1 newly completed)
    await waitFor(() => {
      const completedCard = screen.getByTestId('stat-card-completed');
      expect(completedCard).toHaveTextContent('5');
    });

    // Assert - Remaining count should be 2 (other items still pending)
    const remainingCard = screen.getByTestId('stat-card-remaining');
    expect(remainingCard).toHaveTextContent('2');

    // Assert - Other stop cards should still be visible (not removed from pending list since they're still pending)
    expect(screen.getByTestId('next-stop-card-2')).toBeTruthy();
    expect(screen.getByTestId('next-stop-card-3')).toBeTruthy();
  });
});
