import { render, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { MemoryRouter } from 'react-router-dom';
import About from '../About';

describe('About Page', () => {
  it('should render home page', () => {
    const history = createMemoryHistory();
    const { getByTestId } = render(
      <MemoryRouter history={history}>
        <About />
      </MemoryRouter>
    );
    fireEvent.click(getByTestId('home'));
    expect(history.location.pathname).toBe('/');
  });
  it('should render landing page', () => {
    const history = createMemoryHistory();
    const { getByTestId } = render(
      <MemoryRouter history={history}>
        <About />
      </MemoryRouter>
    );
    fireEvent.click(getByTestId('landing'));
    expect(history.location.pathname).toBe('/');
  });
});