/**
 * CollectionTypeItem Component Tests
 * Tests for the collection type list item component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CollectionTypeItem from '../CollectionTypeItem';
import { COLORS } from '../../constants/theme';

describe('CollectionTypeItem', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByTestId } = render(
        <CollectionTypeItem type="General" count={28} icon="🗑️" />
      );
      expect(getByTestId('collection-type-item-general')).toBeTruthy();
    });

    it('should display the type name', () => {
      const { getByText } = render(
        <CollectionTypeItem type="General" count={28} icon="🗑️" />
      );
      expect(getByText('General')).toBeTruthy();
    });

    it('should display the count', () => {
      const { getByText } = render(
        <CollectionTypeItem type="Recyclable" count={15} icon="♻️" />
      );
      expect(getByText('15')).toBeTruthy();
    });

    it('should display the icon', () => {
      const { getByText } = render(
        <CollectionTypeItem type="Organic" count={12} icon="🍂" />
      );
      expect(getByText('🍂')).toBeTruthy();
    });

    it('should display "Collected today" subtitle', () => {
      const { getByText } = render(
        <CollectionTypeItem type="General" count={28} icon="🗑️" />
      );
      expect(getByText('Collected today')).toBeTruthy();
    });

    it('should display navigation arrow', () => {
      const { getByText } = render(
        <CollectionTypeItem type="General" count={28} icon="🗑️" />
      );
      expect(getByText('→')).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    it('should call onPress when pressed', () => {
      const { getByTestId } = render(
        <CollectionTypeItem 
          type="General" 
          count={28} 
          icon="🗑️"
          onPress={mockOnPress}
        />
      );
      
      fireEvent.press(getByTestId('collection-type-item-general'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should pass type to onPress callback', () => {
      const { getByTestId } = render(
        <CollectionTypeItem 
          type="Recyclable" 
          count={15} 
          icon="♻️"
          onPress={mockOnPress}
        />
      );
      
      fireEvent.press(getByTestId('collection-type-item-recyclable'));
      expect(mockOnPress).toHaveBeenCalledWith('Recyclable');
    });

    it('should not crash if onPress is not provided', () => {
      const { getByTestId } = render(
        <CollectionTypeItem type="General" count={28} icon="🗑️" />
      );
      
      expect(() => {
        fireEvent.press(getByTestId('collection-type-item-general'));
      }).not.toThrow();
    });
  });

  describe('Count Display', () => {
    it('should display zero count', () => {
      const { getByText } = render(
        <CollectionTypeItem type="General" count={0} icon="🗑️" />
      );
      expect(getByText('0')).toBeTruthy();
    });

    it('should display large counts', () => {
      const { getByText } = render(
        <CollectionTypeItem type="General" count={150} icon="🗑️" />
      );
      expect(getByText('150')).toBeTruthy();
    });

    it('should handle string count values', () => {
      const { getByText } = render(
        <CollectionTypeItem type="General" count="28" icon="🗑️" />
      );
      expect(getByText('28')).toBeTruthy();
    });
  });

  describe('TestID Generation', () => {
    it('should generate testID from type', () => {
      const { getByTestId } = render(
        <CollectionTypeItem type="General" count={28} icon="🗑️" />
      );
      expect(getByTestId('collection-type-item-general')).toBeTruthy();
    });

    it('should handle multi-word types', () => {
      const { getByTestId } = render(
        <CollectionTypeItem type="Hazardous Waste" count={5} icon="⚠️" />
      );
      expect(getByTestId('collection-type-item-hazardous-waste')).toBeTruthy();
    });

    it('should handle types with special characters', () => {
      const { getByTestId } = render(
        <CollectionTypeItem type="E-Waste" count={10} icon="🔌" />
      );
      expect(getByTestId('collection-type-item-e-waste')).toBeTruthy();
    });
  });

  describe('Color Customization', () => {
    it('should use default background color', () => {
      const { getByTestId } = render(
        <CollectionTypeItem type="General" count={28} icon="🗑️" />
      );
      const item = getByTestId('collection-type-item-general');
      
      expect(item.props.style).toEqual(
        expect.objectContaining({ backgroundColor: COLORS.lightCard })
      );
    });

    it('should use custom background color when provided', () => {
      const customColor = '#FEF2F2';
      const { getByTestId } = render(
        <CollectionTypeItem 
          type="General" 
          count={28} 
          icon="🗑️"
          backgroundColor={customColor}
        />
      );
      const item = getByTestId('collection-type-item-general');
      
      expect(item.props.style).toEqual(
        expect.objectContaining({ backgroundColor: customColor })
      );
    });

    it('should apply custom icon color', () => {
      const { getByTestId } = render(
        <CollectionTypeItem 
          type="General" 
          count={28} 
          icon="🗑️"
          iconColor="#EF4444"
        />
      );
      expect(getByTestId('collection-type-icon')).toBeTruthy();
    });
  });

  describe('Style Props', () => {
    it('should accept custom style prop', () => {
      const customStyle = { marginVertical: 8 };
      const { getByTestId } = render(
        <CollectionTypeItem 
          type="General" 
          count={28} 
          icon="🗑️"
          style={customStyle}
        />
      );
      const item = getByTestId('collection-type-item-general');
      
      expect(item.props.style).toEqual(
        expect.objectContaining(customStyle)
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined count', () => {
      const { getByTestId } = render(
        <CollectionTypeItem type="General" icon="🗑️" />
      );
      expect(getByTestId('collection-type-item-general')).toBeTruthy();
    });

    it('should handle null count', () => {
      const { getByTestId } = render(
        <CollectionTypeItem type="General" count={null} icon="🗑️" />
      );
      expect(getByTestId('collection-type-item-general')).toBeTruthy();
    });

    it('should handle missing icon', () => {
      const { getByTestId } = render(
        <CollectionTypeItem type="General" count={28} />
      );
      expect(getByTestId('collection-type-item-general')).toBeTruthy();
    });

    it('should handle empty string type', () => {
      const { getByTestId } = render(
        <CollectionTypeItem type="" count={28} icon="🗑️" />
      );
      expect(getByTestId('collection-type-item-')).toBeTruthy();
    });

    it('should handle empty string icon', () => {
      const { getByTestId } = render(
        <CollectionTypeItem type="General" count={28} icon="" />
      );
      expect(getByTestId('collection-type-item-general')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible testID', () => {
      const { getByTestId } = render(
        <CollectionTypeItem type="General" count={28} icon="🗑️" />
      );
      expect(getByTestId('collection-type-item-general')).toBeTruthy();
    });

    it('should have icon testID', () => {
      const { getByTestId } = render(
        <CollectionTypeItem type="General" count={28} icon="🗑️" />
      );
      expect(getByTestId('collection-type-icon')).toBeTruthy();
    });

    it('should be touchable', () => {
      const { getByTestId } = render(
        <CollectionTypeItem 
          type="General" 
          count={28} 
          icon="🗑️"
          onPress={mockOnPress}
        />
      );
      const item = getByTestId('collection-type-item-general');
      expect(item.props.accessible).toBeTruthy();
    });
  });

  describe('Layout', () => {
    it('should render icon on the left', () => {
      const { getByTestId } = render(
        <CollectionTypeItem type="General" count={28} icon="🗑️" />
      );
      expect(getByTestId('collection-type-icon')).toBeTruthy();
    });

    it('should render arrow on the right', () => {
      const { getByText } = render(
        <CollectionTypeItem type="General" count={28} icon="🗑️" />
      );
      expect(getByText('→')).toBeTruthy();
    });

    it('should render type and subtitle in the middle', () => {
      const { getByText } = render(
        <CollectionTypeItem type="General" count={28} icon="🗑️" />
      );
      expect(getByText('General')).toBeTruthy();
      expect(getByText('Collected today')).toBeTruthy();
    });

    it('should render count prominently', () => {
      const { getByText } = render(
        <CollectionTypeItem type="General" count={28} icon="🗑️" />
      );
      const count = getByText('28');
      expect(count).toBeTruthy();
    });
  });
});
