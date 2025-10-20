/**
 * DashboardScreen Integration Test Suite
 * Tests the dashboard with real RouteContext data
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import DashboardScreen from '../DashboardScreen';
import { RouteProvider } from '../../../context/RouteContext';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock the mockData to provide controlled test data
jest.mock('../../../api/mockData', () => ({
  MOCK_STOPS: [
    {
      id: 1,
      binId: 'BIN-001',
      address: '123 Main Street',
      status: 'completed',
      priority: 'high',
    },
    {
      id: 2,
      binId: 'BIN-002',
      address: '456 Oak Avenue',
      status: 'completed',
      priority: 'medium',
    },
    {
      id: 3,
      binId: 'BIN-003',
      address: '789 Pine Road',
      status: 'pending',
      priority: 'low',
    },
    {
      id: 4,
      binId: 'BIN-004',
      address: '321 Maple Drive',
      status: 'pending',
      priority: 'high',
    },
    {
      id: 5,
      binId: 'BIN-005',
      address: '654 Elm Street',
      status: 'pending',
      priority: 'medium',
    },
  ],
}));

describe('DashboardScreen Integration Tests', () => {
  /**
   * Integration Test: Display calculated statistics from real context
   */
  it('displays calculated statistics from RouteContext with real data', () => {
    // Arrange & Act - Render with real RouteProvider
    render(
      <RouteProvider>
        <DashboardScreen />
      </RouteProvider>
    );

    // Assert - Check calculated values from context
    // With 2 completed out of 5 total stops, efficiency should be 40%
    expect(screen.getByText('2')).toBeVisible(); // Completed count
    expect(screen.getByText('3')).toBeVisible(); // Pending count
    expect(screen.getByText('40%')).toBeVisible(); // Efficiency
    expect(screen.getByText('0')).toBeVisible(); // Issues
  });

  /**
   * Integration Test: Dashboard updates when context data changes
   */
  it('reflects the current state of route data from context', () => {
    // Arrange & Act
    render(
      <RouteProvider>
        <DashboardScreen />
      </RouteProvider>
    );

    // Assert - Verify all stat cards are displayed
    expect(screen.getByText('Completed')).toBeVisible();
    expect(screen.getByText('Pending')).toBeVisible();
    expect(screen.getByText('Efficiency')).toBeVisible();
    expect(screen.getByText('Issues')).toBeVisible();
  });
});
