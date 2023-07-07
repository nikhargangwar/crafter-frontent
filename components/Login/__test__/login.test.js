import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import SignUp from '../index.js';
describe('Sign up', () => {
  it('should render correctly', () => {
    const { asFragment } = render(<BrowserRouter><SignUp/></BrowserRouter>);
    expect(asFragment()).toMatchSnapshot();
  });
});