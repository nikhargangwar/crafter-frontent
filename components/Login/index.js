import React, { useEffect, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField, Snackbar, Alert } from '@mui/material';
import { FormValidation, makeRequest } from '../../utils';
import { apiEndPoints } from '../../constants';
import icon from '../../assets/crafter-logo-dark.svg';

function Login() {
  const navigate = useNavigate();
  const [loginDetail, setLoginDetail] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState({
    status: false,
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    status: false,
    message: '',
    type: ''
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, status: false });
  };

  const handleSubmit = async () => {
    try {
      if (!FormValidation.validateEmail(loginDetail.email)) {
        setError({
          status: true,
          message: 'Enter a valid email address'
        });
        return;
      }
      const response = await makeRequest.authMakeRequest(apiEndPoints.loginUser(loginDetail.email, loginDetail.password));
      localStorage.setItem('jwt_token', response.token);
      const userDetail = await makeRequest.authMakeRequest(apiEndPoints.validateUser(response.token));
      localStorage.setItem('user_detail', JSON.stringify(userDetail));
      setSnackbar({ status: true, message: 'User Succesfully Login', type: 'success' });
      setTimeout(() => {
        navigate('/home');
        navigate('/home');
      }, 2000);
    } catch (error) {
      if (error.response) {
        setSnackbar({ status: true, message: error.response.data.message, severity: 'warning' });
        return;
      }
      setSnackbar({ status: true, message: 'Something went wrong! Please try again.', severity: 'warning' });
    }
  };
  useEffect(() => {
    if (localStorage.getItem('jwt_token')) {
      navigate('/home');
    }
  }, []);
  return (
    <div className='login'>
      <div className='login-form'>
        <div className="login-form-wrapper">
          <img src={icon} onClick={() => navigate('/')} alt="icon" />
          <p>LOGIN</p>
          <div className='login-form-fields'>
            <TextField error={error.status} autoComplete='off' variant='outlined' label='Email' onChange={(e) => { setError({ status: false, message: '' }); setLoginDetail({ ...loginDetail, email: e.target.value }); }} sx={{ input: { color: 'white', borderRadius: '8px', helperText: { color: 'white' } }, fieldset: { border: '1px solid #18CCCC' } }} className='login-form-field' helperText={error.message} onKeyPress={(event) => { event.key === 'Enter' && handleSubmit(); }} />
            <TextField variant='outlined' label='Password' type='password' onChange={(e) => setLoginDetail({ ...loginDetail, password: e.target.value })} className='login-form-field' sx={{ input: { color: 'white', borderRadius: '8px', helperText: { color: 'white' } }, fieldset: { border: '1px solid #18CCCC' } }} onKeyPress={(event) => { event.key === 'Enter' && handleSubmit(); }} />
          </div>
          <div className='login-form-button-wrapper'>
            <Button disabled={loginDetail.email.length === 0 || loginDetail.password.length === 0} variant='contained' className='login-form-button' onClick={handleSubmit}>LOGIN</Button>
            <h4>Don’t have an account? <Link to={'/register'} style={{ color: '#18CCCC', cursor: 'pointer' }}> Create one now</Link></h4>
          </div >

        </div>
      </div>



      <Snackbar
        open={snackbar.status}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert open={snackbar.status} onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Login;