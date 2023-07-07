import React from 'react';
import { render, fireEvent, screen, waitFor} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../index.jsx';

describe('Sign up', () => {

  it('should render correctly', () => {
    const { asFragment } = render(<BrowserRouter><SignUp/></BrowserRouter>);
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders the otp form', () => {
    const { getByLabelText } = render(<BrowserRouter><SignUp/></BrowserRouter>);

    expect(getByLabelText('Email')).toBeTruthy();

    // expect(getByLabelText('Name')).toBeTruthy();
    // expect(getByLabelText('Email')).toBeTruthy();
    // expect(getByLabelText('Password')).toBeTruthy();
    // expect(getByLabelText('Confirm Passwords')).toBeTruthy();
  });

  test('renders the sign up form after otp button clicked', async() => {
    const { getByLabelText , getByTestId} = render(<BrowserRouter><SignUp/></BrowserRouter>);
    const otpButton = getByTestId('get-otp-button');

    await fireEvent.click(otpButton);

    waitFor(() => {
      expect(getByLabelText('Name')).toBeTruthy();
      expect(getByLabelText('OTP')).toBeTruthy();
      expect(getByLabelText('Email')).toBeTruthy();
      expect(getByLabelText('Password')).toBeTruthy();
      expect(getByLabelText('Confirm Passwords')).toBeTruthy();
    });

    
  });
  
  test('validates the email fields on otp form submission', () => {
    const { getByLabelText, getByTestId } = render(<BrowserRouter><SignUp/></BrowserRouter>);
    const emailInput = getByLabelText('Email');
    const otpButton = getByTestId('get-otp-button');

    // Fill out the form
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    // Submit the form
    fireEvent.click(otpButton);

    // Assert that email and password errors are displayed
    // expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter a Valid Email')).toBeTruthy();
    // expect(passwordInput).toHaveAttribute('aria-invalid', 'true');

  });


  test('validates the password fields on form submission', async () => {
    const { getByLabelText , getByTestId} = render(<BrowserRouter><SignUp/></BrowserRouter>);
    const otpButton = getByTestId('get-otp-button');

    await fireEvent.click(otpButton);

    waitFor(() => {
      const nameInput = getByLabelText('Name');
      const passwordInput = getByLabelText('Password');
      const confirmPasswordInput = getByLabelText('Confirm Passwords');
      const signUpButton = getByTestId('sign-up-button');

      // Fill out the form
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(passwordInput, { target: { value: 'password' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'confirm-password' } });


      // Submit the form
      fireEvent.click(signUpButton);
    });

    // Assert that email and password errors are displayed
    waitFor(() => {
      expect(screen.getByText('Must have minimum 8 char,one letter and one number')).toBeTruthy();
    });
  });

  test('Should check whether password and confirm password are same', async () => {
    const { getByLabelText , getByTestId} = render(<BrowserRouter><SignUp/></BrowserRouter>);
    const otpButton = getByTestId('get-otp-button');

    await fireEvent.click(otpButton);

    waitFor(() => {
      const nameInput = getByLabelText('Name');
      const passwordInput = getByLabelText('Password');
      const confirmPasswordInput = getByLabelText('Confirm Passwords');
      const signUpButton = getByTestId('sign-up-button');

      // Fill out the form
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'confirm-password123' } });


      // Submit the form
      fireEvent.click(signUpButton);
    });

    // Assert that email and password errors are displayed
    waitFor(() => {
      expect(screen.getByText('Password and confirm password must be the same')).toBeTruthy();
    });
  });

 

  // test('Should do nothing when all field are correctly entered', async () => {
  //   const { getByLabelText, getByTestId } = render(<BrowserRouter><SignUp/></BrowserRouter>);
  //   const emailInput = getByLabelText('Email');
  //   const passwordInput = getByLabelText('Password');
  //   const confirmPasswordInput = getByLabelText('Confirm Passwords');
  //   const signUpButton = getByTestId('sign-up-button');

  //   // Fill out the form
  //   fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
  //   fireEvent.change(emailInput, { target: { value: 'abc@gsm.com' } });
  //   fireEvent.change(passwordInput, { target: { value: 'password123' } });
  //   fireEvent.change(confirmPasswordInput, { target: { value: 'confirm-password123' } });

  //   // Submit the form
  //   fireEvent.click(signUpButton);

  //   // Assert that email and password errors are displayed
  //   waitFor(() => {
  //     expect(screen.getByText('Password and confirm password must be the same')).toBeTruthy();
  //   });
  // });




});