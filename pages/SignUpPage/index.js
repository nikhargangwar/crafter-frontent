import React from 'react';
import './SignUp.css';
import { SignUp, ImageSlider } from '../../components';
import { sliderImages } from '../../constants';

const SignUpPage = () => {
  return (
    <div className='signup-page'>
      <ImageSlider text='Hello' images={sliderImages.signupImages} emoji='🙌' />
      <div className='signup-page-right'>
        <SignUp />
      </div>
    </div>
  );
};

export default SignUpPage;