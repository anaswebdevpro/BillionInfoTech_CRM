import React from "react";
import { useNavigate } from "react-router-dom";
import SignupPage from "../pages/SignupPage/SignupPage";

const SignupPageWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    // Token is already saved in localStorage by SignupPage
    // Just navigate to dashboard
    navigate("/dashboard");
  };

  const onSwitchToLogin = () => {
    navigate("/login");
  };

  return (
    <SignupPage onSignup={handleSignup} onSwitchToLogin={onSwitchToLogin} />
  );
};

export default SignupPageWrapper;
