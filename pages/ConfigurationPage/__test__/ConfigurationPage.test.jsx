import {render ,screen } from '@testing-library/react';
import ConfigurationPage from '../index';
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../../../components', () => ({
  __esModule: true,
  Header: () => <div>Header</div>,
}));

jest.mock('../../../components/Configuration', () => ({
  __esModule: true,
  Configuration: () => <div>Configuration</div>,
}));

describe('Configuration',()=>{
  it('should show configuration text when component is rendered',()=>{
    expect(screen.queryByText('CONFIGURATION')).toBeFalsy();
    render(<Router><ConfigurationPage/></Router>);
    expect(screen.getByText('CONFIGURATION')).toBeTruthy();
  }); 
  // it('should render Backend configuration component when rendered with service value equal to backend',()=>{
  //   render(<Router><ConfigurationPage/></Router>);
  //   const BackendButton = screen.getByTestId('test-backend-button');
  //   fireEvent.click(BackendButton);
  //   expect(screen.queryByText('BACKEND MICROSERVICES')).toBeTruthy();
  // });  
  // it('should render Database configuration component when rendered with service value equal to database',()=>{
  //   render(<Router><ConfigurationPage/></Router>);
  //   const DatabaseButton = screen.getByText('DATABASE');
  //   fireEvent.click(DatabaseButton);
  //   expect(screen.queryByText('DATABASE MICROSERVICES')).toBeTruthy();
  // });  
  // it('should render Frontend configuration component when rendered with service value equal to frontend',()=>{
  //   render(<Router><ConfigurationPage/></Router>);
  //   const FrontendButton = screen.getByText('FRONTEND');
  //   fireEvent.click(FrontendButton);
  //   expect(screen.queryByText('FRONTEND MICROSERVICES')).toBeTruthy();
  // });  
  it('should render correctly and create a snapshot', () => {
    const {asFragment } =  render(<Router> <ConfigurationPage/></Router>);
    expect(asFragment()).toMatchSnapshot();
  });
});