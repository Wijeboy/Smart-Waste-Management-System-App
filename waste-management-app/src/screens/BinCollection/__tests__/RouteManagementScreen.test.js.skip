/**
 * RouteManagementScreen Test Suite
 * Tests for the Route Management Screen component
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import RouteManagementScreen from '../RouteManagementScreen';

/**
 * Mock stop data for testing
 */
const mockStops = [
  {
    id: 1,
    binId: 'BIN-001',
    address: '123 Main Street, Downtown',
    status: 'pending',
    priority: 'high',
  },
  {
    id: 2,
    binId: 'BIN-002',
    address: '456 Oak Avenue, Westside',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 3,
    binId: 'BIN-003',
    address: '789 Pine Road, Eastside',
    status: 'pending',
    priority: 'low',
  },
];

// Mock the navigation hook
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock the RouteContext
jest.mock('../../../context/RouteContext', () => ({
  useRoute: () => ({
    stops: mockStops,
    updateStopStatus: jest.fn(),
    routeInfo: {
      routeNumber: 'Route#12',
      district: 'Central District',
      assignedTo: 'Alex',
    },
  }),
}));

// Mock the RouteListItem component
jest.mock('../../../components/RouteListItem', () => {
  const { Text } = require('react-native');
  return ({ stop }) => <Text testID={`route-item-${stop.id}`}>{stop.binId}</Text>;
});

describe('RouteManagementScreen', () => {
  /**
   * Test: Screen renders with the title 'Route Management'
   */
  it('renders the screen and displays the title "Route Management"', () => {
    // Arrange & Act
    render(<RouteManagementScreen />);

    // Assert
    const title = screen.getByText('Route Management');
    expect(title).toBeVisible();
  });

  /**
   * Test: FlatList is rendered with the correct number of RouteListItem components
   */
  it('renders a FlatList containing the correct number of RouteListItem components', () => {
    // Arrange & Act
    render(<RouteManagementScreen />);

    // Assert - FlatList should be rendered
    const flatList = screen.getByTestId('route-flatlist');
    expect(flatList).toBeTruthy();

    // Assert - All RouteListItem components should be rendered
    const routeItem1 = screen.getByTestId('route-item-1');
    const routeItem2 = screen.getByTestId('route-item-2');
    const routeItem3 = screen.getByTestId('route-item-3');

    expect(routeItem1).toBeTruthy();
    expect(routeItem2).toBeTruthy();
    expect(routeItem3).toBeTruthy();

    // Assert - Verify the correct number of items (3 stops)
    const allRouteItems = screen.getAllByTestId(/route-item-/);
    expect(allRouteItems).toHaveLength(3);
  });
});

