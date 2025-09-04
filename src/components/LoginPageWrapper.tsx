import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

interface OutletContext {
  isAuthenticated: boolean;
  handleLogin: (token: string) => void;
  handleSignup: (token: string) => void;
  handleLogout: () => void;
}

const LoginPageWrapper: React.FC = () => {
  const { handleLogin } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const onSwitchToSignup = () => {
    navigate('/signup');
  };

  return (
    <LoginPage 
      onLogin={handleLogin} 
      onSwitchToSignup={onSwitchToSignup}
    />
  );
};

export default LoginPageWrapper;
