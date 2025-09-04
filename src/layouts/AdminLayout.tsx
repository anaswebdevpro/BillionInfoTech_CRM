import React, { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import Header from '../components/layout/Header';
import { COLORS } from '../constants/colors';
import AdminMobileSidebar from '../components/layout/AdminMobileSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Admin dashboard layout component
 * Provides consistent admin sidebar, header, and content area structure
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    const titleMap: Record<string, string> = {
      '/admin': 'Admin Dashboard',
      '/admin/dashboard': 'Admin Dashboard',
      '/admin/support': 'Admin Support',
      '/admin/users': 'User Management',
      '/admin/accounts': 'Account Management',
      '/admin/transactions': 'Transaction Management',
      '/admin/kyc': 'KYC Management',
      '/admin/reports': 'Reports & Analytics',
      '/admin/settings': 'System Settings',
    };
    return titleMap[path] || 'Admin Panel';
  };

  return (
    <div className={`min-h-screen bg-${COLORS.SECONDARY_BG}`}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      <AdminMobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header
          title={getPageTitle()}
          onMobileMenuClick={() => setIsMobileMenuOpen(true)}
          isAdmin={true}
        />

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
