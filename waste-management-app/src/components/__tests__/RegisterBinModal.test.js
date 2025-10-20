/**
 * RegisterBinModal Test Suite
 * Tests the bin registration and editing modal
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterBinModal from '../RegisterBinModal';

describe('RegisterBinModal', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when visible', () => {
    render(
      <RegisterBinModal
        visible={true}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Register New Bin')).toBeTruthy();
    expect(screen.getByText('Add a new waste bin to collection system')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    render(
      <RegisterBinModal
        visible={false}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText('Register New Bin')).toBeNull();
  });

  it('shows all required form fields', () => {
    render(
      <RegisterBinModal
        visible={true}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByPlaceholderText('Enter unique bin identifier')).toBeTruthy();
    expect(screen.getByPlaceholderText('Full street address')).toBeTruthy();
    expect(screen.getByText('General')).toBeTruthy();
    expect(screen.getByText('Recyclable')).toBeTruthy();
    expect(screen.getByText('Organic')).toBeTruthy();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(
      <RegisterBinModal
        visible={true}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    const submitButton = screen.getByText(/Register Bin/i);
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Bin ID is required')).toBeTruthy();
      expect(screen.getByText('Location is required')).toBeTruthy();
      expect(screen.getByText('Waste type is required')).toBeTruthy();
      expect(screen.getByText('Capacity is required')).toBeTruthy();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(
      <RegisterBinModal
        visible={true}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    // Fill in form
    const binIdInput = screen.getByPlaceholderText('Enter unique bin identifier');
    fireEvent.changeText(binIdInput, 'BIN-100');

    const locationInput = screen.getByPlaceholderText('Full street address');
    fireEvent.changeText(locationInput, '123 Test St');

    const generalButton = screen.getByText('General');
    fireEvent.press(generalButton);

    const capacity100L = screen.getByText('100 Liters');
    fireEvent.press(capacity100L);

    const submitButton = screen.getByText(/Register Bin/i);
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        binId: 'BIN-100',
        location: '123 Test St',
        wasteType: 'general',
        capacity: '100L',
        notes: '',
      });
    });
  });

  it('shows Edit mode when binData is provided', () => {
    const existingBin = {
      binId: 'BIN-001',
      location: '456 Oak Ave',
      wasteType: 'recyclable',
      capacity: '240L',
      notes: 'Test notes',
    };

    render(
      <RegisterBinModal
        visible={true}
        binData={existingBin}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Edit Bin')).toBeTruthy();
    expect(screen.getByText('Update waste bin information')).toBeTruthy();
    expect(screen.getByText(/Update Bin/i)).toBeTruthy();
  });

  it('calls onClose when Cancel button is pressed', () => {
    render(
      <RegisterBinModal
        visible={true}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.press(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
