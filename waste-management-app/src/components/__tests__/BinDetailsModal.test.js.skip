/**
 * BinDetailsModal Test Suite
 * Tests for the BinDetailsModal component
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import BinDetailsModal from '../BinDetailsModal';

describe('BinDetailsModal', () => {
  /**
   * Mock bin data for testing
   */
  const mockBinId = 'BIN-001';
  const mockLocation = '123 Main Street, Downtown';

  /**
   * Test: Component renders and displays bin ID and location
   */
  it('renders the component and displays the bin ID and location', () => {
    // Arrange & Act
    render(
      <BinDetailsModal
        visible={true}
        binId={mockBinId}
        location={mockLocation}
        onConfirm={() => {}}
        onReportIssue={() => {}}
        onClose={() => {}}
      />
    );

    // Assert
    const binId = screen.getByText(mockBinId);
    const location = screen.getByText(mockLocation);

    expect(binId).toBeVisible();
    expect(location).toBeVisible();
  });

  /**
   * Test: Component displays 'Confirm Collection' and 'Report Issue' buttons
   */
  it('displays the "Confirm Collection" and "Report Issue" buttons', () => {
    // Arrange & Act
    render(
      <BinDetailsModal
        visible={true}
        binId={mockBinId}
        location={mockLocation}
        onConfirm={() => {}}
        onReportIssue={() => {}}
        onClose={() => {}}
      />
    );

    // Assert
    const confirmButton = screen.getByText('Confirm Collection');
    const reportIssueButton = screen.getByText('Report Issue');

    expect(confirmButton).toBeVisible();
    expect(reportIssueButton).toBeVisible();
  });
});
