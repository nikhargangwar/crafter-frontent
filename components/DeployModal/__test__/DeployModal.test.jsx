import React from 'react';
import { fireEvent, render, screen} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DeployModal from '..';
import { makeRequest } from '../../../utils';
import { apiEndPoints } from '../../../constants';

describe('DeployModal component', () => {
  it('should render correctly the first window', () => {
    const { asFragment } = render(<Router>
      <DeployModal 
        openModal={true}
        setOpenModal={() => {}}
        blueprintId='1'
        cluster='test'
        version='1'
      />
    </Router>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should display all clusters', async () => {
    jest.spyOn(makeRequest, 'makeRequest').mockResolvedValue([
      {
        id: 1,
        clusterName: 'test name 1',
      },
      {
        id: 2,
        clusterName: 'test name 2',
      }
    ]);
    render(<Router>
      <DeployModal
        openModal={true}
        setOpenModal={() => {}}
        blueprintId='1'
        version='1'
      />
    </Router>);
    const clusterDropdown = screen.getByTestId('ArrowDropDownIcon');
    expect(clusterDropdown).toBeTruthy();
    await fireEvent.click(clusterDropdown);
    const clusters = await screen.findAllByText(/test name/i);
    expect(clusters).toHaveLength(2);
  });
});