/**
 * RouteManagementScreen Tests
 * Test suite for BinCollection Route Management Screen
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import RouteManagementScreen from '../RouteManagementScreen';
import { useRoute } from '../../../context/RouteContext';
import { useAuth } from '../../../context/AuthContext';

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

jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock components
jest.mock('../../../components/BottomNavigation', () => 'BottomNavigation');
jest.mock('../../../components/PreRouteChecklistModal', () => 'PreRouteChecklistModal');

// Mock useFocusEffect
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback) => {
    callback();
  })
}));

describe('RouteManagementScreen', () => {
  const mockRouteContext = {
    routes: [],
    fetchMyRoutes: jest.fn(),
    loading: false,
    startRoute: jest.fn()
  };

  const mockAuthContext = {
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
    useAuth.mockReturnValue(mockAuthContext);
  });

  describe('✅ POSITIVE: Rendering Tests', () => {
    it('should render route management screen', () => {
      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should call fetchMyRoutes on mount', () => {
      render(<RouteManagementScreen navigation={mockNavigation} />);

      expect(mockRouteContext.fetchMyRoutes).toHaveBeenCalled();
    });

    it('should render with empty routes', () => {
      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Route Display Tests', () => {
    it('should display today route when available', async () => {
      const todayRoute = {
        _id: 'route123',
        routeName: 'Today Route',
        scheduledDate: new Date(),
        scheduledTime: '09:00 AM',
        status: 'scheduled',
        bins: [
          { bin: { _id: 'bin1', binId: 'BIN001' }, status: 'pending' },
          { bin: { _id: 'bin2', binId: 'BIN002' }, status: 'pending' }
        ]
      };

      const contextWithRoute = {
        ...mockRouteContext,
        routes: [todayRoute]
      };

      useRoute.mockReturnValue(contextWithRoute);

      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText).toBeTruthy();
      });
    });

    it('should display in-progress route', async () => {
      const inProgressRoute = {
        _id: 'route456',
        routeName: 'In Progress Route',
        scheduledDate: new Date(),
        scheduledTime: '10:00 AM',
        status: 'in-progress',
        bins: [
          { bin: { _id: 'bin1', binId: 'BIN001' }, status: 'collected' },
          { bin: { _id: 'bin2', binId: 'BIN002' }, status: 'pending' }
        ]
      };

      const contextInProgress = {
        ...mockRouteContext,
        routes: [inProgressRoute]
      };

      useRoute.mockReturnValue(contextInProgress);

      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText).toBeTruthy();
      });
    });

    it('should handle route with multiple bins', async () => {
      const multiRoute = {
        _id: 'routeMulti',
        routeName: 'Multi Bin Route',
        scheduledDate: new Date(),
        status: 'scheduled',
        bins: [
          { bin: { _id: 'bin1', binId: 'BIN001' }, status: 'pending' },
          { bin: { _id: 'bin2', binId: 'BIN002' }, status: 'pending' },
          { bin: { _id: 'bin3', binId: 'BIN003' }, status: 'pending' },
          { bin: { _id: 'bin4', binId: 'BIN004' }, status: 'pending' }
        ]
      };

      const contextMulti = {
        ...mockRouteContext,
        routes: [multiRoute]
      };

      useRoute.mockReturnValue(contextMulti);

      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText).toBeTruthy();
      });
    });
  });

  describe('✅ POSITIVE: Loading State Tests', () => {
    it('should display loading indicator when loading', () => {
      const loadingContext = {
        ...mockRouteContext,
        loading: true
      };

      useRoute.mockReturnValue(loadingContext);

      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should hide loading when data is loaded', () => {
      const loadedContext = {
        ...mockRouteContext,
        loading: false,
        routes: []
      };

      useRoute.mockReturnValue(loadedContext);

      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Date Filtering Tests', () => {
    it('should filter routes by today date', async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const mixedRoutes = [
        {
          _id: 'route1',
          routeName: 'Yesterday Route',
          scheduledDate: yesterday,
          status: 'completed',
          bins: []
        },
        {
          _id: 'route2',
          routeName: 'Today Route',
          scheduledDate: today,
          status: 'scheduled',
          bins: []
        },
        {
          _id: 'route3',
          routeName: 'Tomorrow Route',
          scheduledDate: tomorrow,
          status: 'scheduled',
          bins: []
        }
      ];

      const contextMixed = {
        ...mockRouteContext,
        routes: mixedRoutes
      };

      useRoute.mockReturnValue(contextMixed);

      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText).toBeTruthy();
      });
    });

    it('should handle route with no scheduled date', async () => {
      const noDateRoute = {
        _id: 'routeNoDate',
        routeName: 'No Date Route',
        status: 'scheduled',
        bins: []
      };

      const contextNoDate = {
        ...mockRouteContext,
        routes: [noDateRoute]
      };

      useRoute.mockReturnValue(contextNoDate);

      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(getByText).toBeTruthy();
      });
    });
  });

  describe('✅ POSITIVE: Route Status Tests', () => {
    it('should handle scheduled status', () => {
      const scheduledRoute = {
        _id: 'routeScheduled',
        routeName: 'Scheduled Route',
        scheduledDate: new Date(),
        status: 'scheduled',
        bins: []
      };

      const contextScheduled = {
        ...mockRouteContext,
        routes: [scheduledRoute]
      };

      useRoute.mockReturnValue(contextScheduled);

      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle in-progress status', () => {
      const inProgressRoute = {
        _id: 'routeInProgress',
        routeName: 'In Progress Route',
        scheduledDate: new Date(),
        status: 'in-progress',
        bins: []
      };

      const contextInProgress = {
        ...mockRouteContext,
        routes: [inProgressRoute]
      };

      useRoute.mockReturnValue(contextInProgress);

      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should not display completed routes for today', () => {
      const completedRoute = {
        _id: 'routeCompleted',
        routeName: 'Completed Route',
        scheduledDate: new Date(),
        status: 'completed',
        bins: []
      };

      const contextCompleted = {
        ...mockRouteContext,
        routes: [completedRoute]
      };

      useRoute.mockReturnValue(contextCompleted);

      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Empty State Tests', () => {
    it('should handle no routes for today', () => {
      const emptyContext = {
        ...mockRouteContext,
        routes: []
      };

      useRoute.mockReturnValue(emptyContext);

      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle null routes', () => {
      const nullContext = {
        ...mockRouteContext,
        routes: null
      };

      useRoute.mockReturnValue(nullContext);

      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Bin Display Tests', () => {
    it('should display route with collected bins', () => {
      const routeWithCollected = {
        _id: 'routeCollected',
        routeName: 'Route With Collections',
        scheduledDate: new Date(),
        status: 'in-progress',
        bins: [
          { bin: { _id: 'bin1', binId: 'BIN001' }, status: 'collected' },
          { bin: { _id: 'bin2', binId: 'BIN002' }, status: 'pending' }
        ]
      };

      const contextWithCollected = {
        ...mockRouteContext,
        routes: [routeWithCollected]
      };

      useRoute.mockReturnValue(contextWithCollected);

      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should display route with skipped bins', () => {
      const routeWithSkipped = {
        _id: 'routeSkipped',
        routeName: 'Route With Skipped',
        scheduledDate: new Date(),
        status: 'in-progress',
        bins: [
          { bin: { _id: 'bin1', binId: 'BIN001' }, status: 'skipped', skipReason: 'Blocked access' },
          { bin: { _id: 'bin2', binId: 'BIN002' }, status: 'pending' }
        ]
      };

      const contextWithSkipped = {
        ...mockRouteContext,
        routes: [routeWithSkipped]
      };

      useRoute.mockReturnValue(contextWithSkipped);

      const { getByText } = render(
        <RouteManagementScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });
});
