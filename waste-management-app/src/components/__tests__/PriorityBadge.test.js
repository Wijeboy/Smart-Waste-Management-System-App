/**
 * PriorityBadge Component Tests
 * Tests for the priority badge display component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import PriorityBadge from '../PriorityBadge';
import { COLORS } from '../../constants/theme';

describe('PriorityBadge', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<PriorityBadge priority="high" />);
      expect(getByText('high')).toBeTruthy();
    });

    it('should display the priority text', () => {
      const { getByText } = render(<PriorityBadge priority="normal" />);
      expect(getByText('normal')).toBeTruthy();
    });

    it('should capitalize priority text', () => {
      const { getByText } = render(<PriorityBadge priority="low" />);
      const badge = getByText('low');
      expect(badge).toBeTruthy();
      expect(badge.props.style).toEqual(
        expect.objectContaining({ textTransform: 'capitalize' })
      );
    });
  });

  describe('Priority Levels', () => {
    it('should render high priority badge', () => {
      const { getByText } = render(<PriorityBadge priority="high" />);
      expect(getByText('high')).toBeTruthy();
    });

    it('should render normal priority badge', () => {
      const { getByText } = render(<PriorityBadge priority="normal" />);
      expect(getByText('normal')).toBeTruthy();
    });

    it('should render low priority badge', () => {
      const { getByText } = render(<PriorityBadge priority="low" />);
      expect(getByText('low')).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should apply high priority color for high priority', () => {
      const { getByTestId } = render(<PriorityBadge priority="high" />);
      const badge = getByTestId('priority-badge-high');
      
      expect(badge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: COLORS.badgeHigh })
        ])
      );
    });

    it('should apply normal priority color for normal priority', () => {
      const { getByTestId } = render(<PriorityBadge priority="normal" />);
      const badge = getByTestId('priority-badge-normal');
      
      expect(badge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: COLORS.badgeNormal })
        ])
      );
    });

    it('should apply default color for undefined priority', () => {
      const { getByTestId } = render(<PriorityBadge priority="unknown" />);
      const badge = getByTestId('priority-badge-unknown');
      
      expect(badge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: COLORS.badgeNormal })
        ])
      );
    });

    it('should accept custom style prop', () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = render(
        <PriorityBadge priority="high" style={customStyle} />
      );
      const badge = getByTestId('priority-badge-high');
      
      expect(badge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining(customStyle)
        ])
      );
    });
  });

  describe('Accessibility', () => {
    it('should have accessible testID', () => {
      const { getByTestId } = render(<PriorityBadge priority="high" />);
      expect(getByTestId('priority-badge-high')).toBeTruthy();
    });

    it('should have text that is readable', () => {
      const { getByText } = render(<PriorityBadge priority="high" />);
      const text = getByText('high');
      
      expect(text.props.style).toEqual(
        expect.objectContaining({ color: COLORS.textPrimary })
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty priority', () => {
      const { getByText } = render(<PriorityBadge priority="" />);
      expect(getByText('')).toBeTruthy();
    });

    it('should handle null priority gracefully', () => {
      const { root } = render(<PriorityBadge priority={null} />);
      expect(root).toBeTruthy();
    });

    it('should handle undefined priority gracefully', () => {
      const { root } = render(<PriorityBadge />);
      expect(root).toBeTruthy();
    });
  });
});
