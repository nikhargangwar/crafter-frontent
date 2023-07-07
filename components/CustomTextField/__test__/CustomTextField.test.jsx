import {fireEvent, render ,screen ,act} from '@testing-library/react';
import CustomTextField from '..';
import * as React from 'react';

describe('Frontend Configuration',()=>{

  let mock = {
    Key: '0',
    customConfig: {'':''},
    handleCustomConfig:jest.fn(),
  };

  it('should show empty textfield  when component is rendered',()=>{
    expect(screen.queryByTestId('newConfig-key')).toBeFalsy();
    render(<CustomTextField Key={mock.Key} customConfig={mock.customConfig} handleCustomConfig={mock.handleCustomConfig}/>);
    expect(screen.queryByTestId('newConfig-key')).toBeTruthy();
    expect(screen.queryByTestId('newConfig-key').value).toEqual(undefined);
  });

  it('should update newConfigKey when textfield is updated',()=>{
    expect(screen.queryByTestId('newConfig-key')).toBeFalsy();
    render(<CustomTextField Key={mock.Key} customConfig={mock.customConfig} handleCustomConfig={mock.handleCustomConfig}/>);
    expect(screen.queryByTestId('newConfig-key')).toBeTruthy();
    expect(screen.queryByLabelText('Enter Key')).toBeTruthy();
    const configKey = screen.getByTestId('newConfig-key').querySelector('input');
    fireEvent.change(configKey,{target:{value:'name'}});
    expect(screen.queryByDisplayValue('name')).toBeTruthy();
  });

  it('should update newConfigvalue when textfield is updated',()=>{
    expect(screen.queryByTestId('newConfig-value')).toBeFalsy();
    render(<CustomTextField Key={mock.Key} customConfig={mock.customConfig} handleCustomConfig={mock.handleCustomConfig}/>);
    expect(screen.queryByTestId('newConfig-value')).toBeTruthy();
    const configKey = screen.getByTestId('newConfig-value').querySelector('input');
    fireEvent.change(configKey,{target:{value:'name'}});
    expect(screen.queryByDisplayValue('name')).toBeTruthy();
  });

  it('should update customconfig object by calling event passed as prop when textfield is updated',()=>{
    jest.useFakeTimers();
    expect(screen.queryByTestId('newConfig-key')).toBeFalsy();
    render(<CustomTextField Key={mock.Key} customConfig={mock.customConfig} handleCustomConfig={mock.handleCustomConfig}/>);
    expect(screen.queryByTestId('newConfig-key')).toBeTruthy();
    const configKey = screen.getByTestId('newConfig-key').querySelector('input');
    expect(mock.handleCustomConfig).not.toHaveBeenCalled();
    act(() => {
      fireEvent.change(configKey,{target:{value:'name'}});
    });
    jest.advanceTimersByTime(1000);
    expect(mock.handleCustomConfig).toHaveBeenCalledTimes(1);
  });

  it('should display key already exists error when key already exists',()=>{
    jest.useFakeTimers();
    mock = {
      Key: '1',
      customConfig: {
        'name':'shashwath',
        '':'',
      },
      handleCustomConfig:jest.fn(),
    };
    expect(screen.queryByTestId('newConfig-key')).toBeFalsy();
    render(<CustomTextField Key={mock.Key} customConfig={mock.customConfig} handleCustomConfig={mock.handleCustomConfig}/>);
    expect(screen.queryByTestId('newConfig-key')).toBeTruthy();
    const configKey = screen.getByTestId('newConfig-key').querySelector('input');
    fireEvent.change(configKey,{target:{value:'name'}});
    expect(screen.queryByTestId('newConfig-key').querySelector('p')).toBeTruthy();
    expect(screen.queryByTestId('newConfig-key').querySelector('p').textContent).toEqual('This key already exists');
    jest.advanceTimersByTime(1000);
    expect(mock.handleCustomConfig).toHaveBeenCalledTimes(0);
  });
  it('should render correctly and create a snapshot', () => {
    const {asFragment } =  render(<CustomTextField Key={mock.Key} customConfig={mock.customConfig} handleCustomConfig={mock.handleUserConfig}/>);
    expect(asFragment()).toMatchSnapshot();
  });
});