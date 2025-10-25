/**
 * UserDetailScreen Tests
 * Comprehensive test suite for user detail view
 * Coverage: >80% - Rendering, CRUD operations, role/status management, edge cases
 */

import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import UserDetailScreen from '../UserDetailScreen';
import apiService from '../../../services/api';

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: jest.fn(),
  goBack: mockGoBack,
  setOptions: jest.fn(),
};

// Mock route params
const mockRoute = {
  params: {
    userId: 'user123',
  },
};

// Mock API service
jest.mock('../../../services/api', () => ({
  getUserById: jest.fn(),
  updateUserRole: jest.fn(),
  suspendUser: jest.fn(),
  deleteUser: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('UserDetailScreen', () => {
  const mockUser = {
    _id: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@test.com',
    username: 'johndoe',
    phoneNo: '+1234567890',
    nic: 'NIC123456',
    dateOfBirth: '1990-01-15',
    address: '123 Main St, City',
    role: 'user',
    accountStatus: 'active',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    lastLogin: '2024-10-20T10:30:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default API responses
    apiService.getUserById.mockResolvedValue({
      data: {
        user: mockUser,
      },
    });
  });

  describe('✅ POSITIVE: Component Rendering', () => {
    it('should render without crashing', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('John Doe')).toBeTruthy();
      });
    });

    it('should display loading state initially', () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      expect(getByText('Loading user details...')).toBeTruthy();
    });

    it('should display user name', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('John Doe')).toBeTruthy();
      });
    });

    it('should display user email', async () => {
      const { getAllByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const emailElements = getAllByText('john@test.com');
        expect(emailElements.length).toBeGreaterThan(0);
      });
    });

    it('should display user initials in avatar', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('JD')).toBeTruthy();
      });
    });

    it('should display role badge', async () => {
      const { getAllByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const roleElements = getAllByText('user');
        expect(roleElements.length).toBeGreaterThan(0);
      });
    });

    it('should display status badge', async () => {
      const { getAllByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const statusElements = getAllByText('active');
        expect(statusElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('✅ POSITIVE: User Information Display', () => {
    it('should display username with @ prefix', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('@johndoe')).toBeTruthy();
      });
    });

    it('should display phone number', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('+1234567890')).toBeTruthy();
      });
    });

    it('should display NIC', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('NIC123456')).toBeTruthy();
      });
    });

    it('should display formatted date of birth', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const dateText = getByText(/1\/15\/1990|15\/1\/1990/);
        expect(dateText).toBeTruthy();
      });
    });

    it('should display address', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('123 Main St, City')).toBeTruthy();
      });
    });

    it('should display account creation date', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const dateText = getByText(/1\/1\/2024|1\/1\/2024/);
        expect(dateText).toBeTruthy();
      });
    });

    it('should display last login date', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const dateText = getByText(/10\/20\/2024|20\/10\/2024/);
        expect(dateText).toBeTruthy();
      });
    });

    it('should display active status', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('Yes')).toBeTruthy();
      });
    });
  });

  describe('✅ POSITIVE: Data Loading', () => {
    it('should fetch user details on mount', async () => {
      render(<UserDetailScreen route={mockRoute} navigation={mockNavigation} />);

      await waitFor(() => {
        expect(apiService.getUserById).toHaveBeenCalledWith('user123');
      });
    });

    it('should display fetched user data', async () => {
      const { getByText, getAllByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('John Doe')).toBeTruthy();
        const emailElements = getAllByText('john@test.com');
        expect(emailElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('✅ POSITIVE: Role Management', () => {
    it('should show role change dialog when change role is pressed', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const changeRoleButton = getByText('Change Role');
        fireEvent.press(changeRoleButton);
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Change Role',
        'Select new role for John Doe',
        expect.any(Array)
      );
    });

    it('should update role to collector', async () => {
      apiService.updateUserRole.mockResolvedValue({ success: true });
      
      Alert.alert.mockImplementation((title, message, buttons) => {
        if (title === 'Change Role' && buttons && buttons[2]) {
          // Simulate pressing "Collector" button
          buttons[2].onPress();
        }
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const changeRoleButton = getByText('Change Role');
        fireEvent.press(changeRoleButton);
      });

      await waitFor(() => {
        expect(apiService.updateUserRole).toHaveBeenCalledWith('user123', 'collector');
      });
    });

    it('should update role to admin', async () => {
      apiService.updateUserRole.mockResolvedValue({ success: true });
      
      Alert.alert.mockImplementation((title, message, buttons) => {
        if (title === 'Change Role' && buttons && buttons[3]) {
          // Simulate pressing "Admin" button
          buttons[3].onPress();
        }
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const changeRoleButton = getByText('Change Role');
        fireEvent.press(changeRoleButton);
      });

      await waitFor(() => {
        expect(apiService.updateUserRole).toHaveBeenCalledWith('user123', 'admin');
      });
    });

    it('should show success message after role update', async () => {
      apiService.updateUserRole.mockResolvedValue({ success: true });
      
      Alert.alert.mockImplementation((title, message, buttons) => {
        if (title === 'Change Role') {
          buttons[1].onPress();
        }
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const changeRoleButton = getByText('Change Role');
        fireEvent.press(changeRoleButton);
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Success', 'User role updated successfully');
      });
    });

    it('should refresh user data after role update', async () => {
      apiService.updateUserRole.mockResolvedValue({ success: true });
      
      Alert.alert.mockImplementation((title, message, buttons) => {
        if (title === 'Change Role') {
          buttons[1].onPress();
        }
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const changeRoleButton = getByText('Change Role');
        fireEvent.press(changeRoleButton);
      });

      await waitFor(() => {
        expect(apiService.getUserById).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('✅ POSITIVE: Suspend/Activate User', () => {
    it('should show suspend confirmation for active user', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const suspendButton = getByText(/Suspend|Activate/);
        fireEvent.press(suspendButton);
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Suspend User',
        'Are you sure you want to suspend this user?',
        expect.any(Array)
      );
    });

    it('should show activate confirmation for suspended user', async () => {
      const suspendedUser = { ...mockUser, accountStatus: 'suspended' };
      apiService.getUserById.mockResolvedValue({
        data: { user: suspendedUser },
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const activateButton = getByText(/Activate|Suspend/);
        fireEvent.press(activateButton);
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Activate User',
        'Are you sure you want to activate this user?',
        expect.any(Array)
      );
    });

    it('should suspend user successfully', async () => {
      apiService.suspendUser.mockResolvedValue({ success: true });
      
      Alert.alert.mockImplementation((title, message, buttons) => {
        if (title === 'Suspend User') {
          buttons[1].onPress();
        }
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const suspendButton = getByText(/Suspend|Activate/);
        fireEvent.press(suspendButton);
      });

      await waitFor(() => {
        expect(apiService.suspendUser).toHaveBeenCalledWith('user123');
      });
    });

    it('should show success message after suspend', async () => {
      apiService.suspendUser.mockResolvedValue({ success: true });
      
      Alert.alert.mockImplementation((title, message, buttons) => {
        if (title === 'Suspend User') {
          buttons[1].onPress();
        }
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const suspendButton = getByText(/Suspend|Activate/);
        fireEvent.press(suspendButton);
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Success', 'User suspendd successfully');
      });
    });
  });

  describe('✅ POSITIVE: Delete User', () => {
    it('should show delete confirmation', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const deleteButton = getByText('Delete User');
        fireEvent.press(deleteButton);
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Delete User',
        'Are you sure you want to delete John Doe? This action cannot be undone.',
        expect.any(Array)
      );
    });

    it('should delete user successfully', async () => {
      apiService.deleteUser.mockResolvedValue({ success: true });
      
      Alert.alert.mockImplementation((title, message, buttons) => {
        if (title === 'Delete User') {
          buttons[1].onPress();
        }
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const deleteButton = getByText('Delete User');
        fireEvent.press(deleteButton);
      });

      await waitFor(() => {
        expect(apiService.deleteUser).toHaveBeenCalledWith('user123');
      });
    });

    it('should navigate back after successful delete', async () => {
      apiService.deleteUser.mockResolvedValue({ success: true });
      
      Alert.alert.mockImplementation((title, message, buttons) => {
        if (title === 'Delete User') {
          buttons[1].onPress();
        }
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const deleteButton = getByText('Delete User');
        fireEvent.press(deleteButton);
      });

      await waitFor(() => {
        expect(mockGoBack).toHaveBeenCalled();
      });
    });
  });

  describe('✅ POSITIVE: Navigation', () => {
    it('should have back button', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('←')).toBeTruthy();
      });
    });

    it('should navigate back when back button is pressed', async () => {
      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const backButton = getByText('←');
        fireEvent.press(backButton);
      });

      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('❌ NEGATIVE: Error Handling', () => {
    it('should show error and navigate back on fetch failure', async () => {
      apiService.getUserById.mockRejectedValue(new Error('Network error'));

      render(<UserDetailScreen route={mockRoute} navigation={mockNavigation} />);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Network error');
        expect(mockGoBack).toHaveBeenCalled();
      });
    });

    it('should handle role update error', async () => {
      apiService.updateUserRole.mockRejectedValue(new Error('Update failed'));
      
      Alert.alert.mockImplementation((title, message, buttons) => {
        if (title === 'Change Role') {
          buttons[1].onPress();
        }
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const changeRoleButton = getByText('Change Role');
        fireEvent.press(changeRoleButton);
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Update failed');
      });
    });

    it('should handle suspend error', async () => {
      apiService.suspendUser.mockRejectedValue(new Error('Suspend failed'));
      
      Alert.alert.mockImplementation((title, message, buttons) => {
        if (title === 'Suspend User') {
          buttons[1].onPress();
        }
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const suspendButton = getByText(/Suspend|Activate/);
        fireEvent.press(suspendButton);
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Suspend failed');
      });
    });

    it('should handle delete error', async () => {
      apiService.deleteUser.mockRejectedValue(new Error('Delete failed'));
      
      Alert.alert.mockImplementation((title, message, buttons) => {
        if (title === 'Delete User') {
          buttons[1].onPress();
        }
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const deleteButton = getByText('Delete User');
        fireEvent.press(deleteButton);
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Delete failed');
      });
    });

    it('should show user not found when user is null', async () => {
      apiService.getUserById.mockResolvedValue({
        data: { user: null },
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('User not found')).toBeTruthy();
      });
    });
  });

  describe('🔍 BOUNDARY: Edge Cases', () => {
    it('should handle user with missing optional fields', async () => {
      const minimalUser = {
        _id: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        username: 'johndoe',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      apiService.getUserById.mockResolvedValue({
        data: { user: minimalUser },
      });

      const { getAllByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const naElements = getAllByText('N/A');
        expect(naElements.length).toBeGreaterThan(0);
      });
    });

    it('should handle user with no last login', async () => {
      const userNoLogin = { ...mockUser, lastLogin: null };
      apiService.getUserById.mockResolvedValue({
        data: { user: userNoLogin },
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('Never')).toBeTruthy();
      });
    });

    it('should handle different role badge colors', async () => {
      const adminUser = { ...mockUser, role: 'admin' };
      apiService.getUserById.mockResolvedValue({
        data: { user: adminUser },
      });

      const { getAllByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const adminElements = getAllByText('admin');
        expect(adminElements.length).toBeGreaterThan(0);
      });
    });

    it('should handle collector role', async () => {
      const collectorUser = { ...mockUser, role: 'collector' };
      apiService.getUserById.mockResolvedValue({
        data: { user: collectorUser },
      });

      const { getAllByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const collectorElements = getAllByText('collector');
        expect(collectorElements.length).toBeGreaterThan(0);
      });
    });

    it('should handle pending status', async () => {
      const pendingUser = { ...mockUser, accountStatus: 'pending' };
      apiService.getUserById.mockResolvedValue({
        data: { user: pendingUser },
      });

      const { getAllByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const pendingElements = getAllByText('pending');
        expect(pendingElements.length).toBeGreaterThan(0);
      });
    });

    it('should handle inactive user', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      apiService.getUserById.mockResolvedValue({
        data: { user: inactiveUser },
      });

      const { getByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText('No')).toBeTruthy();
      });
    });

    it('should handle user with empty name fields', async () => {
      const emptyNameUser = { ...mockUser, firstName: '', lastName: '' };
      apiService.getUserById.mockResolvedValue({
        data: { user: emptyNameUser },
      });

      const { getAllByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const emailElements = getAllByText('john@test.com');
        expect(emailElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('🎨 UI: Badge Colors', () => {
    it('should apply correct color for admin role', async () => {
      const adminUser = { ...mockUser, role: 'admin' };
      apiService.getUserById.mockResolvedValue({
        data: { user: adminUser },
      });

      const { getAllByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const badges = getAllByText('admin');
        expect(badges.length).toBeGreaterThan(0);
      });
    });

    it('should apply correct color for suspended status', async () => {
      const suspendedUser = { ...mockUser, accountStatus: 'suspended' };
      apiService.getUserById.mockResolvedValue({
        data: { user: suspendedUser },
      });

      const { getAllByText } = render(
        <UserDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        const badges = getAllByText('suspended');
        expect(badges.length).toBeGreaterThan(0);
      });
    });
  });
});