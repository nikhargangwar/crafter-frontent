import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '..';

describe('Home Page', () => {
  it('should render correctly', () => {
    const { asFragment } = render(<Router><Home /></Router>);
    expect(asFragment()).toMatchSnapshot();
  });
});