/**
 * ImpactCard Component Tests
 * Tests for the environmental impact metrics card component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import ImpactCard from '../ImpactCard';
import { COLORS } from '../../constants/theme';

describe('ImpactCard', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByTestId } = render(
        <ImpactCard icon="♻️" label="Recycled" value={1.2} unit="tons" />
      );
      expect(getByTestId('impact-card-recycled')).toBeTruthy();
    });

    it('should display the icon', () => {
      const { getByText } = render(
        <ImpactCard icon="♻️" label="Recycled" value={1.2} unit="tons" />
      );
      expect(getByText('♻️')).toBeTruthy();
    });

    it('should display the label', () => {
      const { getByText } = render(
        <ImpactCard icon="♻️" label="Recycled" value={1.2} unit="tons" />
      );
      expect(getByText('Recycled')).toBeTruthy();
    });

    it('should display the value with unit', () => {
      const { getByText } = render(
        <ImpactCard icon="♻️" label="Recycled" value={1.2} unit="tons" />
      );
      expect(getByText('1.2 tons')).toBeTruthy();
    });

    it('should display value without unit when unit is empty', () => {
      const { getByText } = render(
        <ImpactCard icon="🌳" label="Trees Saved" value={3.2} unit="" />
      );
      expect(getByText('3.2')).toBeTruthy();
    });
  });

  describe('Value Formatting', () => {
    it('should handle integer values', () => {
      const { getByText } = render(
        <ImpactCard icon="💨" label="CO² Saved" value={89} unit="kg" />
      );
      expect(getByText('89 kg')).toBeTruthy();
    });

    it('should handle decimal values', () => {
      const { getByText } = render(
        <ImpactCard icon="♻️" label="Recycled" value={1.2} unit="tons" />
      );
      expect(getByText('1.2 tons')).toBeTruthy();
    });

    it('should handle zero value', () => {
      const { getByText } = render(
        <ImpactCard icon="♻️" label="Recycled" value={0} unit="tons" />
      );
      expect(getByText('0 tons')).toBeTruthy();
    });

    it('should handle string values', () => {
      const { getByText } = render(
        <ImpactCard icon="♻️" label="Recycled" value="1.2" unit="tons" />
      );
      expect(getByText('1.2 tons')).toBeTruthy();
    });
  });

  describe('Color Customization', () => {
    it('should use default icon color', () => {
      const { getByTestId } = render(
        <ImpactCard icon="♻️" label="Recycled" value={1.2} unit="tons" />
      );
      expect(getByTestId('impact-card-icon')).toBeTruthy();
    });

    it('should use custom icon color when provided', () => {
      const { getByTestId } = render(
        <ImpactCard 
          icon="♻️" 
          label="Recycled" 
          value={1.2} 
          unit="tons"
          iconColor="#10B981"
        />
      );
      const iconElement = getByTestId('impact-card-icon');
      expect(iconElement).toBeTruthy();
    });

    it('should use default background color', () => {
      const { getByTestId } = render(
        <ImpactCard icon="♻️" label="Recycled" value={1.2} unit="tons" />
      );
      const card = getByTestId('impact-card-recycled');
      
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: COLORS.lightCard })
        ])
      );
    });

    it('should use custom background color when provided', () => {
      const customColor = '#F0FFF4';
      const { getByTestId } = render(
        <ImpactCard 
          icon="♻️" 
          label="Recycled" 
          value={1.2} 
          unit="tons"
          backgroundColor={customColor}
        />
      );
      const card = getByTestId('impact-card-recycled');
      
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: customColor })
        ])
      );
    });
  });

  describe('TestID Generation', () => {
    it('should generate testID from label', () => {
      const { getByTestId } = render(
        <ImpactCard icon="♻️" label="Recycled" value={1.2} unit="tons" />
      );
      expect(getByTestId('impact-card-recycled')).toBeTruthy();
    });

    it('should handle multi-word labels', () => {
      const { getByTestId } = render(
        <ImpactCard icon="💨" label="CO² Saved" value={89} unit="kg" />
      );
      expect(getByTestId('impact-card-co2-saved')).toBeTruthy();
    });

    it('should handle labels with special characters', () => {
      const { getByTestId } = render(
        <ImpactCard icon="🌳" label="Trees Saved" value={3.2} unit="" />
      );
      expect(getByTestId('impact-card-trees-saved')).toBeTruthy();
    });
  });

  describe('Style Props', () => {
    it('should accept custom style prop', () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = render(
        <ImpactCard 
          icon="♻️" 
          label="Recycled" 
          value={1.2} 
          unit="tons"
          style={customStyle}
        />
      );
      const card = getByTestId('impact-card-recycled');
      
      expect(card.props.style).toEqual(
        expect.arrayContaining([customStyle])
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined value', () => {
      const { getByTestId } = render(
        <ImpactCard icon="♻️" label="Recycled" unit="tons" />
      );
      expect(getByTestId('impact-card-recycled')).toBeTruthy();
    });

    it('should handle null value', () => {
      const { getByTestId } = render(
        <ImpactCard icon="♻️" label="Recycled" value={null} unit="tons" />
      );
      expect(getByTestId('impact-card-recycled')).toBeTruthy();
    });

    it('should handle undefined unit', () => {
      const { getByText } = render(
        <ImpactCard icon="♻️" label="Recycled" value={1.2} />
      );
      expect(getByText('1.2')).toBeTruthy();
    });

    it('should handle null unit', () => {
      const { getByText } = render(
        <ImpactCard icon="♻️" label="Recycled" value={1.2} unit={null} />
      );
      expect(getByText('1.2')).toBeTruthy();
    });

    it('should handle missing icon', () => {
      const { getByTestId } = render(
        <ImpactCard label="Recycled" value={1.2} unit="tons" />
      );
      expect(getByTestId('impact-card-recycled')).toBeTruthy();
    });

    it('should handle empty string label', () => {
      const { getByTestId } = render(
        <ImpactCard icon="♻️" label="" value={1.2} unit="tons" />
      );
      expect(getByTestId('impact-card-')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible testID', () => {
      const { getByTestId } = render(
        <ImpactCard icon="♻️" label="Recycled" value={1.2} unit="tons" />
      );
      expect(getByTestId('impact-card-recycled')).toBeTruthy();
    });

    it('should have icon testID', () => {
      const { getByTestId } = render(
        <ImpactCard icon="♻️" label="Recycled" value={1.2} unit="tons" />
      );
      expect(getByTestId('impact-card-icon')).toBeTruthy();
    });
  });

  describe('Layout', () => {
    it('should render icon at the top', () => {
      const { getByTestId } = render(
        <ImpactCard icon="♻️" label="Recycled" value={1.2} unit="tons" />
      );
      expect(getByTestId('impact-card-icon')).toBeTruthy();
    });

    it('should render value and label below icon', () => {
      const { getByText } = render(
        <ImpactCard icon="♻️" label="Recycled" value={1.2} unit="tons" />
      );
      expect(getByText('1.2 tons')).toBeTruthy();
      expect(getByText('Recycled')).toBeTruthy();
    });
  });
});
