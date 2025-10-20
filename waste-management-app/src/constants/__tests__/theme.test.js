/**
 * Theme Constants Tests
 * Tests for color palette and typography configuration
 */

import { COLORS, FONTS } from '../theme';

describe('COLORS', () => {
  describe('Primary Colors', () => {
    it('should have primaryDarkTeal color defined', () => {
      expect(COLORS.primaryDarkTeal).toBe('#005257');
    });

    it('should have accentGreen color defined', () => {
      expect(COLORS.accentGreen).toBe('#34D399');
    });
  });

  describe('Alert & Priority Colors', () => {
    it('should have alertRed color defined', () => {
      expect(COLORS.alertRed).toBe('#EF4444');
    });

    it('should have highPriorityRed color defined', () => {
      expect(COLORS.highPriorityRed).toBe('#F87171');
    });
  });

  describe('Text Colors', () => {
    it('should have textPrimary color defined', () => {
      expect(COLORS.textPrimary).toBe('#FFFFFF');
    });

    it('should have textSecondary color defined', () => {
      expect(COLORS.textSecondary).toBe('#E5E7EB');
    });
  });

  describe('Background Colors', () => {
    it('should have cardBackground color defined', () => {
      expect(COLORS.cardBackground).toBe('#F9FAFB');
    });

    it('should have modalBackground color defined', () => {
      expect(COLORS.modalBackground).toBe('#FFFFFF');
    });
  });

  describe('Progress Bar Colors', () => {
    it('should have progressStart color defined', () => {
      expect(COLORS.progressStart).toBe('#34D399');
    });

    it('should have progressEnd color defined', () => {
      expect(COLORS.progressEnd).toBe('#6EE7B7');
    });
  });

  describe('New Colors for Homepage', () => {
    it('should have lightBackground color defined', () => {
      expect(COLORS.lightBackground).toBeDefined();
      expect(typeof COLORS.lightBackground).toBe('string');
      expect(COLORS.lightBackground).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('should have progressBarBg color defined', () => {
      expect(COLORS.progressBarBg).toBeDefined();
      expect(typeof COLORS.progressBarBg).toBe('string');
    });

    it('should have progressBarFill color defined', () => {
      expect(COLORS.progressBarFill).toBeDefined();
      expect(typeof COLORS.progressBarFill).toBe('string');
    });

    it('should have iconTeal color defined', () => {
      expect(COLORS.iconTeal).toBeDefined();
      expect(typeof COLORS.iconTeal).toBe('string');
    });

    it('should have iconBlue color defined', () => {
      expect(COLORS.iconBlue).toBeDefined();
      expect(typeof COLORS.iconBlue).toBe('string');
    });

    it('should have iconOrange color defined', () => {
      expect(COLORS.iconOrange).toBeDefined();
      expect(typeof COLORS.iconOrange).toBe('string');
    });

    it('should have badgeHigh color defined', () => {
      expect(COLORS.badgeHigh).toBeDefined();
      expect(typeof COLORS.badgeHigh).toBe('string');
    });

    it('should have badgeNormal color defined', () => {
      expect(COLORS.badgeNormal).toBeDefined();
      expect(typeof COLORS.badgeNormal).toBe('string');
    });

    it('should have headerTeal color defined', () => {
      expect(COLORS.headerTeal).toBeDefined();
      expect(typeof COLORS.headerTeal).toBe('string');
      expect(COLORS.headerTeal).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('should have headerCompletedBlue color defined', () => {
      expect(COLORS.headerCompletedBlue).toBeDefined();
      expect(typeof COLORS.headerCompletedBlue).toBe('string');
      expect(COLORS.headerCompletedBlue).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('should have headerEfficiencyGreen color defined', () => {
      expect(COLORS.headerEfficiencyGreen).toBeDefined();
      expect(typeof COLORS.headerEfficiencyGreen).toBe('string');
      expect(COLORS.headerEfficiencyGreen).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('should have appBackground color defined', () => {
      expect(COLORS.appBackground).toBeDefined();
      expect(typeof COLORS.appBackground).toBe('string');
      expect(COLORS.appBackground).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('should have lightCard color defined', () => {
      expect(COLORS.lightCard).toBeDefined();
      expect(typeof COLORS.lightCard).toBe('string');
    });
  });

  describe('Icon Colors', () => {
    it('should have iconGreen color defined for recycling', () => {
      expect(COLORS.iconGreen).toBeDefined();
      expect(typeof COLORS.iconGreen).toBe('string');
    });

    it('should have iconGray color defined for CO2', () => {
      expect(COLORS.iconGray).toBeDefined();
      expect(typeof COLORS.iconGray).toBe('string');
    });
  });
});

describe('FONTS', () => {
  describe('Font Families', () => {
    it('should have primary font family defined', () => {
      expect(FONTS.family.primary).toBe('Inter');
    });

    it('should have fallback font family defined', () => {
      expect(FONTS.family.fallback).toBe('Poppins');
    });
  });

  describe('Font Sizes', () => {
    it('should have heading size defined', () => {
      expect(FONTS.size.heading).toBe(24);
    });

    it('should have subheading size defined', () => {
      expect(FONTS.size.subheading).toBe(18);
    });

    it('should have body size defined', () => {
      expect(FONTS.size.body).toBe(16);
    });

    it('should have small size defined', () => {
      expect(FONTS.size.small).toBe(14);
    });

    it('should have caption size defined for new components', () => {
      expect(FONTS.size.caption).toBeDefined();
      expect(typeof FONTS.size.caption).toBe('number');
      expect(FONTS.size.caption).toBeLessThan(FONTS.size.small);
    });
  });

  describe('Font Weights', () => {
    it('should have regular weight defined', () => {
      expect(FONTS.weight.regular).toBe('400');
    });

    it('should have semiBold weight defined', () => {
      expect(FONTS.weight.semiBold).toBe('600');
    });

    it('should have bold weight defined', () => {
      expect(FONTS.weight.bold).toBe('700');
    });
  });
});

describe('Theme Consistency', () => {
  it('should have all color values as strings', () => {
    Object.values(COLORS).forEach((color) => {
      expect(typeof color).toBe('string');
    });
  });

  it('should have all color values start with #', () => {
    Object.values(COLORS).forEach((color) => {
      expect(color).toMatch(/^#/);
    });
  });

  it('should have all font sizes as numbers', () => {
    Object.values(FONTS.size).forEach((size) => {
      expect(typeof size).toBe('number');
      expect(size).toBeGreaterThan(0);
    });
  });

  it('should have all font weights as strings', () => {
    Object.values(FONTS.weight).forEach((weight) => {
      expect(typeof weight).toBe('string');
    });
  });
});
