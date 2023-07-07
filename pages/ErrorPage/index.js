import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../components';
import './ErrorPage.css';

const ErrorPage = ()=>{
  const { errorCode } = useParams();
  return (
    <div>
      <Header/>
      <div className="error-container">
        <p className="error-text">Something went wrong!</p>
        {errorCode && <p className="error-text">Error code:{errorCode}</p>}
      </div>
    </div>
  );
};

export default ErrorPage;
