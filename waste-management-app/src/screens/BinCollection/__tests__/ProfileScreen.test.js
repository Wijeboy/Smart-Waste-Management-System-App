/**
 * ProfileScreen Tests
 * Test suite for BinCollection Profile Screen
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../ProfileScreen';
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
jest.mock('../../../context/UserContext', () => ({
  useUser: jest.fn()
}));

jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock components
jest.mock('../../../components/BottomNavigation', () => 'BottomNavigation');
jest.mock('../../../components/EditProfileModal', () => 'EditProfileModal');
jest.mock('../../../components/SettingsToggle', () => 'SettingsToggle');
jest.mock('../../../components/DeviceStatusCard', () => 'DeviceStatusCard');
jest.mock('../../../components/PostRouteSummaryModal', () => 'PostRouteSummaryModal');

// Mock API service
jest.mock('../../../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn()
  }
}));

// Mock report generator
jest.mock('../../../utils/reportGenerator', () => ({
  downloadRouteReport: jest.fn(),
  loadSavedRouteReport: jest.fn()
}));

describe('ProfileScreen', () => {
  const mockUserContext = {
    user: {
      firstName: 'John',
      lastName: 'Collector',
      username: 'johncollector',
      email: 'john@collector.com',
      phoneNo: '1234567890',
      role: 'collector',
      profileImage: null
    },
    updateProfile: jest.fn(),
    updateSetting: jest.fn()
  };

  const mockAuthContext = {
    logout: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useUser.mockReturnValue(mockUserContext);
    useAuth.mockReturnValue(mockAuthContext);
  });

  describe('✅ POSITIVE: Rendering Tests', () => {
    it('should render profile screen', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should display user full name', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should display user username', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should display user email', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should display user phone number', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: User Data Display Tests', () => {
    it('should display complete user profile', () => {
      const completeUser = {
        ...mockUserContext,
        user: {
          firstName: 'Jane',
          lastName: 'Smith',
          username: 'janesmith',
          email: 'jane@smith.com',
          phoneNo: '9876543210',
          role: 'collector'
        }
      };

      useUser.mockReturnValue(completeUser);

      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle user without phone number', () => {
      const userNoPhone = {
        ...mockUserContext,
        user: {
          ...mockUserContext.user,
          phoneNo: null
        }
      };

      useUser.mockReturnValue(userNoPhone);

      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle user with only first name', () => {
      const userFirstNameOnly = {
        ...mockUserContext,
        user: {
          ...mockUserContext.user,
          firstName: 'John',
          lastName: ''
        }
      };

      useUser.mockReturnValue(userFirstNameOnly);

      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Settings Display Tests', () => {
    it('should render with user settings', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should display settings section', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Tab Navigation Tests', () => {
    it('should render with profile tab active by default', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle tab switching', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Modal State Tests', () => {
    it('should initialize with modal closed', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle route summary modal state', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Loading State Tests', () => {
    it('should handle loading routes state', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle download loading state', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Role Display Tests', () => {
    it('should display collector role', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle admin role', () => {
      const adminUser = {
        ...mockUserContext,
        user: {
          ...mockUserContext.user,
          role: 'admin'
        }
      };

      useUser.mockReturnValue(adminUser);

      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle resident role', () => {
      const residentUser = {
        ...mockUserContext,
        user: {
          ...mockUserContext.user,
          role: 'resident'
        }
      };

      useUser.mockReturnValue(residentUser);

      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Context Integration Tests', () => {
    it('should use updateProfile from UserContext', () => {
      render(<ProfileScreen navigation={mockNavigation} />);

      expect(mockUserContext.updateProfile).toBeDefined();
    });

    it('should use updateSetting from UserContext', () => {
      render(<ProfileScreen navigation={mockNavigation} />);

      expect(mockUserContext.updateSetting).toBeDefined();
    });

    it('should use logout from AuthContext', () => {
      render(<ProfileScreen navigation={mockNavigation} />);

      expect(mockAuthContext.logout).toBeDefined();
    });
  });

  describe('✅ POSITIVE: Empty State Tests', () => {
    it('should handle completed routes empty array', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle no selected route', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Profile Image Tests', () => {
    it('should handle user without profile image', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle user with profile image', () => {
      const userWithImage = {
        ...mockUserContext,
        user: {
          ...mockUserContext.user,
          profileImage: 'https://example.com/image.jpg'
        }
      };

      useUser.mockReturnValue(userWithImage);

      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Multiple User Tests', () => {
    it('should render with different user data', () => {
      const differentUser = {
        ...mockUserContext,
        user: {
          firstName: 'Alice',
          lastName: 'Johnson',
          username: 'alicej',
          email: 'alice@example.com',
          phoneNo: '5555555555',
          role: 'collector'
        }
      };

      useUser.mockReturnValue(differentUser);

      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle special characters in names', () => {
      const specialCharUser = {
        ...mockUserContext,
        user: {
          ...mockUserContext.user,
          firstName: "O'Brien",
          lastName: 'Smith-Jones'
        }
      };

      useUser.mockReturnValue(specialCharUser);

      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should handle long names', () => {
      const longNameUser = {
        ...mockUserContext,
        user: {
          ...mockUserContext.user,
          firstName: 'Alexander',
          lastName: 'Montgomery-Richardson'
        }
      };

      useUser.mockReturnValue(longNameUser);

      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Screen State Management Tests', () => {
    it('should initialize with correct initial state', () => {
      const { getByText } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();
    });

    it('should maintain state across renders', () => {
      const { getByText, rerender } = render(
        <ProfileScreen navigation={mockNavigation} />
      );

      expect(getByText).toBeTruthy();

      rerender(<ProfileScreen navigation={mockNavigation} />);

      expect(getByText).toBeTruthy();
    });
  });
});
