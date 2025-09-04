import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import LoginPageWrapper from '../components/LoginPageWrapper';
import SignupPageWrapper from '../components/SignupPageWrapper';
import DashboardLayoutWrapper from '../components/DashboardLayoutWrapper';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

import Dashboard from '../pages/Dashboard';
import LiveAccounts from '../pages/LiveAccounts';
import TradingAccountCreation from '../pages/TradingAccountCreation';
import KYCVerification from '../pages/KYCVerification';
import Deposits from '../pages/Deposits';
import InternalTransfer from '../pages/InternalTransfer';
import IBRequest from '../pages/IBRequest';
import TwoFactorAuth from '../pages/TwoFactorAuth';
import MyAccounts from '../pages/MyAccount';
import ManageAccounts from '../pages/ManageAccounts';
import Profile from '../pages/Profile';
import Support from '../pages/Support';
import CreateTicket from '../pages/CreateTicket';
import NotFound from '../pages/NotFound';

// Import Admin Pages
import {
  AdminDashboard,
  AdminSupport,
  AdminUsers,
  // AdminAccounts,
  AdminTransactions,
  AdminKYC,
  AdminReports,
  AdminSettings,
  AdminClientsLeads,
  AdminLeads,
  AdminFinancial,
  AdminIBPartners,
  AdminConfigurations,
  AdminBonusPromotion,
  AdminPromotionalBanners,
  AdminManageFranchise,
  AdminSalesManagers
} from '../pages/admin';

// Admin Layout Wrapper Component
import AdminLayoutWrapper from '../components/AdminLayoutWrapper';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <LoginPageWrapper />
          </PublicRoute>
        ),
      },
      {
        path: 'signup',
        element: (
          <PublicRoute>
            <SignupPageWrapper />
          </PublicRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayoutWrapper />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'live-accounts',
            element: <LiveAccounts />,
          },
          {
            path: 'my-accounts',
            element: <MyAccounts />,
          },
          {
            path: 'manage-accounts',
            element: <ManageAccounts />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'trading-account',
            element: <TradingAccountCreation />,
          },
          {
            path: 'kyc',
            element: <KYCVerification />,
          },
          {
            path: 'deposits',
            element: <Deposits />,
          },
          {
            path: 'internal-transfer',
            element: <InternalTransfer />,
          },
          {
            path: 'ib-request',
            element: <IBRequest />,
          },
          {
            path: '2fa',
            element: <TwoFactorAuth />,
          },
          {
            path: 'support',
            element: <Support />,
          },
          {
            path: 'support/create-ticket',
            element: <CreateTicket />,
          },
        ],
      },
      // Admin Routes - Separate top-level section
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <AdminLayoutWrapper />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <AdminDashboard />,
          },
          {
            path: 'support',
            element: <AdminSupport />,
          },
          {
            path: 'users',
            element: <AdminUsers />,
          },
          // {
          //   path: 'accounts',
          //   element: <AdminAccounts />,
          // },
          {
            path: 'transactions',
            element: <AdminTransactions />,
          },
          {
            path: 'kyc',
            element: <AdminKYC />,
          },
          {
            path: 'reports',
            element: <AdminReports />,
          },
          {
            path: 'settings',
            element: <AdminSettings />,
          },
          {
            path: 'clients-leads',
            element: <AdminClientsLeads />,
          },
          {
            path: 'leads',
            element: <AdminLeads />,
          },
          {
            path: 'financial',
            element: <AdminFinancial />,
          },
          {
            path: 'ib-partners',
            element: <AdminIBPartners />,
          },
          {
            path: 'configurations',
            element: <AdminConfigurations />,
          },
          {
            path: 'bonus-promotion',
            element: <AdminBonusPromotion />,
          },
          {
            path: 'promotional-banners',
            element: <AdminPromotionalBanners />,
          },
          {
            path: 'manage-franchise',
            element: <AdminManageFranchise />,
          },
          {
            path: 'sales-managers',
            element: <AdminSalesManagers />,
          },
        ],
      },
      // 404 Not Found Route - Catch all unmatched routes
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
