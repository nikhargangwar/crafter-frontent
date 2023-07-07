import * as React from 'react';
import { render } from '@testing-library/react';
import CustomBadges from '../customBadges';


describe('CustomBadges', () => {
  it('renders completed badge correctly', () => {
    const { getByText } = render(<CustomBadges status="completed" />);
    const badge = getByText('Completed');
    expect(badge).toBeTruthy();
    //   expect(badge).toHaveClass('MuiChip-colorSuccess');
  });
  
  it('renders pending badge correctly', () => {
    const { getByText } = render(<CustomBadges status="pending" />);
    const badge = getByText('Pending');
    expect(badge).toBeTruthy();
    //   expect(badge).toHaveClass('MuiChip-colorWarning');
  });
  
  it('renders error badge correctly', () => {
    const { getByText } = render(<CustomBadges status="error" />);
    const badge = getByText('Error');
    expect(badge).toBeTruthy();
    //   expect(badge).toHaveClass('MuiChip-colorError');
  });
  
  it('renders status badge correctly', () => {
    const { getByText } = render(<CustomBadges status="unknown" />);
    const badge = getByText('unknown');
    expect(badge).toBeTruthy();
    //   expect(badge).toHaveClass('MuiChip-colorDefault');
  });
});