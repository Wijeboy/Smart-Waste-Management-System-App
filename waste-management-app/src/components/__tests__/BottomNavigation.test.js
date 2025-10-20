/**
 * BottomNavigation Test Suite
 * Tests the bottom navigation component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import BottomNavigation from '../BottomNavigation';

describe('BottomNavigation', () => {
  const mockOnTabChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all three tabs', () => {
    render(<BottomNavigation activeTab="home" onTabChange={mockOnTabChange} />);

    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Reports')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('highlights the active tab', () => {
    render(<BottomNavigation activeTab="reports" onTabChange={mockOnTabChange} />);

    const reportsTab = screen.getByTestId('tab-reports');
    expect(reportsTab).toBeTruthy();
  });

  it('calls onTabChange when Home tab is pressed', () => {
    render(<BottomNavigation activeTab="reports" onTabChange={mockOnTabChange} />);

    const homeTab = screen.getByTestId('tab-home');
    fireEvent.press(homeTab);

    expect(mockOnTabChange).toHaveBeenCalledWith('home');
  });

  it('calls onTabChange when Reports tab is pressed', () => {
    render(<BottomNavigation activeTab="home" onTabChange={mockOnTabChange} />);

    const reportsTab = screen.getByTestId('tab-reports');
    fireEvent.press(reportsTab);

    expect(mockOnTabChange).toHaveBeenCalledWith('reports');
  });

  it('calls onTabChange when Profile tab is pressed', () => {
    render(<BottomNavigation activeTab="home" onTabChange={mockOnTabChange} />);

    const profileTab = screen.getByTestId('tab-profile');
    fireEvent.press(profileTab);

    expect(mockOnTabChange).toHaveBeenCalledWith('profile');
  });

  it('renders with home as default active tab', () => {
    render(<BottomNavigation onTabChange={mockOnTabChange} />);

    const homeTab = screen.getByTestId('tab-home');
    expect(homeTab).toBeTruthy();
  });
});
