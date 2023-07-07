import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ToggleColorMode from '..';
import { ThemeContextProvider } from '../../../contexts/ThemeContext';

describe('ToggleColorMode', () => {
  it('should render correctly', () => {
    const { getByRole } = render(
      <ThemeContextProvider>
        <ToggleColorMode />
      </ThemeContextProvider>
    );

    expect(getByRole('button')).toBeTruthy();
  });

  it('should toggle the theme mode when clicked', () => {
    const { getByRole } = render(
      <ThemeContextProvider>
        <ToggleColorMode />
      </ThemeContextProvider>
    );

    const button = getByRole('button');
    const initialMode = localStorage.getItem('mode');

    fireEvent.click(button);

    expect(localStorage.getItem('mode')).not.toEqual(initialMode);
  });
});
