import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeRequest } from '../../utils';
import { apiEndPoints } from '../../constants';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('jwt_token');
  const navigate = useNavigate();
  useEffect(() => {
    makeRequest.authMakeRequest(apiEndPoints.validateUser(token))
      .then((response) => {
        localStorage.setItem('user_detail', JSON.stringify(response));
      })
      .catch(() => {
        localStorage.clear();
        return navigate('/login');
      });
  }, [localStorage]);
  if (!token) {
    return <Navigate to='/login' replace />;
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired
};

export default ProtectedRoute;
