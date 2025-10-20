/**
 * EditProfileModal Test Suite
 * Tests the edit profile modal functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import EditProfileModal from '../EditProfileModal';

describe('EditProfileModal', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();
  const mockUserData = {
    name: 'Alex Johnson',
    role: 'Collection Supervisor',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when visible', () => {
    render(
      <EditProfileModal
        visible={true}
        userData={mockUserData}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Edit Profile')).toBeTruthy();
    expect(screen.getByText('Update your profile information')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    render(
      <EditProfileModal
        visible={false}
        userData={mockUserData}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText('Edit Profile')).toBeNull();
  });

  it('pre-fills form with user data', () => {
    render(
      <EditProfileModal
        visible={true}
        userData={mockUserData}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    const nameInput = screen.getByPlaceholderText('Enter your full name');
    expect(nameInput.props.value).toBe('Alex Johnson');

    const roleInput = screen.getByPlaceholderText('e.g., Collection Supervisor');
    expect(roleInput.props.value).toBe('Collection Supervisor');
  });

  it('shows validation error when name is empty', async () => {
    render(
      <EditProfileModal
        visible={true}
        userData={{ name: '', role: '' }}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    const saveButton = screen.getByText(/Save Changes/i);
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeTruthy();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(
      <EditProfileModal
        visible={true}
        userData={mockUserData}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    const nameInput = screen.getByPlaceholderText('Enter your full name');
    fireEvent.changeText(nameInput, 'John Doe');

    const roleInput = screen.getByPlaceholderText('e.g., Collection Supervisor');
    fireEvent.changeText(roleInput, 'Manager');

    const saveButton = screen.getByText(/Save Changes/i);
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        role: 'Manager',
      });
    });
  });

  it('calls onClose when Cancel button is pressed', () => {
    render(
      <EditProfileModal
        visible={true}
        userData={mockUserData}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.press(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays info message about name update', () => {
    render(
      <EditProfileModal
        visible={true}
        userData={mockUserData}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    expect(
      screen.getByText(/Your name will be updated across all screens/i)
    ).toBeTruthy();
  });
});
