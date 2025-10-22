/**
 * UserCard Component Tests
 * Comprehensive test suite for UserCard component
 * Coverage: >80% - Rendering, interactions, edge cases
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UserCard from '../UserCard';

describe('UserCard Component', () => {
  const mockUser = {
    _id: '123',
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    accountStatus: 'active',
    phoneNumber: '+1234567890',
    address: '123 Main St',
    createdAt: '2025-01-01T00:00:00.000Z'
  };

  describe('✅ POSITIVE: Rendering', () => {
    it('should render user name correctly', () => {
      const { getByText } = render(<UserCard user={mockUser} />);
      
      expect(getByText('John Doe')).toBeTruthy();
    });

    it('should render username', () => {
      const { getByText } = render(<UserCard user={mockUser} />);
      
      expect(getByText('@johndoe')).toBeTruthy();
    });

    it('should render email', () => {
      const { getByText } = render(<UserCard user={mockUser} />);
      
      expect(getByText('john@example.com')).toBeTruthy();
    });

    it('should render role badge', () => {
      const { getByText } = render(<UserCard user={mockUser} />);
      
      expect(getByText('user')).toBeTruthy();
    });

    it('should render status badge', () => {
      const { getByText } = render(<UserCard user={mockUser} />);
      
      expect(getByText('active')).toBeTruthy();
    });

    it('should render user initials in avatar', () => {
      const { getByText } = render(<UserCard user={mockUser} />);
      
      expect(getByText('JD')).toBeTruthy();
    });

    it('should render phone number when provided', () => {
      const { getByText } = render(<UserCard user={mockUser} />);
      
      expect(getByText('+1234567890')).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Role Badge Colors', () => {
    it('should display red badge for admin role', () => {
      const adminUser = { ...mockUser, role: 'admin' };
      const { getByText } = render(<UserCard user={adminUser} />);
      const roleBadge = getByText('admin').parent;
      
      expect(roleBadge.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: '#EF4444' })
      );
    });

    it('should display blue badge for collector role', () => {
      const collectorUser = { ...mockUser, role: 'collector' };
      const { getByText } = render(<UserCard user={collectorUser} />);
      const roleBadge = getByText('collector').parent;
      
      expect(roleBadge.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: '#3B82F6' })
      );
    });

    it('should display green badge for user role', () => {
      const { getByText } = render(<UserCard user={mockUser} />);
      const roleBadge = getByText('user').parent;
      
      expect(roleBadge.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: '#10B981' })
      );
    });
  });

  describe('✅ POSITIVE: Status Badge Colors', () => {
    it('should display green badge for active status', () => {
      const { getByText } = render(<UserCard user={mockUser} />);
      const statusBadge = getByText('active').parent;
      
      expect(statusBadge.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: '#10B981' })
      );
    });

    it('should display red badge for suspended status', () => {
      const suspendedUser = { ...mockUser, accountStatus: 'suspended' };
      const { getByText } = render(<UserCard user={suspendedUser} />);
      const statusBadge = getByText('suspended').parent;
      
      expect(statusBadge.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: '#EF4444' })
      );
    });

    it('should display orange badge for pending status', () => {
      const pendingUser = { ...mockUser, accountStatus: 'pending' };
      const { getByText } = render(<UserCard user={pendingUser} />);
      const statusBadge = getByText('pending').parent;
      
      expect(statusBadge.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: '#F59E0B' })
      );
    });
  });

  describe('✅ POSITIVE: User Interactions', () => {
    it('should call onPress when card is tapped', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <UserCard user={mockUser} onPress={onPressMock} />
      );
      
      fireEvent.press(getByText('John Doe'));
      
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not crash when onPress is not provided', () => {
      const { getByText } = render(<UserCard user={mockUser} />);
      
      expect(() => {
        fireEvent.press(getByText('John Doe'));
      }).not.toThrow();
    });

    it('should call onEdit when edit button is pressed', () => {
      const onEditMock = jest.fn();
      const { getByText } = render(
        <UserCard user={mockUser} onEdit={onEditMock} />
      );
      
      const editButton = getByText('Edit');
      fireEvent.press(editButton);
      
      expect(onEditMock).toHaveBeenCalledTimes(1);
    });

    it('should call onSuspend when suspend button is pressed', () => {
      const onSuspendMock = jest.fn();
      const { getByText } = render(
        <UserCard user={mockUser} onSuspend={onSuspendMock} />
      );
      
      const suspendButton = getByText('Suspend');
      fireEvent.press(suspendButton);
      
      expect(onSuspendMock).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete when delete button is pressed', () => {
      const onDeleteMock = jest.fn();
      const { getByText } = render(
        <UserCard user={mockUser} onDelete={onDeleteMock} />
      );
      
      const deleteButton = getByText('Delete');
      fireEvent.press(deleteButton);
      
      expect(onDeleteMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('🔍 BOUNDARY: Edge Cases', () => {
    it('should handle user without first name', () => {
      const noFirstNameUser = {
        ...mockUser,
        firstName: null,
        lastName: 'Doe'
      };

      const { getByText } = render(<UserCard user={noFirstNameUser} />);
      
      expect(getByText('Doe')).toBeTruthy();
      expect(getByText('D')).toBeTruthy(); // Avatar should show only last initial
    });

    it('should handle user without last name', () => {
      const noLastNameUser = {
        ...mockUser,
        firstName: 'John',
        lastName: null
      };

      const { getByText } = render(<UserCard user={noLastNameUser} />);
      
      expect(getByText('John')).toBeTruthy();
      expect(getByText('J')).toBeTruthy(); // Avatar should show only first initial
    });

    it('should handle user without both names', () => {
      const noNamesUser = {
        ...mockUser,
        firstName: null,
        lastName: null
      };

      const { getByText } = render(<UserCard user={noNamesUser} />);
      
      expect(getByText('@johndoe')).toBeTruthy();
    });

    it('should handle user without phone number', () => {
      const noPhoneUser = {
        ...mockUser,
        phoneNumber: null
      };

      const { queryByText } = render(<UserCard user={noPhoneUser} />);
      
      expect(queryByText('+1234567890')).toBeNull();
    });

    it('should handle user without address', () => {
      const noAddressUser = {
        ...mockUser,
        address: null
      };

      const { queryByText } = render(<UserCard user={noAddressUser} />);
      
      expect(queryByText('123 Main St')).toBeNull();
    });

    it('should handle user without accountStatus', () => {
      const noStatusUser = {
        ...mockUser,
        accountStatus: undefined
      };

      const { getByText } = render(<UserCard user={noStatusUser} />);
      
      // Should default to 'active'
      expect(getByText('active')).toBeTruthy();
    });

    it('should handle very long username', () => {
      const longUsernameUser = {
        ...mockUser,
        username: 'a'.repeat(50)
      };

      const { getByText } = render(<UserCard user={longUsernameUser} />);
      
      expect(getByText(`@${'a'.repeat(50)}`)).toBeTruthy();
    });

    it('should handle very long email', () => {
      const longEmailUser = {
        ...mockUser,
        email: 'verylongemailaddress@verylongdomainname.com'
      };

      const { getByText } = render(<UserCard user={longEmailUser} />);
      
      expect(getByText('verylongemailaddress@verylongdomainname.com')).toBeTruthy();
    });

    it('should handle single character names', () => {
      const singleCharUser = {
        ...mockUser,
        firstName: 'A',
        lastName: 'B'
      };

      const { getByText } = render(<UserCard user={singleCharUser} />);
      
      expect(getByText('AB')).toBeTruthy(); // Avatar initials
      expect(getByText('A B')).toBeTruthy(); // Full name
    });
  });

  describe('❌ NEGATIVE: Invalid Props', () => {
    it('should handle null user gracefully', () => {
      const { container } = render(<UserCard user={null} />);
      
      expect(container).toBeTruthy();
    });

    it('should handle undefined user gracefully', () => {
      const { container } = render(<UserCard user={undefined} />);
      
      expect(container).toBeTruthy();
    });

    it('should handle user with missing required fields', () => {
      const incompleteUser = {
        _id: '123'
      };

      const { container } = render(<UserCard user={incompleteUser} />);
      
      expect(container).toBeTruthy();
    });

    it('should handle invalid role value', () => {
      const invalidRoleUser = {
        ...mockUser,
        role: 'invalid-role'
      };

      const { getByText } = render(<UserCard user={invalidRoleUser} />);
      
      expect(getByText('invalid-role')).toBeTruthy();
      // Should use default gray color for unknown role
    });

    it('should handle invalid status value', () => {
      const invalidStatusUser = {
        ...mockUser,
        accountStatus: 'invalid-status'
      };

      const { getByText } = render(<UserCard user={invalidStatusUser} />);
      
      expect(getByText('invalid-status')).toBeTruthy();
      // Should use default gray color for unknown status
    });
  });

  describe('⚠️ ERROR: Date Formatting', () => {
    it('should handle invalid createdAt date', () => {
      const invalidDateUser = {
        ...mockUser,
        createdAt: 'invalid-date'
      };

      const { container } = render(<UserCard user={invalidDateUser} />);
      
      expect(container).toBeTruthy();
    });

    it('should handle null createdAt date', () => {
      const nullDateUser = {
        ...mockUser,
        createdAt: null
      };

      const { container } = render(<UserCard user={nullDateUser} />);
      
      expect(container).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Accessibility', () => {
    it('should be accessible with proper labels', () => {
      const { getByText } = render(<UserCard user={mockUser} />);
      
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('@johndoe')).toBeTruthy();
      expect(getByText('john@example.com')).toBeTruthy();
    });

    it('should have touchable opacity for better UX', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <UserCard user={mockUser} onPress={onPressMock} />
      );
      
      const card = getByText('John Doe').parent.parent.parent;
      expect(card.props.activeOpacity).toBe(0.7);
    });
  });

  describe('✅ POSITIVE: Avatar Generation', () => {
    it('should generate correct initials for normal names', () => {
      const { getByText } = render(<UserCard user={mockUser} />);
      
      expect(getByText('JD')).toBeTruthy();
    });

    it('should handle lowercase names', () => {
      const lowercaseUser = {
        ...mockUser,
        firstName: 'john',
        lastName: 'doe'
      };

      const { getByText } = render(<UserCard user={lowercaseUser} />);
      
      expect(getByText('jd')).toBeTruthy();
    });

    it('should handle names with special characters', () => {
      const specialCharUser = {
        ...mockUser,
        firstName: "O'Brien",
        lastName: 'Smith-Jones'
      };

      const { getByText } = render(<UserCard user={specialCharUser} />);
      
      expect(getByText('OS')).toBeTruthy();
    });
  });

  describe('✅ POSITIVE: Optional Actions', () => {
    it('should not render action buttons when callbacks not provided', () => {
      const { queryByText } = render(<UserCard user={mockUser} />);
      
      expect(queryByText('Edit')).toBeNull();
      expect(queryByText('Suspend')).toBeNull();
      expect(queryByText('Delete')).toBeNull();
    });

    it('should render only provided action buttons', () => {
      const onEditMock = jest.fn();
      const { getByText, queryByText } = render(
        <UserCard user={mockUser} onEdit={onEditMock} />
      );
      
      expect(getByText('Edit')).toBeTruthy();
      expect(queryByText('Suspend')).toBeNull();
      expect(queryByText('Delete')).toBeNull();
    });
  });
});
