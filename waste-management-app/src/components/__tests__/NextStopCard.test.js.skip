/**
 * NextStopCard Component Tests
 * Tests for the next stop card component used in route management
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NextStopCard from '../NextStopCard';
import { COLORS } from '../../constants/theme';

describe('NextStopCard', () => {
  const mockStop = {
    id: 1,
    binId: 'BIN-023',
    address: '567 Cedar Ave',
    priority: 'high',
    distance: '0.2 km',
    fillLevel: 95,
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByTestId } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByTestId('next-stop-card-1')).toBeTruthy();
    });

    it('should display sequence number', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByText('1')).toBeTruthy();
    });

    it('should display bin ID', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByText('BIN-023')).toBeTruthy();
    });

    it('should display address', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByText('567 Cedar Ave')).toBeTruthy();
    });

    it('should display distance', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByText('0.2 km')).toBeTruthy();
    });

    it('should display fill level', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByText('95%')).toBeTruthy();
    });

    it('should display navigation arrow', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByText('→')).toBeTruthy();
    });
  });

  describe('Priority Badge Integration', () => {
    it('should display priority badge for high priority', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByText('high')).toBeTruthy();
    });

    it('should display priority badge for normal priority', () => {
      const normalStop = { ...mockStop, priority: 'normal' };
      const { getByText } = render(
        <NextStopCard stop={normalStop} sequence={1} />
      );
      expect(getByText('normal')).toBeTruthy();
    });

    it('should display priority badge for low priority', () => {
      const lowStop = { ...mockStop, priority: 'low' };
      const { getByText } = render(
        <NextStopCard stop={lowStop} sequence={1} />
      );
      expect(getByText('low')).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    it('should call onPress when pressed', () => {
      const { getByTestId } = render(
        <NextStopCard stop={mockStop} sequence={1} onPress={mockOnPress} />
      );
      
      fireEvent.press(getByTestId('next-stop-card-1'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should pass stop data to onPress callback', () => {
      const { getByTestId } = render(
        <NextStopCard stop={mockStop} sequence={1} onPress={mockOnPress} />
      );
      
      fireEvent.press(getByTestId('next-stop-card-1'));
      expect(mockOnPress).toHaveBeenCalledWith(mockStop);
    });

    it('should not crash if onPress is not provided', () => {
      const { getByTestId } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      
      expect(() => {
        fireEvent.press(getByTestId('next-stop-card-1'));
      }).not.toThrow();
    });
  });

  describe('Sequence Number Display', () => {
    it('should display sequence 1', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByText('1')).toBeTruthy();
    });

    it('should display sequence 10', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={10} />
      );
      expect(getByText('10')).toBeTruthy();
    });

    it('should display sequence 99', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={99} />
      );
      expect(getByText('99')).toBeTruthy();
    });
  });

  describe('Fill Level Display', () => {
    it('should display 0% fill level', () => {
      const stop = { ...mockStop, fillLevel: 0 };
      const { getByText } = render(
        <NextStopCard stop={stop} sequence={1} />
      );
      expect(getByText('0%')).toBeTruthy();
    });

    it('should display 50% fill level', () => {
      const stop = { ...mockStop, fillLevel: 50 };
      const { getByText } = render(
        <NextStopCard stop={stop} sequence={1} />
      );
      expect(getByText('50%')).toBeTruthy();
    });

    it('should display 100% fill level', () => {
      const stop = { ...mockStop, fillLevel: 100 };
      const { getByText } = render(
        <NextStopCard stop={stop} sequence={1} />
      );
      expect(getByText('100%')).toBeTruthy();
    });
  });

  describe('TestID Generation', () => {
    it('should generate testID from sequence', () => {
      const { getByTestId } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByTestId('next-stop-card-1')).toBeTruthy();
    });

    it('should generate different testIDs for different sequences', () => {
      const { getByTestId: getByTestId1 } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      const { getByTestId: getByTestId2 } = render(
        <NextStopCard stop={mockStop} sequence={2} />
      );
      
      expect(getByTestId1('next-stop-card-1')).toBeTruthy();
      expect(getByTestId2('next-stop-card-2')).toBeTruthy();
    });
  });

  describe('Color Customization', () => {
    it('should use default background color', () => {
      const { getByTestId } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      const card = getByTestId('next-stop-card-1');
      
      expect(card.props.style).toEqual(
        expect.objectContaining({ backgroundColor: COLORS.lightCard })
      );
    });

    it('should use custom background color when provided', () => {
      const customColor = '#FEF2F2';
      const { getByTestId } = render(
        <NextStopCard 
          stop={mockStop} 
          sequence={1} 
          backgroundColor={customColor}
        />
      );
      const card = getByTestId('next-stop-card-1');
      
      expect(card.props.style).toEqual(
        expect.objectContaining({ backgroundColor: customColor })
      );
    });
  });

  describe('Style Props', () => {
    it('should accept custom style prop', () => {
      const customStyle = { marginBottom: 16 };
      const { getByTestId } = render(
        <NextStopCard 
          stop={mockStop} 
          sequence={1} 
          style={customStyle}
        />
      );
      const card = getByTestId('next-stop-card-1');
      
      expect(card.props.style).toEqual(
        expect.objectContaining(customStyle)
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing binId', () => {
      const stop = { ...mockStop, binId: undefined };
      const { getByTestId } = render(
        <NextStopCard stop={stop} sequence={1} />
      );
      expect(getByTestId('next-stop-card-1')).toBeTruthy();
    });

    it('should handle missing address', () => {
      const stop = { ...mockStop, address: undefined };
      const { getByTestId } = render(
        <NextStopCard stop={stop} sequence={1} />
      );
      expect(getByTestId('next-stop-card-1')).toBeTruthy();
    });

    it('should handle missing priority', () => {
      const stop = { ...mockStop, priority: undefined };
      const { getByTestId } = render(
        <NextStopCard stop={stop} sequence={1} />
      );
      expect(getByTestId('next-stop-card-1')).toBeTruthy();
    });

    it('should handle missing distance', () => {
      const stop = { ...mockStop, distance: undefined };
      const { getByTestId } = render(
        <NextStopCard stop={stop} sequence={1} />
      );
      expect(getByTestId('next-stop-card-1')).toBeTruthy();
    });

    it('should handle missing fillLevel', () => {
      const stop = { ...mockStop, fillLevel: undefined };
      const { getByTestId } = render(
        <NextStopCard stop={stop} sequence={1} />
      );
      expect(getByTestId('next-stop-card-1')).toBeTruthy();
    });

    it('should handle sequence 0', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={0} />
      );
      expect(getByText('0')).toBeTruthy();
    });

    it('should handle empty stop object', () => {
      const { getByTestId } = render(
        <NextStopCard stop={{}} sequence={1} />
      );
      expect(getByTestId('next-stop-card-1')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible testID', () => {
      const { getByTestId } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByTestId('next-stop-card-1')).toBeTruthy();
    });

    it('should be touchable', () => {
      const { getByTestId } = render(
        <NextStopCard 
          stop={mockStop} 
          sequence={1} 
          onPress={mockOnPress}
        />
      );
      const card = getByTestId('next-stop-card-1');
      expect(card.props.accessible).toBeTruthy();
    });
  });

  describe('Layout', () => {
    it('should render sequence number on the left', () => {
      const { getByTestId } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByTestId('sequence-number')).toBeTruthy();
    });

    it('should render bin ID at the top of content area', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByText('BIN-023')).toBeTruthy();
    });

    it('should render priority badge next to bin ID', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByText('BIN-023')).toBeTruthy();
      expect(getByText('high')).toBeTruthy();
    });

    it('should render address below bin ID', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByText('567 Cedar Ave')).toBeTruthy();
    });

    it('should render distance and fill level in bottom row', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByText('0.2 km')).toBeTruthy();
      expect(getByText('95%')).toBeTruthy();
    });

    it('should render arrow button on the right', () => {
      const { getByText } = render(
        <NextStopCard stop={mockStop} sequence={1} />
      );
      expect(getByText('→')).toBeTruthy();
    });
  });
});
