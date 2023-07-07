import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from '..';
import { makeRequest } from '../../../utils';

beforeEach(() => {
  jest.spyOn(JSON, 'parse').mockReturnValue({fullName: 'test'});
});

describe('HomePage', () => {

  it('should render correctly', () => {
    const { asFragment } = render(<Router><HomePage /></Router>);
    expect(asFragment()).toMatchSnapshot();
  });

  describe('Blueprint tab', () => {

    it('should open modal when New Blueprint button is clicked', async () => {
      jest.spyOn(makeRequest, 'makeRequest').mockResolvedValue([]);
      render(<Router><HomePage /></Router>);
      const button = screen.getByTestId('new-button');
      expect(button).toBeTruthy();
      await fireEvent.click(button);
      const modalHeading = screen.findByRole('heading', { name: 'Deployment Stack' });
      expect(modalHeading).toBeTruthy();
    });

    it('should open sidebar when a blueprint is clicked', async () => {
      jest.spyOn(makeRequest, 'makeRequest')
        .mockResolvedValueOnce([
          {
            id:'1',
            blueprintName: 'test',
          }
        ])
        .mockResolvedValueOnce([
          {
            id:'1',
            blueprintName: 'test',
          }
        ])
        .mockResolvedValueOnce({
          metadata: {
            name: 'test',
            description: 'test',
            version: 'test',
          },
          versions: ['test']
        })
        .mockResolvedValue({});
      render(<Router><HomePage /></Router>);
      const blueprint = await screen.findByTestId('recent-blueprints');
      expect(blueprint).toBeTruthy();
      fireEvent.click(blueprint);
      const sidebarHeading = screen.findByRole('heading', { name: 'BLUEPRINT INFORMATION' });
      expect(sidebarHeading).toBeTruthy();  
    });

    it('should display all recent blueprints', async () => {
      jest.spyOn(makeRequest, 'makeRequest').mockResolvedValue([
        {
          id:1,
          blueprintName: 'test1',
        },
        {
          id:2,
          blueprintName: 'test2',
        },
        {
          id:3,
          blueprintName: 'test3',
        },
      ]);
      
      render(<Router><HomePage /></Router>);
      const rows = await screen.findAllByText(/test/);
      expect(rows).toHaveLength(3);
    });
  });

  describe('Cluster tab', () => {
    
    it('should open modal when New Cluster button is clicked', async () => {
      jest.spyOn(makeRequest, 'makeRequest').mockResolvedValue([]);
      render(<Router><HomePage /></Router>);
      const clusterTab = await screen.findByRole('tab', { selected: false });
      fireEvent.click(clusterTab);
      const button = screen.getByTestId('new-button');
      expect(button).toBeTruthy();
      await fireEvent.click(button);
      const modalHeading = screen.findByRole('heading', { name: 'New Cluster' });
      expect(modalHeading).toBeTruthy();
    });
    
    it('should open sidebar when a cluster is clicked', async () => {
      jest.spyOn(makeRequest, 'makeRequest')
        .mockResolvedValueOnce([
          {
            id:'1',
            clusterName: 'test',
          }
        ])
        .mockResolvedValueOnce([
          {
            id:'1',
            clusterName: 'test',
          }
        ])
        .mockResolvedValueOnce({
          metadata: {
            name: 'test',
            description: 'test',
          }
        })
        .mockResolvedValue({});
      render(<Router><HomePage /></Router>);
      const clusterTab = await screen.findByRole('tab', { selected: false });
      fireEvent.click(clusterTab);
      const cluster = await screen.findByTestId('recent-clusters');
      expect(cluster).toBeTruthy();
      fireEvent.click(cluster);
      const sidebarHeading = screen.findByRole('heading', { name: 'CLUSTER INFORMATION' });
      expect(sidebarHeading).toBeTruthy();
    });

    it('should display all clusters', async () => {
      jest.spyOn(makeRequest, 'makeRequest').mockResolvedValue([
        {
          id:1,
          clusterName: 'test1',
        },
        {
          id:2,
          clusterName: 'test2',
        },
        {
          id:3,
          clusterName: 'test3',
        },
      ]);
      render(<Router><HomePage /></Router>);
      const clusterTab = await screen.findByRole('tab', { selected: false });
      fireEvent.click(clusterTab);
      const rows = await screen.findAllByText(/test/);
      expect(rows).toHaveLength(3);
    });
  });
});

