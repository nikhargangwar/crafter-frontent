import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '..';

describe('Home Page', () => {
  it('should render correctly', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
      case 'user_detail':
        return JSON.stringify({ email: 'abc@gmail.com', fullName: 'name name' });
      default:
        return null;
      }
    });
    const { asFragment } = render(<Router><Header /></Router>);
    expect(asFragment()).toMatchSnapshot();
  });
});
