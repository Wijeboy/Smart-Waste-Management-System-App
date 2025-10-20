/**
 * StatCard Component Tests
 * Tests for the statistics card display component
 */

import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import StatCard from '../StatCard';
import { COLORS } from '../../constants/theme';

describe('StatCard', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByTestId } = render(
        <StatCard label="Completed" value={47} />
      );
      expect(getByTestId('stat-card-completed')).toBeTruthy();
    });

    it('should display the label', () => {
      const { getByText } = render(
        <StatCard label="Remaining" value={25} />
      );
      expect(getByText('Remaining')).toBeTruthy();
    });

    it('should display the value', () => {
      const { getByText } = render(
        <StatCard label="Issues" value={3} />
      );
      expect(getByText('3')).toBeTruthy();
    });

    it('should display string value', () => {
      const { getByText } = render(
        <StatCard label="Efficiency" value="96%" />
      );
      expect(getByText('96%')).toBeTruthy();
    });
  });

  describe('Icon Display', () => {
    it('should display text icon when provided', () => {
      const { getByText } = render(
        <StatCard label="Completed" value={47} icon="✓" />
      );
      expect(getByText('✓')).toBeTruthy();
    });

    it('should display emoji icon when provided', () => {
      const { getByText } = render(
        <StatCard label="Issues" value={3} icon="⚠️" />
      );
      expect(getByText('⚠️')).toBeTruthy();
    });

    it('should not crash when icon is not provided', () => {
      const { getByTestId } = render(
        <StatCard label="Completed" value={47} />
      );
      expect(getByTestId('stat-card-completed')).toBeTruthy();
    });
  });

  describe('Color Customization', () => {
    it('should use default background color', () => {
      const { getByTestId } = render(
        <StatCard label="Completed" value={47} />
      );
      const card = getByTestId('stat-card-completed');
      
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: COLORS.lightCard })
        ])
      );
    });

    it('should use custom background color when provided', () => {
      const customColor = '#3B82F6';
      const { getByTestId } = render(
        <StatCard label="Completed" value={47} backgroundColor={customColor} />
      );
      const card = getByTestId('stat-card-completed');
      
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: customColor })
        ])
      );
    });

    it('should apply icon color when provided', () => {
      const { getByTestId } = render(
        <StatCard 
          label="Completed" 
          value={47} 
          icon="✓" 
          iconColor="#10B981" 
        />
      );
      expect(getByTestId('stat-card-icon')).toBeTruthy();
    });
  });

  describe('Layout Variants', () => {
    it('should render horizontal layout by default', () => {
      const { getByTestId } = render(
        <StatCard label="Completed" value={47} />
      );
      const card = getByTestId('stat-card-completed');
      expect(card).toBeTruthy();
    });

    it('should render vertical layout when specified', () => {
      const { getByTestId } = render(
        <StatCard label="Completed" value={47} layout="vertical" />
      );
      const card = getByTestId('stat-card-completed');
      expect(card).toBeTruthy();
    });
  });

  describe('TestID Generation', () => {
    it('should generate testID from label', () => {
      const { getByTestId } = render(
        <StatCard label="Completed" value={47} />
      );
      expect(getByTestId('stat-card-completed')).toBeTruthy();
    });

    it('should handle multi-word labels in testID', () => {
      const { getByTestId } = render(
        <StatCard label="Total Issues" value={5} />
      );
      expect(getByTestId('stat-card-total-issues')).toBeTruthy();
    });

    it('should handle labels with special characters', () => {
      const { getByTestId } = render(
        <StatCard label="CO² Saved" value={89} />
      );
      expect(getByTestId('stat-card-co2-saved')).toBeTruthy();
    });
  });

  describe('Style Props', () => {
    it('should accept custom style prop', () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = render(
        <StatCard label="Completed" value={47} style={customStyle} />
      );
      const card = getByTestId('stat-card-completed');
      
      expect(card.props.style).toEqual(
        expect.arrayContaining([customStyle])
      );
    });
  });

  describe('Value Types', () => {
    it('should handle number values', () => {
      const { getByText } = render(
        <StatCard label="Completed" value={47} />
      );
      expect(getByText('47')).toBeTruthy();
    });

    it('should handle string values', () => {
      const { getByText } = render(
        <StatCard label="Efficiency" value="96%" />
      );
      expect(getByText('96%')).toBeTruthy();
    });

    it('should handle zero value', () => {
      const { getByText } = render(
        <StatCard label="Issues" value={0} />
      );
      expect(getByText('0')).toBeTruthy();
    });

    it('should handle large numbers', () => {
      const { getByText } = render(
        <StatCard label="Total" value={1234} />
      );
      expect(getByText('1234')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined value', () => {
      const { getByTestId } = render(
        <StatCard label="Completed" />
      );
      expect(getByTestId('stat-card-completed')).toBeTruthy();
    });

    it('should handle null value', () => {
      const { getByTestId } = render(
        <StatCard label="Completed" value={null} />
      );
      expect(getByTestId('stat-card-completed')).toBeTruthy();
    });

    it('should handle empty string label', () => {
      const { getByTestId } = render(
        <StatCard label="" value={47} />
      );
      expect(getByTestId('stat-card-')).toBeTruthy();
    });

    it('should handle empty string value', () => {
      const { getByText } = render(
        <StatCard label="Completed" value="" />
      );
      expect(getByText('')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible testID', () => {
      const { getByTestId } = render(
        <StatCard label="Completed" value={47} />
      );
      expect(getByTestId('stat-card-completed')).toBeTruthy();
    });

    it('should have readable label text', () => {
      const { getByText } = render(
        <StatCard label="Completed" value={47} />
      );
      const label = getByText('Completed');
      expect(label).toBeTruthy();
    });

    it('should have readable value text', () => {
      const { getByText } = render(
        <StatCard label="Completed" value={47} />
      );
      const value = getByText('47');
      expect(value).toBeTruthy();
    });
  });

  describe('Fractional Values', () => {
    it('should display fractional values like "47/72"', () => {
      const { getByText } = render(
        <StatCard label="Completed" value="47/72" />
      );
      expect(getByText('47/72')).toBeTruthy();
    });
  });
});
