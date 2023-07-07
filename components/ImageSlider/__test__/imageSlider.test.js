import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import ImageSlider from '../index.js';
describe('ImageSlider up', () => {
  it('should render correctly', () => {
    const mockProps = { 
      text: 'text', 
      images: ['1', '2'], 
      emoji: 'emoji' 
    };
    const { asFragment } = render(<BrowserRouter><ImageSlider {...mockProps}/></BrowserRouter>);
    expect(asFragment()).toMatchSnapshot();
  });
});