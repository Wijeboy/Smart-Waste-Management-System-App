/**
 * ProgressBar Component Tests
 * Tests for the animated progress bar component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from '../ProgressBar';
import { COLORS } from '../../constants/theme';

describe('ProgressBar', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByTestId } = render(<ProgressBar percentage={50} />);
      expect(getByTestId('progress-bar-container')).toBeTruthy();
    });

    it('should render progress bar background', () => {
      const { getByTestId } = render(<ProgressBar percentage={50} />);
      expect(getByTestId('progress-bar-background')).toBeTruthy();
    });

    it('should render progress bar fill', () => {
      const { getByTestId } = render(<ProgressBar percentage={50} />);
      expect(getByTestId('progress-bar-fill')).toBeTruthy();
    });
  });

  describe('Percentage Display', () => {
    it('should show percentage label when showPercentage is true', () => {
      const { getByText } = render(
        <ProgressBar percentage={65} showPercentage={true} />
      );
      expect(getByText('65%')).toBeTruthy();
    });

    it('should not show percentage label when showPercentage is false', () => {
      const { queryByText } = render(
        <ProgressBar percentage={65} showPercentage={false} />
      );
      expect(queryByText('65%')).toBeNull();
    });

    it('should not show percentage label by default', () => {
      const { queryByText } = render(<ProgressBar percentage={65} />);
      expect(queryByText('65%')).toBeNull();
    });
  });

  describe('Progress Width Calculation', () => {
    it('should set correct width for 0% progress', () => {
      const { getByTestId } = render(<ProgressBar percentage={0} />);
      const fill = getByTestId('progress-bar-fill');
      
      expect(fill.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: '0%' })
        ])
      );
    });

    it('should set correct width for 50% progress', () => {
      const { getByTestId } = render(<ProgressBar percentage={50} />);
      const fill = getByTestId('progress-bar-fill');
      
      expect(fill.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: '50%' })
        ])
      );
    });

    it('should set correct width for 100% progress', () => {
      const { getByTestId } = render(<ProgressBar percentage={100} />);
      const fill = getByTestId('progress-bar-fill');
      
      expect(fill.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: '100%' })
        ])
      );
    });

    it('should cap width at 100% for values over 100', () => {
      const { getByTestId } = render(<ProgressBar percentage={150} />);
      const fill = getByTestId('progress-bar-fill');
      
      expect(fill.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: '100%' })
        ])
      );
    });

    it('should handle negative values as 0%', () => {
      const { getByTestId } = render(<ProgressBar percentage={-10} />);
      const fill = getByTestId('progress-bar-fill');
      
      expect(fill.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: '0%' })
        ])
      );
    });
  });

  describe('Color Customization', () => {
    it('should use default background color', () => {
      const { getByTestId } = render(<ProgressBar percentage={50} />);
      const background = getByTestId('progress-bar-background');
      
      expect(background.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: COLORS.progressBarBg })
        ])
      );
    });

    it('should use custom background color when provided', () => {
      const customColor = '#FF0000';
      const { getByTestId } = render(
        <ProgressBar percentage={50} backgroundColor={customColor} />
      );
      const background = getByTestId('progress-bar-background');
      
      expect(background.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: customColor })
        ])
      );
    });

    it('should use default fill color', () => {
      const { getByTestId } = render(<ProgressBar percentage={50} />);
      const fill = getByTestId('progress-bar-fill');
      
      expect(fill.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: COLORS.progressBarFill })
        ])
      );
    });

    it('should use custom fill color when provided', () => {
      const customColor = '#00FF00';
      const { getByTestId } = render(
        <ProgressBar percentage={50} fillColor={customColor} />
      );
      const fill = getByTestId('progress-bar-fill');
      
      expect(fill.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: customColor })
        ])
      );
    });
  });

  describe('Height Customization', () => {
    it('should use default height', () => {
      const { getByTestId } = render(<ProgressBar percentage={50} />);
      const background = getByTestId('progress-bar-background');
      
      expect(background.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ height: 8 })
        ])
      );
    });

    it('should use custom height when provided', () => {
      const { getByTestId } = render(<ProgressBar percentage={50} height={16} />);
      const background = getByTestId('progress-bar-background');
      
      expect(background.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ height: 16 })
        ])
      );
    });
  });

  describe('Style Props', () => {
    it('should accept custom style prop for container', () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <ProgressBar percentage={50} style={customStyle} />
      );
      const container = getByTestId('progress-bar-container');
      
      expect(container.props.style).toEqual(
        expect.arrayContaining([customStyle])
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle decimal percentages', () => {
      const { getByTestId } = render(<ProgressBar percentage={45.7} />);
      const fill = getByTestId('progress-bar-fill');
      
      expect(fill.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: '45.7%' })
        ])
      );
    });

    it('should handle string percentage values', () => {
      const { getByTestId } = render(<ProgressBar percentage="60" />);
      const fill = getByTestId('progress-bar-fill');
      
      // Should convert string to number
      expect(fill.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: '60%' })
        ])
      );
    });

    it('should handle undefined percentage as 0', () => {
      const { getByTestId } = render(<ProgressBar />);
      const fill = getByTestId('progress-bar-fill');
      
      expect(fill.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: '0%' })
        ])
      );
    });

    it('should handle null percentage as 0', () => {
      const { getByTestId } = render(<ProgressBar percentage={null} />);
      const fill = getByTestId('progress-bar-fill');
      
      expect(fill.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: '0%' })
        ])
      );
    });
  });

  describe('Accessibility', () => {
    it('should have accessible testIDs', () => {
      const { getByTestId } = render(<ProgressBar percentage={50} />);
      
      expect(getByTestId('progress-bar-container')).toBeTruthy();
      expect(getByTestId('progress-bar-background')).toBeTruthy();
      expect(getByTestId('progress-bar-fill')).toBeTruthy();
    });
  });
});
