import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import WelcomeSidebar from '..';
import { makeRequest } from '../../../utils';
import { apiEndPoints } from '../../../constants';

const mockedNavigate = jest.fn();
jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('jwt_token');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

beforeEach(() => {
  jest.spyOn(makeRequest, 'makeRequest').mockResolvedValue({
    metadata: {
      name: 'test',
      description: 'test',
      version: 'test',
    },
    versions: ['test']
  });
});

describe('WelcomeSidebar component', () => {
  const setShowSidebar = jest.fn();
  const selectedBlueprintId = 1;
  const selectedClusterId = 1;

  it('should render correctly', () => {
    const { asFragment } = render(
      <Router>
        <WelcomeSidebar setShowSidebar={setShowSidebar} selectedBlueprintId={selectedBlueprintId}/>
      </Router>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should display blueprint information', async () => {
    render(<Router>
      <WelcomeSidebar setShowSidebar={setShowSidebar} selectedBlueprintId={selectedBlueprintId}/>
    </Router>);
    const rows = await screen.findAllByText('test');
    expect(rows).toHaveLength(3);
  });

  it('should navigate to dashboard when Open Blueprint button is clicked', async () => {
    render(<Router>
      <WelcomeSidebar setShowSidebar={setShowSidebar} selectedBlueprintId={selectedBlueprintId}/>
    </Router>);
    const button = screen.getByRole('button', { name: 'Open Blueprint' });
    await fireEvent.click(button);
    expect(mockedNavigate).toHaveBeenCalledWith(`/dashboard/${selectedBlueprintId}/v/`);
  });

  it('should call setShowSidebar when Close button is clicked', async () => {
    render(<Router>
      <WelcomeSidebar setShowSidebar={setShowSidebar} selectedBlueprintId={selectedBlueprintId}/>
    </Router>);
    const closeButton = screen.getByTestId('CloseIcon');
    await fireEvent.click(closeButton);
    expect(setShowSidebar).toHaveBeenCalledWith(false);
  });

  it('should call make request and close sidebar when delete button is clicked for blueprints ', async () => {
    render(<Router>
      <WelcomeSidebar setShowSidebar={setShowSidebar} selectedBlueprintId={selectedBlueprintId}/>
    </Router>);
    const deleteButton = screen.getByTestId('DeleteIcon');
    await fireEvent.click(deleteButton);
    expect(makeRequest.makeRequest).toHaveBeenLastCalledWith(apiEndPoints.DELETE_BLUEPRINT(selectedBlueprintId), mockedNavigate, undefined);
    expect(setShowSidebar).toHaveBeenCalledWith(false);
  });

  it('should call make request and close sidebar when delete button is clicked for clusters ', async () => {
    render(<Router>
      <WelcomeSidebar setShowSidebar={setShowSidebar} selectedClusterId={selectedClusterId}/>
    </Router>);
    const deleteButton = screen.getByTestId('DeleteIcon');
    await fireEvent.click(deleteButton);
    expect(makeRequest.makeRequest).toHaveBeenLastCalledWith(apiEndPoints.DELETE_CLUSTER(selectedClusterId), mockedNavigate, undefined);
    expect(setShowSidebar).toHaveBeenCalledWith(false);
  });
});