import React from 'react';
import './LoginPage.css';
import { Login, ImageSlider } from '../../components';
import { sliderImages } from '../../constants'; 

function LoginPage() {
  
  return (
    <div className='login-page'>
      <ImageSlider text='Welcome Back' images={sliderImages.loginImages} emoji='👋' />
      <div className='login-page-right'>
        <Login />
      </div>
    </div>
  );
}

export default LoginPage;
