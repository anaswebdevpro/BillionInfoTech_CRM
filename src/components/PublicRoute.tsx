import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to appropriate dashboard if already authenticated
  if (isAuthenticated) {
    // If user is admin and trying to access admin login, send to admin dashboard
    const isAdmin = user?.user_type === "admin";
    const attempted = location.pathname || "";

    if (isAdmin && attempted.includes("/afxadmin")) {
      return <Navigate to="/afxadmin/dashboard" replace />;
    }

    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
