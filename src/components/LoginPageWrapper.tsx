import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

const LoginPageWrapper: React.FC = () => {
  const navigate = useNavigate();

  const onSwitchToSignup = () => {
    navigate('/signup');
  };

  return (
    <LoginPage 
      onSwitchToSignup={onSwitchToSignup}
    />
  );
};

export default LoginPageWrapper;
