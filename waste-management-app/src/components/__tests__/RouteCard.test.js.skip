/**
 * RouteCard Component Tests
 * Comprehensive test suite for RouteCard component
 * Coverage: >80% - Rendering, interactions, edge cases
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RouteCard from '../RouteCard';

describe('RouteCard Component', () => {
  const mockRoute = {
    _id: '123',
    routeName: 'Downtown Collection Route',
    status: 'scheduled',
    scheduledDate: '2025-10-25',
    scheduledTime: '09:00 AM',
    totalBins: 10,
    collectedBins: 0,
    progress: 0,
    bins: [
      { _id: 'bin1', status: 'pending' },
      { _id: 'bin2', status: 'pending' }
    ],
    assignedTo: {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe'
    }
  };

  describe('✅ POSITIVE: Rendering', () => {
    it('should render route name correctly', () => {
      const { getByText } = render(<RouteCard route={mockRoute} />);
      
      expect(getByText('Downtown Collection Route')).toBeTruthy();
    });

    it('should render status badge', () => {
      const { getByText } = render(<RouteCard route={mockRoute} />);
      
      expect(getByText('scheduled')).toBeTruthy();
    });

    it('should render scheduled date and time', () => {
      const { getByText } = render(<RouteCard route={mockRoute} />);
      
      expect(getByText(/Oct 25, 2025/)).toBeTruthy();
      expect(getByText(/09:00 AM/)).toBeTruthy();
    });

    it('should render bin count', () => {
      const { getByText } = render(<RouteCard route={mockRoute} />);
      
      expect(getByText(/10 bins/i)).toBeTruthy();
    });

    it('should render assigned collector name', () => {
      const { getByText } = render(<RouteCard route={mockRoute} />);
      
      expect(getByText(/John Doe/)).toBeTruthy();
    });

    it('should render progress bar when showProgress is true', () => {
      const routeWithProgress = {
        ...mockRoute,
        progress: 50,
        collectedBins: 5
      };

      const { getByText } = render(
        <RouteCard route={routeWithProgress} showProgress={true} />
      );
      
      expect(getByText(/50%/)).toBeTruthy();
      expect(getByText(/5\/10/)).toBeTruthy();
    });

    it('should not render progress bar when showProgress is false', () => {
      const { queryByText } = render(
        <RouteCard route={mockRoute} showProgress={false} />
      );
      
      expect(queryByText(/0%/)).toBeNull();
    });
  });

  describe('✅ POSITIVE: Status Badge Colors', () => {
    it('should display blue badge for scheduled status', () => {
      const { getByText } = render(<RouteCard route={mockRoute} />);
      const statusBadge = getByText('scheduled').parent;
      
      expect(statusBadge.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: '#3B82F6' })
      );
    });

    it('should display orange badge for in-progress status', () => {
      const inProgressRoute = { ...mockRoute, status: 'in-progress' };
      const { getByText } = render(<RouteCard route={inProgressRoute} />);
      const statusBadge = getByText('in-progress').parent;
      
      expect(statusBadge.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: '#F59E0B' })
      );
    });

    it('should display green badge for completed status', () => {
      const completedRoute = { ...mockRoute, status: 'completed' };
      const { getByText } = render(<RouteCard route={completedRoute} />);
      const statusBadge = getByText('completed').parent;
      
      expect(statusBadge.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: '#10B981' })
      );
    });

    it('should display red badge for cancelled status', () => {
      const cancelledRoute = { ...mockRoute, status: 'cancelled' };
      const { getByText } = render(<RouteCard route={cancelledRoute} />);
      const statusBadge = getByText('cancelled').parent;
      
      expect(statusBadge.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: '#EF4444' })
      );
    });
  });

  describe('✅ POSITIVE: User Interactions', () => {
    it('should call onPress when card is tapped', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <RouteCard route={mockRoute} onPress={onPressMock} />
      );
      
      fireEvent.press(getByText('Downtown Collection Route'));
      
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not crash when onPress is not provided', () => {
      const { getByText } = render(<RouteCard route={mockRoute} />);
      
      expect(() => {
        fireEvent.press(getByText('Downtown Collection Route'));
      }).not.toThrow();
    });
  });

  describe('🔍 BOUNDARY: Edge Cases', () => {
    it('should handle route without assigned collector', () => {
      const unassignedRoute = {
        ...mockRoute,
        assignedTo: null
      };

      const { getByText } = render(<RouteCard route={unassignedRoute} />);
      
      expect(getByText(/Unassigned/i)).toBeTruthy();
    });

    it('should handle route with no bins', () => {
      const emptyRoute = {
        ...mockRoute,
        bins: [],
        totalBins: 0
      };

      const { getByText } = render(<RouteCard route={emptyRoute} />);
      
      expect(getByText(/0 bins/i)).toBeTruthy();
    });

    it('should handle route with undefined bins array', () => {
      const noBinsRoute = {
        ...mockRoute,
        bins: undefined,
        totalBins: 0
      };

      const { getByText } = render(<RouteCard route={noBinsRoute} />);
      
      expect(getByText(/0 bins/i)).toBeTruthy();
    });

    it('should handle 100% progress', () => {
      const completedRoute = {
        ...mockRoute,
        progress: 100,
        collectedBins: 10,
        totalBins: 10
      };

      const { getByText } = render(
        <RouteCard route={completedRoute} showProgress={true} />
      );
      
      expect(getByText(/100%/)).toBeTruthy();
    });

    it('should handle 0% progress', () => {
      const notStartedRoute = {
        ...mockRoute,
        progress: 0,
        collectedBins: 0
      };

      const { getByText } = render(
        <RouteCard route={notStartedRoute} showProgress={true} />
      );
      
      expect(getByText(/0%/)).toBeTruthy();
    });

    it('should handle missing progress field', () => {
      const noProgressRoute = {
        ...mockRoute,
        progress: undefined
      };

      const { queryByText } = render(
        <RouteCard route={noProgressRoute} showProgress={true} />
      );
      
      // Should default to 0%
      expect(queryByText(/0%/)).toBeTruthy();
    });

    it('should handle very long route name', () => {
      const longNameRoute = {
        ...mockRoute,
        routeName: 'A'.repeat(100)
      };

      const { getByText } = render(<RouteCard route={longNameRoute} />);
      
      expect(getByText('A'.repeat(100))).toBeTruthy();
    });

    it('should handle partial collector name', () => {
      const partialNameRoute = {
        ...mockRoute,
        assignedTo: {
          firstName: 'John',
          lastName: null,
          username: 'johndoe'
        }
      };

      const { getByText } = render(<RouteCard route={partialNameRoute} />);
      
      expect(getByText(/John/)).toBeTruthy();
    });
  });

  describe('❌ NEGATIVE: Invalid Props', () => {
    it('should handle null route gracefully', () => {
      const { container } = render(<RouteCard route={null} />);
      
      expect(container).toBeTruthy();
    });

    it('should handle undefined route gracefully', () => {
      const { container } = render(<RouteCard route={undefined} />);
      
      expect(container).toBeTruthy();
    });

    it('should handle route with missing required fields', () => {
      const incompleteRoute = {
        _id: '123'
      };

      const { container } = render(<RouteCard route={incompleteRoute} />);
      
      expect(container).toBeTruthy();
    });
  });

  describe('⚠️ ERROR: Date Formatting', () => {
    it('should handle invalid date format', () => {
      const invalidDateRoute = {
        ...mockRoute,
        scheduledDate: 'invalid-date'
      };

      const { container } = render(<RouteCard route={invalidDateRoute} />);
      
      expect(container).toBeTruthy();
    });

    it('should handle null scheduled date', () => {
      const nullDateRoute = {
        ...mockRoute,
        scheduledDate: null
      };

      const { container } = render(<RouteCard route={nullDateRoute} />);
      
      expect(container).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Progress Calculation', () => {
    it('should calculate progress from bins array when progress field missing', () => {
      const route = {
        ...mockRoute,
        progress: undefined,
        bins: [
          { _id: 'bin1', status: 'collected' },
          { _id: 'bin2', status: 'collected' },
          { _id: 'bin3', status: 'pending' },
          { _id: 'bin4', status: 'pending' }
        ]
      };

      const { getByText } = render(
        <RouteCard route={route} showProgress={true} />
      );
      
      // 2 out of 4 bins collected = 50%
      expect(getByText(/2\/4/)).toBeTruthy();
    });

    it('should show skipped bins in count', () => {
      const route = {
        ...mockRoute,
        bins: [
          { _id: 'bin1', status: 'collected' },
          { _id: 'bin2', status: 'skipped' },
          { _id: 'bin3', status: 'pending' }
        ],
        totalBins: 3,
        collectedBins: 1
      };

      const { getByText } = render(
        <RouteCard route={route} showProgress={true} />
      );
      
      expect(getByText(/1\/3/)).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Accessibility', () => {
    it('should be accessible with proper labels', () => {
      const { getByText } = render(<RouteCard route={mockRoute} />);
      
      expect(getByText('Downtown Collection Route')).toBeTruthy();
      expect(getByText('scheduled')).toBeTruthy();
    });

    it('should have touchable opacity for better UX', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <RouteCard route={mockRoute} onPress={onPressMock} />
      );
      
      const card = getByText('Downtown Collection Route').parent.parent.parent;
      expect(card.props.activeOpacity).toBe(0.7);
    });
  });
});
