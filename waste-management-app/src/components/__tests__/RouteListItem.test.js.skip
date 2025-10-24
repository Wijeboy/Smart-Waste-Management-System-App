/**
 * RouteListItem Test Suite
 * Tests for the RouteListItem component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import RouteListItem from '../RouteListItem';

// Mock the navigation hook
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock BinDetailsModal
jest.mock('../BinDetailsModal', () => {
  return () => null;
});

describe('RouteListItem', () => {
  /**
   * Mock stop object for testing
   */
  const mockStop = {
    id: 1,
    binId: 'BIN-001',
    address: '123 Main Street, Downtown',
    status: 'pending',
    priority: 'high',
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  /**
   * Test: Component renders and displays bin ID and address
   */
  it('renders the component and displays the bin ID and address', () => {
    // Arrange & Act
    render(<RouteListItem stop={mockStop} onStatusUpdate={() => {}} />);

    // Assert
    const binId = screen.getByText('BIN-001');
    const address = screen.getByText('123 Main Street, Downtown');

    expect(binId).toBeVisible();
    expect(address).toBeVisible();
  });

  /**
   * Test: Component opens modal when pressed (pending status)
   */
  it('opens modal when pressed for pending items', () => {
    // Arrange
    render(<RouteListItem stop={mockStop} onStatusUpdate={() => {}} />);

    // Act
    const listItem = screen.getByTestId('route-item-1');
    fireEvent.press(listItem);

    // Assert - Should not navigate immediately, modal opens instead
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  /**
   * Test: Component navigates to ScanBin screen when pressed if already completed
   */
  it('navigates to ScanBin screen when pressed if status is completed', () => {
    // Arrange
    const completedStop = { ...mockStop, status: 'completed' };
    render(<RouteListItem stop={completedStop} onStatusUpdate={() => {}} />);

    // Act
    const listItem = screen.getByTestId('route-item-1');
    fireEvent.press(listItem);

    // Assert
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('ScanBin', { stop: completedStop });
  });

  /**
   * Test: Component displays completed badge for completed items
   */
  it('displays completed badge when status is completed', () => {
    // Arrange
    const completedStop = { ...mockStop, status: 'completed' };
    
    // Act
    render(<RouteListItem stop={completedStop} onStatusUpdate={() => {}} />);

    // Assert
    const statusBadge = screen.getByTestId('status-1');
    expect(statusBadge).toBeTruthy();
    expect(statusBadge).toHaveTextContent('✓ Completed');
  });
});
