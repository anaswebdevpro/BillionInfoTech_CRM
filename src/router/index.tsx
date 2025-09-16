import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import LoginPageWrapper from '../components/LoginPageWrapper';
import SignupPageWrapper from '../components/SignupPageWrapper';
import DashboardLayoutWrapper from '../components/DashboardLayoutWrapper';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

import Dashboard from '../pages/Dashboard/Dashboard';
import LiveAccounts from '../pages/LiveAccount/LiveAccounts';
import TradingAccountCreation from '../pages/createTradingAccount/TradingAccountCreation';

import Deposits from '../pages/Deposite/Deposits';
import InternalTransfer from '../pages/internalTransfer/InternalTransfer';

import TwoFactorAuth from '../pages/TwoFactorAuth/TwoFactorAuth';
import MyAccounts from '../pages/MyAccount/MyAccount';
import ManageAccounts from '../pages/ManageAccounts/ManageAccounts';
import Profile from '../pages/profile/Profile';
import Support from '../pages/Support/Support';
import CreateTicket from '../pages/createTicket/CreateTicket';
import BonusPromotion from '../pages/Bonus_promotion/BonusPromotion';
import NotFound from '../pages/NotFound/NotFound';

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


//import iBmodule pages
import {
  SetCommission, IBAccordian, IBRequestTree, IBtradeHistory, IBtransaction, IBBusiness, MYSubIBSummnary, CommissionReport
} from "../pages/IBRequest/index";
import SetCommissionForm from '../pages/IBRequest/SetCommission/SetCommissionForm';

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
          // {
          //   path: 'kyc',
          //   element: <KYCVerification />,
          // },
          {
            path: 'deposits',
            element: <Deposits />,
          },
          {
            path: 'internal-transfer',
            element: <InternalTransfer />,
          },
           {
            path: 'set-commission',
            element: <SetCommission />,
          },
          {
            path: 'set-commission-form',
            element: <SetCommissionForm />,
          },
          {
            path: 'accordian',
            element: <IBAccordian />,
          },
          {
            path: 'request-tree',
            element: <IBRequestTree />,
          },
          {
            path: 'trade-history',
            element: <IBtradeHistory />,
          },
          {
            path: 'transaction',
            element: <IBtransaction />,
          },
          {
            path: 'business',
            element: <IBBusiness />,
          },
          {
            path: 'sub-ib-summary',
            element: <MYSubIBSummnary />,
          },
          {
            path: 'commission-report',
            element: <CommissionReport />,
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
          {
            path: 'bonus-promotion',
            element: <BonusPromotion />,
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
