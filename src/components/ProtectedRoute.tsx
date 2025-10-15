import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
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

  // If the route is for admin panel, require admin user_type
  const pathname = location.pathname || "";
  if (pathname.includes("/afxadmin")) {
    if (!isAuthenticated) {
      // If not authenticated, send to admin login
      return (
        <Navigate to="/afxadmin/login" state={{ from: location }} replace />
      );
    }

    // If authenticated but not an admin, deny access
    if (!user || user?.user_type !== "admin") {
      return <Navigate to="/afxadmin/login" state={{ from: location }} replace />;
    }
  }

  // Redirect to login if not authenticated for non-admin routes
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
