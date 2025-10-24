/**
 * ProfileScreen Test Suite
 * Tests the Profile screen functionality including user profile and settings
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../ProfileScreen';
import { UserProvider } from '../../../context/UserContext';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderProfileScreen = () => {
    return render(
      <UserProvider>
        <ProfileScreen navigation={mockNavigation} />
      </UserProvider>
    );
  };

  it('renders the Profile screen with user information', () => {
    renderProfileScreen();

    expect(screen.getByText('Alex Johnson')).toBeTruthy();
    expect(screen.getByText('Collection Supervisor')).toBeTruthy();
    expect(screen.getByText(/EMP-001/)).toBeTruthy();
    expect(screen.getByText(/Since 2020/)).toBeTruthy();
  });

  it('displays Edit Profile button', () => {
    renderProfileScreen();

    expect(screen.getByText('Edit Profile')).toBeTruthy();
  });

  it('opens Edit Profile modal when button is pressed', async () => {
    renderProfileScreen();

    const editButton = screen.getByText('Edit Profile');
    fireEvent.press(editButton);

    await waitFor(() => {
      expect(screen.getByText('Update your profile information')).toBeTruthy();
    });
  });

  it('displays App Settings section', () => {
    renderProfileScreen();

    expect(screen.getByText('App Settings')).toBeTruthy();
    expect(screen.getByText('Audio Confirmation')).toBeTruthy();
    expect(screen.getByText('Vibration Feedback')).toBeTruthy();
    expect(screen.getByText('Auto-Sync')).toBeTruthy();
  });

  it('displays Device Status section', () => {
    renderProfileScreen();

    expect(screen.getByText('Device Status')).toBeTruthy();
    expect(screen.getByText('Battery')).toBeTruthy();
    expect(screen.getByText('87%')).toBeTruthy();
    expect(screen.getByText('Network')).toBeTruthy();
    expect(screen.getByText('Strong')).toBeTruthy();
  });

  it('navigates to Dashboard when Home tab is pressed', () => {
    renderProfileScreen();

    const homeTab = screen.getByTestId('tab-home');
    fireEvent.press(homeTab);

    expect(mockNavigate).toHaveBeenCalledWith('Dashboard');
  });

  it('navigates to Reports when Reports tab is pressed', () => {
    renderProfileScreen();

    const reportsTab = screen.getByTestId('tab-reports');
    fireEvent.press(reportsTab);

    expect(mockNavigate).toHaveBeenCalledWith('Reports');
  });

  it('displays bottom navigation with active Profile tab', () => {
    renderProfileScreen();

    const profileTab = screen.getByTestId('tab-profile');
    expect(profileTab).toBeTruthy();
  });
});
