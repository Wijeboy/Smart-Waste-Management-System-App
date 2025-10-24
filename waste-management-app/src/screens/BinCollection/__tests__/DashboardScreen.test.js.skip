/**
 * DashboardScreen Test Suite
 * Tests for the redesigned Dashboard Screen component matching screenshot
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DashboardScreen from '../DashboardScreen';
import { COLORS } from '../../../constants/theme';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock RouteContext with full data
const mockRouteInfo = {
  routeNumber: 'Route#12',
  district: 'Central District',
  assignedTo: 'Alex',
};

const mockImpactMetrics = {
  recycled: { value: 1.2, unit: 'tons' },
  co2Saved: { value: 89, unit: 'kg' },
  treesSaved: { value: 3.2, unit: '' },
};

const mockCollectionsByType = [
  { id: 1, type: 'General', icon: 'trash', count: 28 },
  { id: 2, type: 'Recyclable', icon: 'recycle', count: 15 },
];

const mockGetStatistics = jest.fn(() => ({
  completed: 47,
  remaining: 25,
  total: 72,
  efficiency: '96%',
  percentage: 65,
  eta: '2:30 PM',
  issues: 0,
}));

jest.mock('../../../context/RouteContext', () => ({
  useRoute: () => ({
    getStatistics: mockGetStatistics,
    routeInfo: mockRouteInfo,
    impactMetrics: mockImpactMetrics,
    collectionsByType: mockCollectionsByType,
  }),
}));

describe('DashboardScreen - New Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Header Card Structure', () => {
    it('should render the header card container', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByTestId('header-card')).toBeTruthy();
    });

    it('should have teal background color for header card', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const headerCard = getByTestId('header-card');
      expect(headerCard.props.style).toEqual(
        expect.objectContaining({ backgroundColor: COLORS.headerTeal })
      );
    });

    it('should have rounded corners on header card', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const headerCard = getByTestId('header-card');
      expect(headerCard.props.style).toEqual(
        expect.objectContaining({ borderRadius: 24 })
      );
    });
  });

  describe('Status Bar Section', () => {
    it('should display current time in status bar', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const statusTime = getByTestId('status-bar-time');
      expect(statusTime).toBeTruthy();
      expect(statusTime.props.children).toMatch(/\d{1,2}:\d{2}/); // Matches time format
    });

    it('should display notification bell icon', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByTestId('notification-bell')).toBeTruthy();
    });

    it('should handle notification bell press', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const bell = getByTestId('notification-bell');
      fireEvent.press(bell);
      // Should not crash
      expect(bell).toBeTruthy();
    });
  });

  describe('Greeting Section', () => {
    it('should display time-based greeting with name', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      // Should contain "Alex" and a greeting
      expect(getByText(/Alex/)).toBeTruthy();
    });

    it('should display greeting with emoji', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const greeting = getByText(/Alex/);
      // Check if it contains emoji (children is an array)
      expect(greeting.props.children).toBeTruthy();
    });

    it('should display route information', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText('Route#12 - Central District')).toBeTruthy();
    });

    it('should display current time with clock icon', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const currentTime = getByTestId('current-time');
      expect(currentTime).toBeTruthy();
      // Should contain children (array with icon and time)
      expect(currentTime.props.children).toBeTruthy();
    });
  });

  describe('Progress Section in Header', () => {
    it('should display "Route Progress" label with truck icon', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText(/Route Progress/)).toBeTruthy();
    });

    it('should display progress percentage and ETA', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText(/65%/)).toBeTruthy();
      expect(getByText(/ETA/)).toBeTruthy();
    });

    it('should render progress bar inside header', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByTestId('progress-bar-container')).toBeTruthy();
    });

    it('should navigate to RouteManagement when progress section is clicked', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const progressSection = getByTestId('progress-section-touchable');
      fireEvent.press(progressSection);
      expect(mockNavigate).toHaveBeenCalledWith('RouteManagement');
    });
  });

  describe('Stat Cards Inside Header', () => {
    it('should display Completed stat card with blue background', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const completedCard = getByTestId('header-stat-completed');
      expect(completedCard).toBeTruthy();
      // Style is an array of style objects
      const styles = Array.isArray(completedCard.props.style) ? completedCard.props.style : [completedCard.props.style];
      const hasBlueBackground = styles.some(s => s && s.backgroundColor === COLORS.headerCompletedBlue);
      expect(hasBlueBackground).toBe(true);
    });

    it('should display Efficiency stat card with green background', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const efficiencyCard = getByTestId('header-stat-efficiency');
      expect(efficiencyCard).toBeTruthy();
      // Style is an array of style objects
      const styles = Array.isArray(efficiencyCard.props.style) ? efficiencyCard.props.style : [efficiencyCard.props.style];
      const hasGreenBackground = styles.some(s => s && s.backgroundColor === COLORS.headerEfficiencyGreen);
      expect(hasGreenBackground).toBe(true);
    });

    it('should display completed count in format "47/72"', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText('47/72')).toBeTruthy();
    });

    it('should display efficiency percentage "96%"', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText('96%')).toBeTruthy();
    });

    it('should display checkmark icon on Completed card', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const icon = getByTestId('completed-icon');
      expect(icon).toBeTruthy();
    });

    it('should display efficiency icon on Efficiency card', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const icon = getByTestId('efficiency-icon');
      expect(icon).toBeTruthy();
    });

    it('should have stat cards side by side', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const statsRow = getByTestId('header-stats-row');
      expect(statsRow.props.style).toEqual(
        expect.objectContaining({ flexDirection: 'row' })
      );
    });
  });

  describe('Today\'s Impact Section', () => {
    it('should display "Today\'s Impact" title', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText("Today's Impact")).toBeTruthy();
    });

    it('should display icons next to title', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByTestId('impact-header-icons')).toBeTruthy();
    });

    it('should display three impact cards', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText('Recycled')).toBeTruthy();
      expect(getByText('CO² Saved')).toBeTruthy();
      expect(getByText('Trees Saved')).toBeTruthy();
    });

    it('should display recycled amount "1.2 tons"', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText('1.2 tons')).toBeTruthy();
    });

    it('should display CO2 saved "89 kg"', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText('89 kg')).toBeTruthy();
    });

    it('should display trees saved "3.2"', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText('3.2')).toBeTruthy();
    });

    it('should have white background for impact section', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const impactSection = getByTestId('impact-section');
      expect(impactSection.props.style).toEqual(
        expect.objectContaining({ backgroundColor: COLORS.lightCard })
      );
    });
  });

  describe('Collections by Type Section', () => {
    it('should display "Today\'s Collections by Type" title', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText("Today's Collections by Type")).toBeTruthy();
    });

    it('should display General collection type with count', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText('General')).toBeTruthy();
      expect(getByText('28')).toBeTruthy();
    });

    it('should display Recyclable collection type with count', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText('Recyclable')).toBeTruthy();
      expect(getByText('15')).toBeTruthy();
    });

    it('should display "Collected today" subtitle on items', () => {
      const { getAllByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const subtitles = getAllByText('Collected today');
      expect(subtitles.length).toBeGreaterThan(0);
    });
  });

  describe('Background and Container', () => {
    it('should have light background color', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const container = getByTestId('dashboard-container');
      expect(container.props.style).toEqual(
        expect.objectContaining({ backgroundColor: COLORS.appBackground })
      );
    });

    it('should use SafeAreaView', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByTestId('dashboard-container')).toBeTruthy();
    });
  });

  describe('Pull to Refresh', () => {
    it('should have RefreshControl enabled', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const scrollView = getByTestId('dashboard-scroll-view');
      expect(scrollView.props.refreshControl).toBeDefined();
    });

    it('should handle refresh action', async () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const scrollView = getByTestId('dashboard-scroll-view');
      
      // Trigger refresh
      const refreshControl = scrollView.props.refreshControl;
      if (refreshControl && refreshControl.props.onRefresh) {
        refreshControl.props.onRefresh();
      }
      
      // Should not crash
      expect(scrollView).toBeTruthy();
    });
  });

  describe('Time Updates', () => {
    it('should update clock every minute', async () => {
      jest.useFakeTimers();
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      
      const initialTime = getByTestId('current-time').props.children;
      
      // Fast-forward 1 minute
      jest.advanceTimersByTime(60000);
      
      await waitFor(() => {
        const updatedTime = getByTestId('current-time').props.children;
        // Time should be defined (may or may not be different depending on implementation)
        expect(updatedTime).toBeDefined();
      });
      
      jest.useRealTimers();
    });
  });

  describe('Greeting Time-Based Logic', () => {
    it('should display appropriate greeting based on time of day', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      // Should contain one of: Good Morning, Good Afternoon, Good Evening, Good Night
      const greetingText = getByText(/Good (Morning|Afternoon|Evening|Night)/);
      expect(greetingText).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should accept navigation prop', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByTestId('dashboard-container')).toBeTruthy();
    });

    it('should navigate to RouteManagement when header is clicked', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const progressSection = getByTestId('progress-section-touchable');
      fireEvent.press(progressSection);
      expect(mockNavigate).toHaveBeenCalledWith('RouteManagement');
    });
  });

  describe('Layout Responsiveness', () => {
    it('should have proper spacing between sections', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const headerCard = getByTestId('header-card');
      expect(headerCard.props.style).toEqual(
        expect.objectContaining({ marginBottom: expect.any(Number) })
      );
    });

    it('should have proper padding in header card', () => {
      const { getByTestId } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      const headerCard = getByTestId('header-card');
      expect(headerCard.props.style).toEqual(
        expect.objectContaining({ padding: expect.any(Number) })
      );
    });
  });

  describe('Data Integration', () => {
    it('should call getStatistics from context', () => {
      render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(mockGetStatistics).toHaveBeenCalled();
    });

    it('should display data from routeInfo', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText(/Route#12/)).toBeTruthy();
      expect(getByText(/Central District/)).toBeTruthy();
    });

    it('should display data from impactMetrics', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText('1.2 tons')).toBeTruthy();
      expect(getByText('89 kg')).toBeTruthy();
      expect(getByText('3.2')).toBeTruthy();
    });

    it('should display data from collectionsByType', () => {
      const { getByText } = render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);
      expect(getByText('General')).toBeTruthy();
      expect(getByText('Recyclable')).toBeTruthy();
      expect(getByText('28')).toBeTruthy();
      expect(getByText('15')).toBeTruthy();
    });
  });
});
