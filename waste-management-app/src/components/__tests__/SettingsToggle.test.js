/**
 * SettingsToggle Test Suite
 * Tests the settings toggle component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import SettingsToggle from '../SettingsToggle';

describe('SettingsToggle', () => {
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    render(
      <SettingsToggle
        icon="🔊"
        title="Audio Confirmation"
        description="Play sound on scan success"
        value={true}
        onValueChange={mockOnValueChange}
      />
    );

    expect(screen.getByText('🔊')).toBeTruthy();
    expect(screen.getByText('Audio Confirmation')).toBeTruthy();
    expect(screen.getByText('Play sound on scan success')).toBeTruthy();
  });

  it('displays toggle in ON state when value is true', () => {
    const { getByRole } = render(
      <SettingsToggle
        icon="🔊"
        title="Audio Confirmation"
        description="Play sound on scan success"
        value={true}
        onValueChange={mockOnValueChange}
      />
    );

    const toggle = getByRole('switch');
    expect(toggle.props.value).toBe(true);
  });

  it('displays toggle in OFF state when value is false', () => {
    const { getByRole } = render(
      <SettingsToggle
        icon="🔊"
        title="Audio Confirmation"
        description="Play sound on scan success"
        value={false}
        onValueChange={mockOnValueChange}
      />
    );

    const toggle = getByRole('switch');
    expect(toggle.props.value).toBe(false);
  });

  it('calls onValueChange with opposite value when toggle is pressed', () => {
    const { getByRole } = render(
      <SettingsToggle
        icon="🔊"
        title="Audio Confirmation"
        description="Play sound on scan success"
        value={true}
        onValueChange={mockOnValueChange}
      />
    );

    const toggle = getByRole('switch');
    fireEvent(toggle, 'valueChange', false);

    expect(mockOnValueChange).toHaveBeenCalledWith(false);
  });

  it('calls onValueChange when container is pressed', () => {
    render(
      <SettingsToggle
        icon="🔊"
        title="Audio Confirmation"
        description="Play sound on scan success"
        value={false}
        onValueChange={mockOnValueChange}
      />
    );

    const title = screen.getByText('Audio Confirmation');
    fireEvent.press(title.parent.parent);

    expect(mockOnValueChange).toHaveBeenCalledWith(true);
  });
});
