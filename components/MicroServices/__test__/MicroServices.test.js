import React from 'react';
import { render } from '@testing-library/react';
import MicroServices from '../index';
// import {useNavigate} from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
describe('MicroServices', () => {
  it('should render correctly', () => {
    const { container } = render(<MicroServices />);
    expect(container).toMatchSnapshot();
  });
});