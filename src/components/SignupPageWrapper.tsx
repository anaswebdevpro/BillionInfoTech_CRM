import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SignupPage from '../pages/SignupPage';

interface OutletContext {
  isAuthenticated: boolean;
  handleLogin: (token: string) => void;
  handleSignup: (token: string) => void;
  handleLogout: () => void;
}

const SignupPageWrapper: React.FC = () => {
  const { handleSignup } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const onSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <SignupPage 
      onSignup={handleSignup} 
      onSwitchToLogin={onSwitchToLogin}
    />
  );
};

export default SignupPageWrapper;
