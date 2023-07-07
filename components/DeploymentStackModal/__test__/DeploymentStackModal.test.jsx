import React from 'react';
import { fireEvent, render, screen} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DeploymentStackModal from '..';
import { makeRequest } from '../../../utils';
import { apiEndPoints } from '../../../constants';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

beforeEach(() => {
  jest.spyOn(makeRequest, 'makeRequest').mockResolvedValue([
    {
      id: 1,
      metadata: {
        name: 'test name 1',
        description: 'test description 1',
      }
    },
    {
      id: 2,
      metadata: {
        name: 'test name 2',
        description: 'test description 2',
      }
    }
  ]);
});

describe('DeploymentStackModal component', () => {
  const setOpenModal = jest.fn();
  const openModal = true;

  it('should render correctly', () => {
    const { asFragment } = render(<Router><DeploymentStackModal setOpenModal={setOpenModal} openModal={openModal} /></Router>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render all components', async () => {
    render(<Router><DeploymentStackModal setOpenModal={setOpenModal} openModal={openModal} /></Router>);
    const names = await screen.findAllByText(/test name/i);
    expect(names).toHaveLength(2);
  });

  it('should call setOpenModal when Close button is clicked', async () => {
    render(<Router><DeploymentStackModal setOpenModal={setOpenModal} openModal={openModal} /></Router>);
    const closeButton = screen.getByTestId('CloseIcon');
    await fireEvent.click(closeButton);
    expect(setOpenModal).toHaveBeenCalledWith(false);
  });

  it('should display next page when Continue button is clicked', async () => {
    render(<Router><DeploymentStackModal setOpenModal={setOpenModal} openModal={openModal} /></Router>);
    const continueButton = screen.getByRole('button', { name: 'Continue' });
    expect(continueButton).toBeTruthy();
    await fireEvent.click(continueButton);
    const nameTextField = screen.getByLabelText(/enter blueprint name/i);
    expect(nameTextField).toBeTruthy();
    const descriptionTextArea = screen.getByLabelText(/enter blueprint description/i);
    expect(descriptionTextArea).toBeTruthy(); 
  });

  it('should send a request to create a new blueprint when Create button is clicked', async () => {
    const mockedDate = new Date(2021, 1, 1);
    jest.spyOn(global, 'Date').mockImplementation(() => mockedDate);
    jest.spyOn(JSON, 'parse').mockReturnValue({ fullName: 'test name' });
    render(<Router><DeploymentStackModal setOpenModal={setOpenModal} openModal={openModal} /></Router>);
    const continueButton = screen.getByRole('button', { name: 'Continue' });
    await fireEvent.click(continueButton);
    const nameTextField = screen.getByLabelText(/enter blueprint name/i);
    await fireEvent.change(nameTextField, { target: { value: 'test name' } });
    const descriptionTextArea = screen.getByLabelText(/enter blueprint description/i);
    await fireEvent.change(descriptionTextArea, { target: { value: 'test description' } });
    const createButton = screen.getByRole('button', { name: 'Create' });
    await fireEvent.click(createButton);
    expect(makeRequest.makeRequest).toHaveBeenLastCalledWith(apiEndPoints.CREATE_BLUEPRINT(), mockedNavigate, null, {
      data: {
        blueprintName: 'test name',
        deploymentStackPlugins: [ undefined, undefined ],
        metadata: {
          name: 'test name',
          description: 'test description',
          createdAt: mockedDate.toLocaleDateString(),
          lastUpdated: mockedDate.toLocaleDateString(),
          author: 'test name'
        },
      }
    });
    expect(makeRequest.makeRequest).toHaveBeenCalledTimes(3);
  });
});
