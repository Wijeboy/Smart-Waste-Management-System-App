/**
 * BinListItem Test Suite
 * Tests the bin list item component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import BinListItem from '../BinListItem';

describe('BinListItem', () => {
  const mockBin = {
    id: 1,
    binId: 'BIN-001',
    location: '123 Main St, Downtown',
    wasteType: 'general',
    capacity: '240L',
    notes: 'Near the coffee shop',
    status: 'pending',
    weight: 15.2,
    fillLevel: 85,
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders bin information correctly', () => {
    render(
      <BinListItem
        bin={mockBin}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('BIN-001')).toBeTruthy();
    expect(screen.getByText('123 Main St, Downtown')).toBeTruthy();
    expect(screen.getByText('240L')).toBeTruthy();
    expect(screen.getByText('15.2kg')).toBeTruthy();
    expect(screen.getByText('85%')).toBeTruthy();
  });

  it('displays status badge with correct styling', () => {
    render(
      <BinListItem
        bin={mockBin}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('pending')).toBeTruthy();
  });

  it('displays waste type correctly', () => {
    render(
      <BinListItem
        bin={mockBin}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('General')).toBeTruthy();
  });

  it('displays notes when provided', () => {
    render(
      <BinListItem
        bin={mockBin}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Near the coffee shop')).toBeTruthy();
  });

  it('does not display notes section when notes are empty', () => {
    const binWithoutNotes = { ...mockBin, notes: '' };
    
    render(
      <BinListItem
        bin={binWithoutNotes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText('📝')).toBeNull();
  });

  it('calls onEdit when Edit button is pressed', () => {
    render(
      <BinListItem
        bin={mockBin}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.press(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockBin);
  });

  it('calls onDelete when Delete button is pressed', () => {
    render(
      <BinListItem
        bin={mockBin}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.press(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockBin);
  });

  it('displays correct icon for recyclable waste type', () => {
    const recyclableBin = { ...mockBin, wasteType: 'recyclable' };
    
    render(
      <BinListItem
        bin={recyclableBin}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Recyclable')).toBeTruthy();
  });

  it('displays correct icon for organic waste type', () => {
    const organicBin = { ...mockBin, wasteType: 'organic' };
    
    render(
      <BinListItem
        bin={organicBin}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Organic')).toBeTruthy();
  });
});
