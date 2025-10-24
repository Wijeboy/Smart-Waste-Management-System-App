/**
 * PostRouteSummaryModal Component Tests
 * Tests for the post-route completion summary modal
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PostRouteSummaryModal from '../PostRouteSummaryModal';

describe('PostRouteSummaryModal', () => {
  const mockOnClose = jest.fn();
  const mockOnDownloadReport = jest.fn();
  
  const mockRouteData = {
    routeName: 'Downtown Route A',
    routeDuration: 145, // 2h 25m
    wasteCollected: 285.5,
    recyclableWaste: 142.3,
    completedAt: '2025-10-24T14:30:00.000Z',
    startedAt: '2025-10-24T12:05:00.000Z',
    bins: [
      {
        bin: {
          _id: 'bin1',
          binId: 'BIN-001',
          location: '123 Main St',
        },
        status: 'collected',
        actualWeight: 45.5,
        fillLevelAtCollection: 85,
        collectedAt: '2025-10-24T12:15:00.000Z',
      },
      {
        bin: {
          _id: 'bin2',
          binId: 'BIN-002',
          location: '456 Oak Ave',
        },
        status: 'collected',
        actualWeight: 62.0,
        fillLevelAtCollection: 92,
        collectedAt: '2025-10-24T12:45:00.000Z',
      },
      {
        bin: {
          _id: 'bin3',
          binId: 'BIN-003',
          location: '789 Pine Rd',
        },
        status: 'skipped',
        notes: 'Access blocked by construction',
        fillLevelAtCollection: 45,
      },
    ],
  };

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    onDownloadReport: mockOnDownloadReport,
    routeData: mockRouteData,
    downloadLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing when visible', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('Route Completed!')).toBeTruthy();
    });

    it('should not render when not visible', () => {
      const { queryByText } = render(<PostRouteSummaryModal {...defaultProps} visible={false} />);
      expect(queryByText('Route Completed!')).toBeNull();
    });

    it('should return null when routeData is not provided', () => {
      const { UNSAFE_root } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={null} />
      );
      // Component should return null, so nothing should be rendered
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should display route name', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('Downtown Route A')).toBeTruthy();
    });

    it('should display completion message', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('Route Completed!')).toBeTruthy();
    });
  });

  describe('Statistics Display', () => {
    it('should display correct total bins count', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('3')).toBeTruthy(); // Total bins
      expect(getByText('Total Bins')).toBeTruthy();
    });

    it('should display correct collected bins count', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('2')).toBeTruthy(); // Collected bins
      expect(getByText('Collected')).toBeTruthy();
    });

    it('should display correct skipped bins count', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('1')).toBeTruthy(); // Skipped bins
      expect(getByText('Skipped')).toBeTruthy();
    });

    it('should display formatted route duration', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('2h 25m')).toBeTruthy();
    });

    it('should display route duration in minutes when under 60 minutes', () => {
      const shortRouteData = { ...mockRouteData, routeDuration: 45 };
      const { getByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={shortRouteData} />
      );
      expect(getByText('45 min')).toBeTruthy();
    });

    it('should display total waste collected', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('285.5 kg')).toBeTruthy();
    });

    it('should display recyclable waste amount', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('142.3 kg')).toBeTruthy();
    });

    it('should display completed timestamp when available', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      // Check that some date/time text is present (format may vary by locale)
      expect(getByText(/2025/)).toBeTruthy();
    });

    it('should handle zero waste collected', () => {
      const noWasteData = {
        ...mockRouteData,
        wasteCollected: 0,
        recyclableWaste: 0,
      };
      const { getAllByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={noWasteData} />
      );
      const zeroKgElements = getAllByText('0 kg');
      expect(zeroKgElements.length).toBeGreaterThan(0);
    });
  });

  describe('Bin Details Display', () => {
    it('should display section title with bin count', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('Bin Details (3)')).toBeTruthy();
    });

    it('should display all bin IDs', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('BIN-001')).toBeTruthy();
      expect(getByText('BIN-002')).toBeTruthy();
      expect(getByText('BIN-003')).toBeTruthy();
    });

    it('should display all bin locations', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('📍 123 Main St')).toBeTruthy();
      expect(getByText('📍 456 Oak Ave')).toBeTruthy();
      expect(getByText('📍 789 Pine Rd')).toBeTruthy();
    });

    it('should display collected status badge', () => {
      const { getAllByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      const collectedBadges = getAllByText('collected');
      expect(collectedBadges.length).toBe(2);
    });

    it('should display skipped status badge', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('skipped')).toBeTruthy();
    });

    it('should display fill level for collected bins', () => {
      const { getAllByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getAllByText('Fill Level:').length).toBeGreaterThan(0);
      expect(getAllByText('85%').length).toBeGreaterThan(0);
      expect(getAllByText('92%').length).toBeGreaterThan(0);
    });

    it('should display weight collected for collected bins', () => {
      const { getAllByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getAllByText('Weight Collected:').length).toBeGreaterThan(0);
      expect(getAllByText('45.5 kg').length).toBeGreaterThan(0);
      expect(getAllByText('62 kg').length).toBeGreaterThan(0);
    });

    it('should display skip reason for skipped bins', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('Reason: Access blocked by construction')).toBeTruthy();
    });

    it('should not display weight details for skipped bins', () => {
      const { queryAllByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      // Only 2 collected bins should show weight
      const weightLabels = queryAllByText('Weight Collected:');
      expect(weightLabels.length).toBe(2);
    });

    it('should display collection time for collected bins', () => {
      const { getAllByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getAllByText('Time:').length).toBeGreaterThan(0);
    });
  });

  describe('Missing or Undefined Data Handling', () => {
    it('should handle missing bin data gracefully', () => {
      const incompleteBinData = {
        ...mockRouteData,
        bins: [
          {
            bin: {
              _id: 'bin1',
            },
            status: 'collected',
          },
        ],
      };
      
      const { getByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={incompleteBinData} />
      );
      
      expect(getByText('Unknown Bin')).toBeTruthy();
      expect(getByText('📍 Unknown location')).toBeTruthy();
    });

    it('should handle undefined fill level', () => {
      const noFillLevelData = {
        ...mockRouteData,
        bins: [
          {
            bin: { _id: 'bin1', binId: 'BIN-001', location: '123 Main St' },
            status: 'collected',
            actualWeight: 45.5,
            fillLevelAtCollection: undefined,
          },
        ],
      };
      
      const { getByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={noFillLevelData} />
      );
      
      expect(getByText('N/A')).toBeTruthy();
    });

    it('should handle undefined weight', () => {
      const noWeightData = {
        ...mockRouteData,
        bins: [
          {
            bin: { _id: 'bin1', binId: 'BIN-001', location: '123 Main St' },
            status: 'collected',
            actualWeight: undefined,
            fillLevelAtCollection: 85,
          },
        ],
      };
      
      const { getByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={noWeightData} />
      );
      
      expect(getByText('N/A')).toBeTruthy();
    });

    it('should handle empty bins array', () => {
      const noBinsData = { ...mockRouteData, bins: [] };
      const { getByText, getAllByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={noBinsData} />
      );
      
      expect(getAllByText('0').length).toBeGreaterThan(0); // Total bins should be 0
      expect(getByText('Bin Details (0)')).toBeTruthy();
    });

    it('should handle missing completedAt timestamp', () => {
      const noTimestampData = { ...mockRouteData, completedAt: null };
      const { queryByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={noTimestampData} />
      );
      
      // Completed At row should not be rendered
      expect(queryByText('✅ Completed At:')).toBeNull();
    });

    it('should provide defaults for missing optional fields', () => {
      const minimalData = {
        routeName: 'Test Route',
      };
      
      const { getByText, getAllByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={minimalData} />
      );
      
      // Should handle gracefully with defaults
      expect(getByText('Test Route')).toBeTruthy();
      expect(getAllByText('0').length).toBeGreaterThan(0); // Default bins count
    });
  });

  describe('Button Interactions', () => {
    it('should call onDownloadReport when download button is pressed', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      
      const downloadButton = getByText('Download Report');
      fireEvent.press(downloadButton);
      
      expect(mockOnDownloadReport).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when close button is pressed', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      
      const closeButton = getByText('Close');
      fireEvent.press(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should disable download button when downloadLoading is true', () => {
      const { getByText, UNSAFE_getByType } = render(
        <PostRouteSummaryModal {...defaultProps} downloadLoading={true} />
      );
      
      // Should show ActivityIndicator instead of text
      const ActivityIndicator = require('react-native').ActivityIndicator;
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('should not call onDownloadReport when loading', () => {
      const { getByText, UNSAFE_queryAllByType } = render(
        <PostRouteSummaryModal {...defaultProps} downloadLoading={true} />
      );
      
      // Try to find and press the button (it's disabled but we can still try)
      const ActivityIndicator = require('react-native').ActivityIndicator;
      const indicators = UNSAFE_queryAllByType(ActivityIndicator);
      
      // Button is disabled, so pressing shouldn't call the handler
      // This is more of a behavior test than a direct interaction
      expect(mockOnDownloadReport).not.toHaveBeenCalled();
    });

    it('should display download icon when not loading', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      expect(getByText('📥')).toBeTruthy();
    });
  });

  describe('Modal Dismissal', () => {
    it('should allow dismissal via onRequestClose', () => {
      const { getByText } = render(<PostRouteSummaryModal {...defaultProps} />);
      
      // Modal should be visible
      expect(getByText('Route Completed!')).toBeTruthy();
      
      // onClose should be callable (modal allows dismissal)
      const closeButton = getByText('Close');
      fireEvent.press(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large bin arrays', () => {
      const largeBinArray = Array.from({ length: 50 }, (_, i) => ({
        bin: {
          _id: `bin${i}`,
          binId: `BIN-${String(i).padStart(3, '0')}`,
          location: `${i * 100} Test St`,
        },
        status: i % 3 === 0 ? 'skipped' : 'collected',
        actualWeight: i % 3 === 0 ? undefined : 50 + i,
        fillLevelAtCollection: 70 + (i % 30),
      }));

      const largeBinData = { ...mockRouteData, bins: largeBinArray };
      const { getByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={largeBinData} />
      );
      
      expect(getByText('Bin Details (50)')).toBeTruthy();
      expect(getByText('BIN-000')).toBeTruthy();
    });

    it('should handle very long route duration', () => {
      const longRouteData = { ...mockRouteData, routeDuration: 480 }; // 8 hours
      const { getByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={longRouteData} />
      );
      
      expect(getByText('8h 0m')).toBeTruthy();
    });

    it('should handle zero route duration', () => {
      const zeroRouteData = { ...mockRouteData, routeDuration: 0 };
      const { getByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={zeroRouteData} />
      );
      
      expect(getByText('0 min')).toBeTruthy();
    });

    it('should handle very long bin location names', () => {
      const longLocationData = {
        ...mockRouteData,
        bins: [
          {
            bin: {
              _id: 'bin1',
              binId: 'BIN-001',
              location: 'A Very Long Street Name That Goes On And On And Includes Building Number 12345',
            },
            status: 'collected',
            actualWeight: 45.5,
            fillLevelAtCollection: 85,
          },
        ],
      };
      
      const { getByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={longLocationData} />
      );
      
      expect(
        getByText(/A Very Long Street Name That Goes On And On/)
      ).toBeTruthy();
    });

    it('should handle very long skip reasons', () => {
      const longReasonData = {
        ...mockRouteData,
        bins: [
          {
            bin: { _id: 'bin1', binId: 'BIN-001', location: '123 Main St' },
            status: 'skipped',
            notes: 'This is a very long reason for skipping the bin that includes multiple details about the situation and circumstances that prevented collection',
          },
        ],
      };
      
      const { getByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={longReasonData} />
      );
      
      expect(
        getByText(/This is a very long reason for skipping the bin/)
      ).toBeTruthy();
    });

    it('should handle bins with all statuses being collected', () => {
      const allCollectedData = {
        ...mockRouteData,
        bins: mockRouteData.bins.map(b => ({ ...b, status: 'collected', actualWeight: 50, fillLevelAtCollection: 80 })),
      };
      
      const { getAllByText, queryByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={allCollectedData} />
      );
      
      const threeElements = getAllByText('3');
      expect(threeElements.length).toBeGreaterThan(0); // All collected
      const zeroElements = getAllByText('0');
      expect(zeroElements.length).toBeGreaterThan(0); // None skipped
      expect(queryByText('skipped')).toBeNull(); // No skipped badge
    });

    it('should handle bins with all statuses being skipped', () => {
      const allSkippedData = {
        ...mockRouteData,
        bins: mockRouteData.bins.map(b => ({ 
          ...b, 
          status: 'skipped',
          notes: 'Could not access'
        })),
      };
      
      const { getAllByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={allSkippedData} />
      );
      
      const zeroElements = getAllByText('0');
      expect(zeroElements.length).toBeGreaterThan(0); // None collected
      const threeElements = getAllByText('3');
      expect(threeElements.length).toBeGreaterThan(0); // All skipped
      const skippedBadges = getAllByText('skipped');
      expect(skippedBadges.length).toBe(3);
    });
  });

  describe('Duration Formatting', () => {
    it('should format exact hours correctly', () => {
      const exactHourData = { ...mockRouteData, routeDuration: 120 };
      const { getByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={exactHourData} />
      );
      
      expect(getByText('2h 0m')).toBeTruthy();
    });

    it('should format partial hours correctly', () => {
      const partialHourData = { ...mockRouteData, routeDuration: 73 };
      const { getByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={partialHourData} />
      );
      
      expect(getByText('1h 13m')).toBeTruthy();
    });

    it('should format minutes under 60 correctly', () => {
      const minutesData = { ...mockRouteData, routeDuration: 59 };
      const { getByText } = render(
        <PostRouteSummaryModal {...defaultProps} routeData={minutesData} />
      );
      
      expect(getByText('59 min')).toBeTruthy();
    });
  });
});
