import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import ServiceName from '..';
import { makeRequest } from '../../../utils';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  makeRequest: {
    makeRequest: jest.fn(),
  },
}));

describe('ServiceName component', () => {
  it('should render correctly', () => {
    const { asFragment } = render(<Router>
      <ServiceName 
        service="Test Service"
        serviceId="123"
        setNodes={() => {}}
        serviceValue="Test Service"
        setServiceValue={jest.fn()}
        setIsEditable={jest.fn()}
      />
    </Router>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the service name', async () => {
    render(<Router>
      <ServiceName 
        service="Test Service"
        serviceId="123"
        setNodes={() => {}}
        serviceValue="Test Service"
        setServiceValue={jest.fn()}
        setIsEditable={jest.fn()}
      />
    </Router>);
    const serviceName = await screen.findByText('Test Service');
    expect(serviceName).toBeInTheDocument();
  });

  it('should render the service name in textfield on double click', async () => {
    render(<Router>
      <ServiceName 
        service="Test Service"
        serviceId="123"
        setNodes={() => {}}
        serviceValue="Test Service"
        setServiceValue={jest.fn()}
        setIsEditable={jest.fn()}
        isEditable={false}
      />
    </Router>);
    const serviceName = await screen.findByText('Test Service');
    fireEvent.doubleClick(serviceName);
    render(<Router>
      <ServiceName 
        service="Test Service"
        serviceId="123"
        setNodes={() => {}}
        serviceValue="Test Service"
        setServiceValue={jest.fn()}
        setIsEditable={jest.fn()}
        isEditable={true}
      />
    </Router>);
    const textField = await screen.findByRole('textbox');
    expect(textField).toBeInTheDocument();
  });

  it('should change the service name on enter', async () => {
    const mockedHandleNameChange = jest.fn();
    render(<Router>
      <ServiceName 
        service="Test Service"
        serviceId="123"
        setNodes={() => {}}
        serviceValue="Test Service"
        setServiceValue={jest.fn()}
        setIsEditable={jest.fn()}
        isEditable={false}
        handleNameChange={mockedHandleNameChange}
      />
    </Router>);
    jest.spyOn(makeRequest, 'makeRequest').mockResolvedValue({});
    const serviceName = await screen.findByText('Test Service');
    fireEvent.doubleClick(serviceName);
    render(<Router>
      <ServiceName 
        service="Test Service"
        serviceId="123"
        setNodes={() => {}}
        serviceValue="Test Service"
        setServiceValue={jest.fn()}
        setIsEditable={jest.fn()}
        isEditable={true}
        handleNameChange={mockedHandleNameChange}
      />
    </Router>);
    const textField = await screen.findByRole('textbox');
    fireEvent.change(textField, { target: { value: 'New Service' } });
    fireEvent.keyPress(textField, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(mockedHandleNameChange).toHaveBeenCalledTimes(1);
  });

  it('should change the service name on click of done icon', async () => {
    const mockedHandleNameChange = jest.fn();
    render(<Router>
      <ServiceName 
        service="Test Service"
        serviceId="123"
        setNodes={() => {}}
        serviceValue="Test Service"
        setServiceValue={jest.fn()}
        setIsEditable={jest.fn()}
        isEditable={false}
      />
    </Router>);
    jest.spyOn(makeRequest, 'makeRequest').mockResolvedValue({});
    const serviceName = await screen.findByText('Test Service');
    fireEvent.doubleClick(serviceName);
    render(<Router>
      <ServiceName 
        service="Test Service"
        serviceId="123"
        setNodes={() => {}}
        serviceValue="Test Service"
        setServiceValue={jest.fn()}
        setIsEditable={jest.fn()}
        isEditable={true}
        handleNameChange={mockedHandleNameChange}
      />
    </Router>);
    const textField = await screen.findByRole('textbox');
    fireEvent.change(textField, { target: { value: 'New Service' } });
    const doneIcon = await screen.findByTestId('done-icon');
    fireEvent.click(doneIcon);
    expect(mockedHandleNameChange).toHaveBeenCalledTimes(1);
  });
});
