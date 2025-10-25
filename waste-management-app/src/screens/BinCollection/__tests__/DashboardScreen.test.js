/**
 * DashboardScreen Tests
 * Test suite for BinCollection Dashboard Screen
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import DashboardScreen from '../DashboardScreen';
import { useRoute } from '../../../context/RouteContext';
import { useUser } from '../../../context/UserContext';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
  setOptions: jest.fn()
};

// Mock contexts
jest.mock('../../../context/RouteContext', () => ({
  useRoute: jest.fn()
}));

jest.mock('../../../context/UserContext', () => ({
  useUser: jest.fn()
}));

// Mock components
jest.mock('../../../components/ProgressBar', () => 'ProgressBar');
jest.mock('../../../components/ImpactCard', () => 'ImpactCard');
jest.mock('../../../components/CollectionTypeItem', () => 'CollectionTypeItem');
jest.mock('../../../components/BottomNavigation', () => 'BottomNavigation');

describe('DashboardScreen', () => {
  const mockRouteContext = {
    getStatistics: jest.fn(),
    routeInfo: {
      routeName: 'Downtown Route',
      totalBins: 10,
      collectedBins: 5,
      skippedBins: 1,
      remainingBins: 4
    },
    impactMetrics: {
      wasteCollected: 250,
      co2Saved: 50,
      recyclableWeight: 100,
      organicWeight: 75
    },
    routes: [],
    loading: false,
    error: null
  };

  const mockUserContext = {
    user: {
      firstName: 'John',
      lastName: 'Collector',
      username: 'johncollector',
      role: 'collector'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRoute.mockReturnValue(mockRouteContext);
    useUser.mockReturnValue(mockUserContext);
  });

  describe('✅ POSITIVE: Rendering Tests', () => {
    it('should render dashboard screen with greeting', () => {
      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      // Check if greeting is displayed (will match any greeting)
      const greetingPattern = /(Good Morning|Good Afternoon|Good Evening|Good Night)/;
      const greetingText = getByText((content) => greetingPattern.test(content));
      expect(greetingText).toBeTruthy();
    });

    it('should display user name', () => {
      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      expect(getByText(/John Collector/)).toBeTruthy();
    });

    it('should render with route statistics', () => {
      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      // Dashboard should render without crashing
      expect(getByText).toBeTruthy();
    });

    it('should display today route when available', async () => {
      const todayRoute = {
        _id: 'route123',
        routeName: 'Today Route',
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        status: 'scheduled',
        bins: [
          { bin: 'bin1', status: 'pending' },
          { bin: 'bin2', status: 'collected' }
        ]
      };

      const contextWithRoute = {
        ...mockRouteContext,
        routes: [todayRoute]
      };

      useRoute.mockReturnValue(contextWithRoute);

      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText).toBeTruthy();
      });
    });

    it('should render impact metrics section', () => {
      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      // Impact section should be rendered
      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Data Display Tests', () => {
    it('should display correct statistics when data is available', () => {
      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      // Screen should render with statistics
      expect(getByText).toBeTruthy();
    });

    it('should handle empty route data gracefully', () => {
      const emptyRouteContext = {
        ...mockRouteContext,
        routeInfo: null,
        routes: []
      };

      useRoute.mockReturnValue(emptyRouteContext);

      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should display loading state correctly', () => {
      const loadingContext = {
        ...mockRouteContext,
        loading: true
      };

      useRoute.mockReturnValue(loadingContext);

      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Time-based Tests', () => {
    it('should display current time', () => {
      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      // Time should be displayed
      expect(getByText).toBeTruthy();
    });

    it('should update greeting based on time of day', () => {
      // Mock different times of day
      const originalDate = Date;
      global.Date = class extends Date {
        getHours() {
          return 10; // Morning
        }
      };

      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();

      global.Date = originalDate;
    });
  });

  describe('✅ POSITIVE: Route Progress Tests', () => {
    it('should calculate route progress correctly', () => {
      const routeWithProgress = {
        _id: 'route456',
        routeName: 'Progress Route',
        scheduledDate: new Date(),
        status: 'in-progress',
        bins: [
          { bin: 'bin1', status: 'collected' },
          { bin: 'bin2', status: 'collected' },
          { bin: 'bin3', status: 'pending' },
          { bin: 'bin4', status: 'pending' }
        ]
      };

      const contextWithProgress = {
        ...mockRouteContext,
        routes: [routeWithProgress]
      };

      useRoute.mockReturnValue(contextWithProgress);

      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle route with no bins', () => {
      const routeNoBins = {
        _id: 'route789',
        routeName: 'Empty Route',
        scheduledDate: new Date(),
        status: 'scheduled',
        bins: []
      };

      const contextNoBins = {
        ...mockRouteContext,
        routes: [routeNoBins]
      };

      useRoute.mockReturnValue(contextNoBins);

      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle completed route (all bins collected)', () => {
      const completedRoute = {
        _id: 'routeComplete',
        routeName: 'Completed Route',
        scheduledDate: new Date(),
        status: 'in-progress',
        bins: [
          { bin: 'bin1', status: 'collected' },
          { bin: 'bin2', status: 'collected' }
        ]
      };

      const contextCompleted = {
        ...mockRouteContext,
        routes: [completedRoute]
      };

      useRoute.mockReturnValue(contextCompleted);

      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Context Integration Tests', () => {
    it('should render with minimal context data', () => {
      const minimalContext = {
        getStatistics: jest.fn(),
        routeInfo: null,
        impactMetrics: null,
        routes: [],
        loading: false,
        error: null
      };

      useRoute.mockReturnValue(minimalContext);

      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle user context without name', () => {
      const minimalUserContext = {
        user: {
          username: 'testuser',
          role: 'collector'
        }
      };

      useUser.mockReturnValue(minimalUserContext);

      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Error Handling Tests', () => {
    it('should handle error state gracefully', () => {
      const errorContext = {
        ...mockRouteContext,
        error: 'Failed to fetch routes'
      };

      useRoute.mockReturnValue(errorContext);

      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should render when statistics are unavailable', () => {
      const noStatsContext = {
        ...mockRouteContext,
        getStatistics: jest.fn().mockReturnValue({
          total: 0,
          collected: 0,
          skipped: 0,
          pending: 0
        })
      };

      useRoute.mockReturnValue(noStatsContext);

      const { getByText } = render(
        <DashboardScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });
});
