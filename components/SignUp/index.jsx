/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './SignUp.css';
import { FormValidation, makeRequest } from '../../utils';
import { TextField, Button, Snackbar, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router';
import { apiEndPoints } from '../../constants';
import icon from '../../assets/crafter-logo-dark.svg';
import { Link } from 'react-router-dom';
const SignUp = () => {
  const navigate = useNavigate();
  const [otpGenerated,setOtpGenerated]=useState(true);
  const [email,setEmail]=useState('');

  const [ registerData, setRegisterData ] = useState({
    name: '',
    otp:'',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [emailError,setEmailError]=useState(false);
  const [passwordError,setPasswordError]=useState(false);
  const [confirmPasswordError,setConfirmPasswordError]=useState(false);
  const [ snackbar, setSnackbar ] = useState({
    status: false,
    message: '',
    type: ''
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, status: false });
  };

  const handleOtpSubmit = async () => {
    console.log('otp submit');
    console.log(email);
    try {
      if (!FormValidation.validateEmail(email)) {
        setEmailError(true);
        return;
      }
      setSnackbar({ status: true, message: 'OTP Sent Successfully', severity: 'success' });

      const response = await makeRequest.authMakeRequest(apiEndPoints.generateOtp(email));
      setOtpGenerated(false);
      setEmail(email);

    } catch (error) {
      if(error.response) {
        setSnackbar({ status: true, message: error.response.data.message, severity: 'warning' });
        return;
      }
      setSnackbar({ status: true, message: 'Something went wrong! Please try again.', severity: 'warning' });
    }
  };



  const handleSubmit = async () => {
    try {
    
      if (!FormValidation.validatePassword(registerData.password)) {
        setPasswordError(true);
        return;
      }
    
      if (registerData.password !== registerData.confirmPassword) {
        setConfirmPasswordError(true);
        return;
      }
  
      const response = await makeRequest.authMakeRequest(apiEndPoints.registerUser(registerData.name, registerData.otp,registerData.email, registerData.password));
      setSnackbar({ status: true, message: response.message, severity: 'success' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if(error.response) {
        setSnackbar({ status: true, message: error.response.data.message, severity: 'warning' });
        return;
      }
      setSnackbar({ status: true, message: 'Something went wrong! Please try again.', severity: 'warning' });
    }
  };

  return (
    <div className="sign-up">
      <div className="sign-up-form">
        <div className={otpGenerated ? 'signup-wrapper1' : 'signup-wrapper2'}>
          <img src={icon} onClick={() => navigate('/')} alt="icon" />
          <h1>SIGN UP</h1>
          <div className="sign-up-form-container">
            {
              otpGenerated? (<div className="otp-form">
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1,width: '30ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                 
                  <div>
                    <TextField
                      error={emailError}
                      id="outlined-error"
                      label="Email"
                      value={email}
                      className="sign-up-form-field"
                      helperText={emailError? 'Enter a Valid Email' : ''}
                      sx={{ input: { color: 'white' ,borderRadius:'8px',helperText:{color:'white'}},fieldset:{border:'1px solid #18CCCC',color:'white '} } }
                      onChange={(e) => { setEmailError(false); setEmail(e.target.value); setRegisterData({ ...registerData, email: e.target.value  });}}
                      onKeyPress={(event) => { event.key === 'Enter' && handleOtpSubmit(); }}
                    />
                  </div>

                </Box>
                <div className="button-wrapper">
                  <Button variant='contained' className="get-otp-button" onClick={handleOtpSubmit} data-testid="get-otp-button">GET OTP</Button>
                  <h4>Already have an account? <Link to={'/login'} style={{color:'#18CCCC'}} on> Log in</Link></h4>
                </div>
                  
              </div>):(  <div className="register-form">
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1,width: '30ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextField
                      
                      error={emailError}
                      id="outlined-error"
                      label="Email"
                      value={email}
                      sx={{ input: { color: 'white' ,borderRadius:'8px',helperText:{color:'white'},cursor:'not-allowed'},fieldset:{border:'1px solid white'} } }
                      className="sign-up-form-field disabled-email"
                      helperText={emailError? 'Enter a Valid Email' : ''}
                      onChange={(e) => { setEmailError(false); setRegisterData({ ...registerData, email: email }); }}
                      onKeyPress={(event) => { event.key === 'Enter' && handleSubmit(); }}
                    />
                  </div>
                  <div>
                    <TextField
                      id="outlined-error"
                      label="OTP"
                      value={registerData.otp}
                      className="sign-up-form-field"
                      sx={{ input: { color: 'white' ,borderRadius:'8px',helperText:{color:'white'}},fieldset:{border:'1px solid #18CCCC'} } }
                      onChange={(e) => { setRegisterData({ ...registerData, otp: e.target.value }); }}
                      onKeyPress={(event) => { event.key === 'Enter' && handleSubmit(); }}
                    />
                  </div>
                  <div>
                    <TextField
                      id="outlined-error"
                      label="Name"
                      value={registerData.name}
                      className="sign-up-form-field"
                      sx={{ input: { color: 'white' ,borderRadius:'8px',helperText:{color:'white'}},fieldset:{border:'1px solid #18CCCC'} } }
                      onChange={(e) => { setRegisterData({ ...registerData, name: e.target.value }); }}
                      onKeyPress={(event) => { event.key === 'Enter' && handleSubmit(); }}
                    />
                  </div>
                
                  <div>
                    <TextField
                      error={passwordError}
                      id="outlined-error"
                      label="Password"
                      value={registerData.password}
                      type='password'
                      sx={{ input: { color: 'white' ,borderRadius:'8px',helperText:{color:'white'}},fieldset:{border:'1px solid #18CCCC'} } }
                      className="sign-up-form-field"
                      helperText={passwordError? 'The password must have at least 8 characters long, contains at least one uppercase letter, one lowercase letter and one number' :''}
                      onChange={(e) => { setPasswordError(false); setConfirmPasswordError(false); setRegisterData({ ...registerData, password: e.target.value }); }}
                      onKeyPress={(event) => { event.key === 'Enter' && handleSubmit(); }}
                    />
                  </div>
                  <div>
                    <TextField
                      error={confirmPasswordError}
                      id="outlined-error"
                      label="Confirm Passwords"
                      type='password'
                      sx={{ input: { color: 'white' ,borderRadius:'8px',helperText:{color:'white'}},fieldset:{border:'1px solid #18CCCC'} } }
                      className="sign-up-form-field"
                      value={registerData.confirmPassword}
                      helperText={confirmPasswordError? 'Password and Confirm password must be the same' :''}
                      onChange={(e) => { setPasswordError(false); setConfirmPasswordError(false); setRegisterData({ ...registerData, confirmPassword: e.target.value }); }}
                      onKeyPress={(event) => { event.key === 'Enter' && handleSubmit(); }}
                    />
                  </div>
           
                </Box>
                <div className="button-wrapper">
                  <Button disabled={ registerData.name.length === 0 || passwordError || confirmPasswordError } variant='contained' className="sign-up-button" onClick={handleSubmit} data-testid="sign-up-button">SIGN UP</Button>
                  <h4>Already have an account? <Link to={'/login'} style={{color:'#18CCCC'}} on> Log in</Link></h4>
                </div>
              </div>)
            }
          
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
      </div>
     
      
    </div>
  );
};

export default SignUp;