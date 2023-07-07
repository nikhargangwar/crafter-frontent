import { render, fireEvent, screen, within} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ClusterModal from '..';
import { makeRequest } from '../../../utils';
import { apiEndPoints } from '../../../constants';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  makeRequest: {
    makeRequest: jest.fn(),
  },
}));

describe('ClusterModal', () => {
  
  it('should render correctly', () => {
    const { asFragment } = render(<BrowserRouter><ClusterModal/></BrowserRouter>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should make a post request when create button is clicked', async () => {
    const mockedSetOpenModal = jest.fn();
    const mockedDate = new Date(2021, 1, 1);
    jest.spyOn(global, 'Date').mockImplementation(() => mockedDate);
    jest.spyOn(makeRequest, 'makeRequest').mockResolvedValue({});
    render(<BrowserRouter><ClusterModal setOpenModal={mockedSetOpenModal} openModal={true}/></BrowserRouter>);

    const nameTextField = screen.getByLabelText(/name of the cluster/i);
    expect(nameTextField).toBeTruthy();
    fireEvent.change(nameTextField, { target: { value: 'test' } });

    const descriptionTextField = screen.getByLabelText(/description of the cluster/i);
    expect(descriptionTextField).toBeTruthy();
    fireEvent.change(descriptionTextField, { target: { value: 'test' } });

    // const clusterType = screen.getByLabelText(/select cluster/i);
    // expect(clusterType).toBeTruthy();
    // fireEvent.change(clusterType, { target: { value: 'test' } });

    const autocomplete = screen.getByTestId('autocomplete');
    const input = within(autocomplete).getByRole('combobox');
    autocomplete.focus();
    fireEvent.change(input, { target: { value: 'AWS EKS' } });
    fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
    fireEvent.keyDown(autocomplete, { key: 'Enter' });

    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeTruthy();
    fireEvent.click(submitButton);

    expect(makeRequest.makeRequest).toHaveBeenCalledWith(
      apiEndPoints.CREATE_CLUSTER(),
      mockNavigate,
      null,
      {
        data:
        {
          clusterName: 'test',
          metadata: {
            description : 'test',
            clusterType: 'AWS EKS',
            createdAt: mockedDate.toLocaleDateString(),
            lastUpdated: mockedDate.toLocaleDateString(),
          }
        }
      }
    );
  });

  it('should call setOpenModal when Close button is clicked', async () => {
    const mockedSetOpenModal = jest.fn();
    render(<BrowserRouter><ClusterModal setOpenModal={mockedSetOpenModal} openModal={true}/></BrowserRouter>);
    const closeButton = screen.getByTestId('CloseIcon');
    await fireEvent.click(closeButton);
    expect(mockedSetOpenModal).toHaveBeenCalledWith(false);
  });
});
