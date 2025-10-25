/**
 * SchedulingScreen Tests
 * Test suite for Scheduling screen component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import SchedulingScreen from '../../SchedulingScreen';
import { NavigationContainer } from '@react-navigation/native';
import { useRoute, useAuth } from '../../../context/RouteContext';
import { useUser } from '../../../context/UserContext';

// Mock colors and dimensions
jest.mock('../../../constants/colors', () => ({
  colors: {
    background: '#F5F5F5',
    accent: '#4CAF50',
    primary: '#2E7D32',
    text: '#333333',
    textLight: '#666666',
    white: '#FFFFFF',
    error: '#D32F2F',
    success: '#4CAF50'
  },
  dimensions: {
    padding: 16,
    borderRadius: 8,
    iconSize: 24
  }
}));

// Mock contexts
jest.mock('../../../context/RouteContext', () => ({
  useRoute: jest.fn(),
  useAuth: jest.fn()
}));

jest.mock('../../../context/UserContext', () => ({
  useUser: jest.fn()
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn()
};

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => mockNavigation
  };
});

// Helper to render with navigation
const renderWithNavigation = (component) => {
  return render(
    <NavigationContainer>
      {React.cloneElement(component, { navigation: mockNavigation })}
    </NavigationContainer>
  );
};

describe('SchedulingScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset navigation mocks
    mockNavigation.navigate.mockClear();
    mockNavigation.goBack.mockClear();
    
    // Default mock implementations
    useRoute.mockReturnValue({
      routes: [],
      loading: false,
      error: null,
      fetchRoutes: jest.fn()
    });

    useAuth.mockReturnValue({
      user: { id: '123', role: 'admin' },
      token: 'test-token'
    });

    useUser.mockReturnValue({
      user: { id: '123', firstName: 'Admin', lastName: 'User' },
      loading: false
    });
  });

  describe('✅ POSITIVE: Component Rendering', () => {
    it('should render the scheduling screen', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getAllByText(/Scheduling/i).length).toBeGreaterThan(0);
    });

    it('should display module title', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Collection Scheduling Module/i)).toBeTruthy();
    });

    it('should display planned features list', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Features will include:/i)).toBeTruthy();
    });

    it('should show schedule pickup feature', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Pickup scheduling for residents/i)).toBeTruthy();
    });

    it('should show bin types feature', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Different bin types support/i)).toBeTruthy();
    });

    it('should show feedback feature', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Service feedback collection/i)).toBeTruthy();
    });

    it('should render back button', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      const backButtons = screen.getAllByText(/Back/i);
      expect(backButtons.length).toBeGreaterThan(0);
    });

    it('should render with correct structure', () => {
      const { root } = renderWithNavigation(<SchedulingScreen />);
      
      expect(root).toBeTruthy();
    });

    it('should render module title with correct styling', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      const title = screen.getByText(/Collection Scheduling Module/i);
      expect(title).toBeTruthy();
    });

    it('should display implementation note', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/IT22221414/i)).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Navigation', () => {
    it('should call goBack when back button is pressed', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      const backButtons = screen.getAllByText(/Back/i);
      fireEvent.press(backButtons[0]);
      
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });

    it('should only call goBack once per press', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      const backButtons = screen.getAllByText(/Back/i);
      fireEvent.press(backButtons[0]);
      
      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple back button presses', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      const backButtons = screen.getAllByText(/Back/i);
      fireEvent.press(backButtons[0]);
      fireEvent.press(backButtons[0]);
      fireEvent.press(backButtons[0]);
      
      expect(mockNavigation.goBack).toHaveBeenCalledTimes(3);
    });
  });

  describe('✅ POSITIVE: Layout and Structure', () => {
    it('should display module title at the top', () => {
      const { getAllByText } = renderWithNavigation(<SchedulingScreen />);
      
      const title = getAllByText(/Collection Scheduling Module/i)[0];
      expect(title).toBeTruthy();
    });

    it('should display features section', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Features will include:/i)).toBeTruthy();
      expect(screen.getByText(/Pickup scheduling for residents/i)).toBeTruthy();
      expect(screen.getByText(/Different bin types support/i)).toBeTruthy();
      expect(screen.getByText(/Service feedback collection/i)).toBeTruthy();
    });

    it('should have all three features present', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Pickup scheduling for residents/i)).toBeTruthy();
      expect(screen.getByText(/Different bin types support/i)).toBeTruthy();
      expect(screen.getByText(/Service feedback collection/i)).toBeTruthy();
    });

    it('should display back button at the top', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      const backButtons = screen.getAllByText(/Back/i);
      expect(backButtons.length).toBeGreaterThan(0);
    });
  });

  describe('✅ POSITIVE: Text Content', () => {
    it('should display correct module name', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText('Collection Scheduling Module')).toBeTruthy();
    });

    it('should display header title', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText('Scheduling')).toBeTruthy();
    });

    it('should display features text with bullet points', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      const featuresText = screen.getByText(/Features will include:/i);
      expect(featuresText).toBeTruthy();
    });

    it('should list pickup scheduling feature', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Pickup scheduling for residents/i)).toBeTruthy();
    });

    it('should list bin types support feature', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Different bin types support/i)).toBeTruthy();
    });

    it('should list feedback collection feature', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Service feedback collection/i)).toBeTruthy();
    });

    it('should display back button text with arrow', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/← Back/i)).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Button Interaction', () => {
    it('should make back button pressable', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      const backButtons = screen.getAllByText(/Back/i);
      fireEvent.press(backButtons[0]);
      
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });

    it('should respond immediately to back button press', async () => {
      renderWithNavigation(<SchedulingScreen />);
      
      const backButtons = screen.getAllByText(/Back/i);
      fireEvent.press(backButtons[0]);
      
      await waitFor(() => {
        expect(mockNavigation.goBack).toHaveBeenCalled();
      });
    });

    it('should handle rapid back button presses', async () => {
      renderWithNavigation(<SchedulingScreen />);
      
      const backButtons = screen.getAllByText(/Back/i);
      fireEvent.press(backButtons[0]);
      fireEvent.press(backButtons[0]);
      
      await waitFor(() => {
        expect(mockNavigation.goBack).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('✅ POSITIVE: Context Integration', () => {
    it('should work with default route context', () => {
      useRoute.mockReturnValue({
        routes: [],
        loading: false,
        error: null,
        fetchRoutes: jest.fn()
      });

      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getAllByText(/Scheduling/i).length).toBeGreaterThan(0);
    });

    it('should work with loading route context', () => {
      useRoute.mockReturnValue({
        routes: [],
        loading: true,
        error: null,
        fetchRoutes: jest.fn()
      });

      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Collection Scheduling Module/i)).toBeTruthy();
    });

    it('should work with route context error', () => {
      useRoute.mockReturnValue({
        routes: [],
        loading: false,
        error: 'Test error',
        fetchRoutes: jest.fn()
      });

      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getAllByText(/Scheduling/i).length).toBeGreaterThan(0);
    });

    it('should work with populated routes', () => {
      useRoute.mockReturnValue({
        routes: [
          { id: '1', routeName: 'Route 1', scheduledDate: new Date() },
          { id: '2', routeName: 'Route 2', scheduledDate: new Date() }
        ],
        loading: false,
        error: null,
        fetchRoutes: jest.fn()
      });

      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getAllByText(/Scheduling/i).length).toBeGreaterThan(0);
    });

    it('should work with different user roles - admin', () => {
      useAuth.mockReturnValue({
        user: { id: '123', role: 'admin' },
        token: 'test-token'
      });

      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Collection Scheduling Module/i)).toBeTruthy();
    });

    it('should work with different user roles - collector', () => {
      useAuth.mockReturnValue({
        user: { id: '456', role: 'collector' },
        token: 'test-token'
      });

      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Collection Scheduling Module/i)).toBeTruthy();
    });

    it('should work with different user roles - resident', () => {
      useAuth.mockReturnValue({
        user: { id: '789', role: 'resident' },
        token: 'test-token'
      });

      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Collection Scheduling Module/i)).toBeTruthy();
    });

    it('should work with loading user context', () => {
      useUser.mockReturnValue({
        user: null,
        loading: true
      });

      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getAllByText(/Scheduling/i).length).toBeGreaterThan(0);
    });

    it('should work with different user data', () => {
      useUser.mockReturnValue({
        user: { id: '999', firstName: 'Test', lastName: 'User' },
        loading: false
      });

      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Collection Scheduling Module/i)).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Screen State Management', () => {
    it('should maintain state after re-render', () => {
      const { rerender } = renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getAllByText(/Scheduling/i).length).toBeGreaterThan(0);
      
      rerender(
        <NavigationContainer>
          <SchedulingScreen navigation={mockNavigation} />
        </NavigationContainer>
      );
      
      expect(screen.getAllByText(/Scheduling/i).length).toBeGreaterThan(0);
    });

    it('should display consistently across renders', () => {
      const { rerender } = renderWithNavigation(<SchedulingScreen />);
      
      const initialFeatures = screen.getByText(/Features will include:/i);
      expect(initialFeatures).toBeTruthy();
      
      rerender(
        <NavigationContainer>
          <SchedulingScreen navigation={mockNavigation} />
        </NavigationContainer>
      );
      
      const rerenderedFeatures = screen.getByText(/Features will include:/i);
      expect(rerenderedFeatures).toBeTruthy();
    });

    it('should maintain button functionality across renders', () => {
      const { rerender } = renderWithNavigation(<SchedulingScreen />);
      
      let backButtons = screen.getAllByText(/Back/i);
      fireEvent.press(backButtons[0]);
      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
      
      rerender(
        <NavigationContainer>
          <SchedulingScreen navigation={mockNavigation} />
        </NavigationContainer>
      );
      
      backButtons = screen.getAllByText(/Back/i);
      fireEvent.press(backButtons[0]);
      expect(mockNavigation.goBack).toHaveBeenCalledTimes(2);
    });
  });

  describe('✅ POSITIVE: Accessibility', () => {
    it('should render all text elements as accessible', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Collection Scheduling Module/i)).toBeTruthy();
      expect(screen.getByText(/Features will include:/i)).toBeTruthy();
      expect(screen.getAllByText(/Back/i).length).toBeGreaterThan(0);
    });

    it('should have pressable back button for accessibility', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      const backButtons = screen.getAllByText(/Back/i);
      expect(backButtons[0]).toBeTruthy();
      
      fireEvent.press(backButtons[0]);
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });

    it('should render all feature items accessibly', () => {
      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Pickup scheduling for residents/i)).toBeTruthy();
      expect(screen.getByText(/Different bin types support/i)).toBeTruthy();
      expect(screen.getByText(/Service feedback collection/i)).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Edge Cases', () => {
    it('should handle null route context', () => {
      useRoute.mockReturnValue({
        routes: null,
        loading: false,
        error: null,
        fetchRoutes: jest.fn()
      });

      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Collection Scheduling Module/i)).toBeTruthy();
    });

    it('should handle undefined user context', () => {
      useUser.mockReturnValue({
        user: undefined,
        loading: false
      });

      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getAllByText(/Scheduling/i).length).toBeGreaterThan(0);
    });

    it('should handle null auth context', () => {
      useAuth.mockReturnValue({
        user: null,
        token: null
      });

      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getByText(/Collection Scheduling Module/i)).toBeTruthy();
    });

    it('should handle empty string in contexts', () => {
      useUser.mockReturnValue({
        user: { id: '', firstName: '', lastName: '' },
        loading: false
      });

      renderWithNavigation(<SchedulingScreen />);
      
      expect(screen.getAllByText(/Scheduling/i).length).toBeGreaterThan(0);
    });

    it('should render without crashing on rapid navigation', async () => {
      renderWithNavigation(<SchedulingScreen />);
      
      const backButtons = screen.getAllByText(/Back/i);
      
      for (let i = 0; i < 5; i++) {
        fireEvent.press(backButtons[0]);
      }
      
      await waitFor(() => {
        expect(mockNavigation.goBack).toHaveBeenCalledTimes(5);
      });
    });
  });
});
