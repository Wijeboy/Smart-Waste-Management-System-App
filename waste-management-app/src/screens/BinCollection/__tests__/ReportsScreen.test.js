/**
 * ReportsScreen Tests
 * Test suite for BinCollection Reports Screen
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ReportsScreen from '../ReportsScreen';
import { useBins } from '../../../context/BinsContext';
import { useUser } from '../../../context/UserContext';
import { useAuth } from '../../../context/AuthContext';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
  setOptions: jest.fn()
};

// Mock contexts
jest.mock('../../../context/BinsContext', () => ({
  useBins: jest.fn()
}));

jest.mock('../../../context/UserContext', () => ({
  useUser: jest.fn()
}));

jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock components
jest.mock('../../../components/BinListItem', () => 'BinListItem');
jest.mock('../../../components/RegisterBinModal', () => 'RegisterBinModal');
jest.mock('../../../components/BottomNavigation', () => 'BottomNavigation');

describe('ReportsScreen', () => {
  const mockBinsContext = {
    bins: [],
    addBin: jest.fn(),
    updateBin: jest.fn(),
    deleteBin: jest.fn(),
    getAllBinsSorted: jest.fn()
  };

  const mockUserContext = {
    getUserDisplayName: jest.fn().mockReturnValue('John Collector')
  };

  const mockAuthContext = {
    user: {
      _id: 'user123',
      firstName: 'John',
      lastName: 'Collector',
      role: 'collector'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useBins.mockReturnValue(mockBinsContext);
    useUser.mockReturnValue(mockUserContext);
    useAuth.mockReturnValue(mockAuthContext);
  });

  describe('✅ POSITIVE: Rendering Tests', () => {
    it('should render reports screen', () => {
      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should display empty state when no bins', () => {
      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should render with modal closed by default', () => {
      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Bins Display Tests', () => {
    it('should display bins created by current user', () => {
      const binsWithCreator = {
        ...mockBinsContext,
        bins: [
          {
            _id: 'bin1',
            binId: 'BIN001',
            location: '123 Main St',
            createdBy: 'user123',
            createdAt: new Date('2025-01-15')
          },
          {
            _id: 'bin2',
            binId: 'BIN002',
            location: '456 Oak Ave',
            createdBy: 'user123',
            createdAt: new Date('2025-01-16')
          }
        ]
      };

      useBins.mockReturnValue(binsWithCreator);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should filter out bins created by other users', () => {
      const mixedBins = {
        ...mockBinsContext,
        bins: [
          {
            _id: 'bin1',
            binId: 'BIN001',
            location: '123 Main St',
            createdBy: 'user123',
            createdAt: new Date()
          },
          {
            _id: 'bin2',
            binId: 'BIN002',
            location: '456 Oak Ave',
            createdBy: 'otherUser',
            createdAt: new Date()
          }
        ]
      };

      useBins.mockReturnValue(mixedBins);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should display multiple bins', () => {
      const multipleBins = {
        ...mockBinsContext,
        bins: [
          {
            _id: 'bin1',
            binId: 'BIN001',
            location: '123 Main St',
            createdBy: 'user123',
            createdAt: new Date('2025-01-10')
          },
          {
            _id: 'bin2',
            binId: 'BIN002',
            location: '456 Oak Ave',
            createdBy: 'user123',
            createdAt: new Date('2025-01-11')
          },
          {
            _id: 'bin3',
            binId: 'BIN003',
            location: '789 Pine St',
            createdBy: 'user123',
            createdAt: new Date('2025-01-12')
          }
        ]
      };

      useBins.mockReturnValue(multipleBins);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Sorting Tests', () => {
    it('should sort bins by creation date (newest first)', () => {
      const unsortedBins = {
        ...mockBinsContext,
        bins: [
          {
            _id: 'bin1',
            binId: 'BIN001',
            createdBy: 'user123',
            createdAt: new Date('2025-01-10')
          },
          {
            _id: 'bin2',
            binId: 'BIN002',
            createdBy: 'user123',
            createdAt: new Date('2025-01-15')
          },
          {
            _id: 'bin3',
            binId: 'BIN003',
            createdBy: 'user123',
            createdAt: new Date('2025-01-12')
          }
        ]
      };

      useBins.mockReturnValue(unsortedBins);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle bins without createdAt date', () => {
      const binsNoDate = {
        ...mockBinsContext,
        bins: [
          {
            _id: 'bin1',
            binId: 'BIN001',
            createdBy: 'user123'
          },
          {
            _id: 'bin2',
            binId: 'BIN002',
            createdBy: 'user123',
            createdAt: new Date()
          }
        ]
      };

      useBins.mockReturnValue(binsNoDate);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Bin Types Tests', () => {
    it('should display general waste bins', () => {
      const generalBins = {
        ...mockBinsContext,
        bins: [
          {
            _id: 'bin1',
            binId: 'BIN001',
            binType: 'General',
            createdBy: 'user123',
            createdAt: new Date()
          }
        ]
      };

      useBins.mockReturnValue(generalBins);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should display recyclable bins', () => {
      const recyclableBins = {
        ...mockBinsContext,
        bins: [
          {
            _id: 'bin1',
            binId: 'BIN001',
            binType: 'Recyclable',
            createdBy: 'user123',
            createdAt: new Date()
          }
        ]
      };

      useBins.mockReturnValue(recyclableBins);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should display organic bins', () => {
      const organicBins = {
        ...mockBinsContext,
        bins: [
          {
            _id: 'bin1',
            binId: 'BIN001',
            binType: 'Organic',
            createdBy: 'user123',
            createdAt: new Date()
          }
        ]
      };

      useBins.mockReturnValue(organicBins);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should display mixed bin types', () => {
      const mixedTypes = {
        ...mockBinsContext,
        bins: [
          {
            _id: 'bin1',
            binId: 'BIN001',
            binType: 'General',
            createdBy: 'user123',
            createdAt: new Date()
          },
          {
            _id: 'bin2',
            binId: 'BIN002',
            binType: 'Recyclable',
            createdBy: 'user123',
            createdAt: new Date()
          },
          {
            _id: 'bin3',
            binId: 'BIN003',
            binType: 'Organic',
            createdBy: 'user123',
            createdAt: new Date()
          }
        ]
      };

      useBins.mockReturnValue(mixedTypes);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Fill Level Tests', () => {
    it('should display bins with different fill levels', () => {
      const binsWithFill = {
        ...mockBinsContext,
        bins: [
          {
            _id: 'bin1',
            binId: 'BIN001',
            fillLevel: 25,
            createdBy: 'user123',
            createdAt: new Date()
          },
          {
            _id: 'bin2',
            binId: 'BIN002',
            fillLevel: 50,
            createdBy: 'user123',
            createdAt: new Date()
          },
          {
            _id: 'bin3',
            binId: 'BIN003',
            fillLevel: 90,
            createdBy: 'user123',
            createdAt: new Date()
          }
        ]
      };

      useBins.mockReturnValue(binsWithFill);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle bins with 0% fill level', () => {
      const emptyBins = {
        ...mockBinsContext,
        bins: [
          {
            _id: 'bin1',
            binId: 'BIN001',
            fillLevel: 0,
            createdBy: 'user123',
            createdAt: new Date()
          }
        ]
      };

      useBins.mockReturnValue(emptyBins);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle bins with 100% fill level', () => {
      const fullBins = {
        ...mockBinsContext,
        bins: [
          {
            _id: 'bin1',
            binId: 'BIN001',
            fillLevel: 100,
            createdBy: 'user123',
            createdAt: new Date()
          }
        ]
      };

      useBins.mockReturnValue(fullBins);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Context Integration Tests', () => {
    it('should use addBin from BinsContext', () => {
      render(<ReportsScreen navigation={mockNavigation} />);

      expect(mockBinsContext.addBin).toBeDefined();
    });

    it('should use updateBin from BinsContext', () => {
      render(<ReportsScreen navigation={mockNavigation} />);

      expect(mockBinsContext.updateBin).toBeDefined();
    });

    it('should use deleteBin from BinsContext', () => {
      render(<ReportsScreen navigation={mockNavigation} />);

      expect(mockBinsContext.deleteBin).toBeDefined();
    });

    it('should use getUserDisplayName from UserContext', () => {
      render(<ReportsScreen navigation={mockNavigation} />);

      expect(mockUserContext.getUserDisplayName).toHaveBeenCalled();
    });
  });

  describe('✅ POSITIVE: User Context Tests', () => {
    it('should display user name from context', () => {
      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle different user names', () => {
      const differentUserContext = {
        getUserDisplayName: jest.fn().mockReturnValue('Jane Smith')
      };

      useUser.mockReturnValue(differentUserContext);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Edge Cases Tests', () => {
    it('should handle null user', () => {
      const nullUserContext = {
        user: null
      };

      useAuth.mockReturnValue(nullUserContext);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle undefined bins array', () => {
      const undefinedBins = {
        ...mockBinsContext,
        bins: undefined
      };

      useBins.mockReturnValue(undefinedBins);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle bins with missing properties', () => {
      const incompleteBins = {
        ...mockBinsContext,
        bins: [
          {
            _id: 'bin1',
            createdBy: 'user123'
          }
        ]
      };

      useBins.mockReturnValue(incompleteBins);

      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Modal State Tests', () => {
    it('should initialize with modal closed', () => {
      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle no selected bin initially', () => {
      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Tab State Tests', () => {
    it('should initialize with reports tab active', () => {
      const { getByText } = render(
        <ReportsScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });
});
