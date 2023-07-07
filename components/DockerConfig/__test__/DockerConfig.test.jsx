import { render, fireEvent } from '@testing-library/react';
import DockerConfig from '..';

describe('DockerConfig', () => {
  const mockHandleDockerConfig = jest.fn();

  it('renders with label and value', () => {
    const { getByLabelText } = render(
      <DockerConfig
        Key="testKey"
        dockerConfig="testConfig"
        handleDockerConfig={mockHandleDockerConfig}
        dockerConfigLabel="testConfigLabel"
      />
    );
    const input = getByLabelText('Enter testConfigLabel');
    // expect(input).toBeInTheDocument();
    expect(input.value).toBe('testConfig');
  });

  it('calls handleDockerConfig when value is changed', () => {
    const { getByLabelText } = render(
      <DockerConfig
        Key="testKey"
        dockerConfig="testConfig"
        handleDockerConfig={mockHandleDockerConfig}
        dockerConfigLabel="testConfigLabel"
      />
    );
    const input = getByLabelText('Enter testConfigLabel');
    fireEvent.change(input, { target: { value: 'newTestConfig' } });
    expect(mockHandleDockerConfig).toHaveBeenCalledWith('testKey', 'newTestConfig');
  });
});
