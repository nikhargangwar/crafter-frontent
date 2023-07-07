import { BrowserRouter as Router } from 'react-router-dom';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import TaskTable from '..';
import { makeRequest } from '../../../utils';

jest.mock('../../../utils', () => ({
  makeRequest: {
    makeRequest: jest.fn(),
  },
}));
jest.mock('downloadjs', () => jest.fn());

describe('TaskTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders table rows correctly', async () => {
    const mockData = [
      {
        blueprintId: 1,
        blueprintName: 'Blueprint 1',
        blueprintVersion: '1.0',
        status: 'completed',
        ttl: 3600,
        type: 'blueprint-export',
        url: 'blueprint1.zip',
      },
      {
        blueprintId: 2,
        blueprintName: 'Blueprint 2',
        blueprintVersion: '2.0',
        status: 'pending',
        ttl: -1,
        type: 'other-type',
      },
      {
        blueprintId: 3,
        blueprintName: 'Blueprint 3',
        blueprintVersion: '3.0',
        status: 'pending',
        ttl: 119,
        type: 'other-type',
      },
      {
        blueprintId: 4,
        blueprintName: 'Blueprint 4',
        blueprintVersion: '2.0',
        status: 'pending',
        ttl: 86400,
        type: 'other-type',
      },
      {
        blueprintId: 5,
        blueprintName: 'Blueprint 5',
        blueprintVersion: '2.0',
        status: 'pending',
        ttl: 120,
        type: 'other-type',
      },
    ];

    makeRequest.makeRequest.mockResolvedValue(mockData);

    render(<Router><TaskTable /></Router>);

    // Wait for data to load
    await screen.findByText('Blueprint 1');

    // Check if table rows are rendered correctly
    expect(screen.getByText('Blueprint 1')).toBeTruthy();
  });

});
