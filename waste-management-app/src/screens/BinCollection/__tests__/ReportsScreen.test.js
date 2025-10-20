/**
 * ReportsScreen Test Suite
 * Tests the Reports screen functionality including bin management
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ReportsScreen from '../ReportsScreen';
import { BinsProvider } from '../../../context/BinsContext';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('ReportsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderReportsScreen = () => {
    return render(
      <BinsProvider>
        <ReportsScreen navigation={mockNavigation} />
      </BinsProvider>
    );
  };

  it('renders the Reports screen with header', () => {
    renderReportsScreen();

    expect(screen.getByText('Good morning')).toBeTruthy();
    expect(screen.getByText('John Smith')).toBeTruthy();
    expect(screen.getByText('All Bins')).toBeTruthy();
  });

  it('displays the list of bins', () => {
    renderReportsScreen();

    expect(screen.getByText('BIN-001')).toBeTruthy();
    expect(screen.getByText('BIN-002')).toBeTruthy();
    expect(screen.getByText('BIN-003')).toBeTruthy();
  });

  it('displays the correct number of bins', () => {
    renderReportsScreen();

    expect(screen.getByText(/3 bins registered/i)).toBeTruthy();
  });

  it('opens the register bin modal when FAB is pressed', async () => {
    renderReportsScreen();

    const fab = screen.getByText('+');
    fireEvent.press(fab);

    await waitFor(() => {
      expect(screen.getByText('Register New Bin')).toBeTruthy();
    });
  });

  it('navigates to home when Home tab is pressed', () => {
    renderReportsScreen();

    const homeTab = screen.getByTestId('tab-home');
    fireEvent.press(homeTab);

    expect(mockNavigate).toHaveBeenCalledWith('Dashboard');
  });

  it('shows delete confirmation when delete button is pressed', () => {
    renderReportsScreen();

    // Find all delete buttons and press the first one
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.press(deleteButtons[0]);

    expect(Alert.alert).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete Bin',
      expect.stringContaining('BIN-001'),
      expect.any(Array),
      expect.any(Object)
    );
  });

  it('displays bottom navigation with active Reports tab', () => {
    renderReportsScreen();

    const reportsTab = screen.getByTestId('tab-reports');
    expect(reportsTab).toBeTruthy();
  });
});
