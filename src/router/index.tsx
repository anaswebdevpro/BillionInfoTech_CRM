import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import LoginPageWrapper from "../components/LoginPageWrapper";
import SignupPageWrapper from "../components/SignupPageWrapper";
import DashboardLayoutWrapper from "../components/DashboardLayoutWrapper";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

import Dashboard from "../pages/Dashboard/Dashboard";
import LiveAccounts from "../pages/LiveAccount/LiveAccounts";
import TradingAccountCreation from "../pages/createTradingAccount/TradingAccountCreation";

import {
  DepositFunds,
  WithdrawFunds,
  InternalTransfer,
  TransactionHistory,
} from "../pages/funds";
import BankTransfer from "../pages/funds/DepositFunds/BankTransfer";

import TwoFactorAuth from "../pages/TwoFactorAuth/TwoFactorAuth";
import MyAccounts from "../pages/MyAccount/MyAccount";
import ManageAccounts from "../pages/ManageAccounts/ManageAccounts";
import Profile from "../pages/profile/Profile";
import Support from "../pages/Support/Support";
import CreateTicket from "../pages/createTicket/CreateTicket";
import BonusPromotion from "../pages/Bonus_promotion/BonusPromotion";
import NotFound from "../pages/NotFound/NotFound";

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
  AdminBonusPromotion,
  AdminPromotionalBanners,
  AdminSalesManagers,
} from "../pages/admin";

// Import Financial Pages
import {
  AdminFinancial,
  DepositRequests,
  AllDeposits,
  DepositHistory,
  GatewayTxns,
  WithdrawalRequests,
  WithdrawalHistory,
  Transfers,
  IBCommission,
  ClientWiseIBCommission,
  AllTransactions,
} from "../pages/admin/AdminFinancial";

// Import IB Partners Pages
import {
  AdminIBPartners,
  PartnerRequests,
  IBs,
} from "../pages/admin/AdminIBPartners";

// Import Configurations Pages
import {
  AdminConfigurations,
  BankSettings,
  ManageGroups,
  GroupSettings,
  TradingSymbols,
  TradingCategories,
  ManageSubadmins,
  AllAdmins,
} from "../pages/admin/AdminConfigurations";

// Import Manage Franchise Pages
import {
  AdminManageFranchise,
  Countries,
  Cities,
} from "../pages/admin/AdminManageFranchise";

// Admin Layout Wrapper Component
import AdminLayoutWrapper from "../components/AdminLayoutWrapper";

//import iBmodule pages
import {
  SetCommission,
  IBAccordian,
  IBRequestTree,
  IBtradeHistory,
  IBtransaction,
  IBBusiness,
  MYSubIBSummnary,
  CommissionReport,
} from "../pages/IBRequest/index";
import SetCommissionForm from "../pages/IBRequest/SetCommission/SetCommissionForm";
import TRC20 from "../pages/funds/DepositFunds/TRC20";
import BEP20 from "../pages/funds/DepositFunds/BEP20";
import AdminLoginPage from "@/pages/admin/login/AdminLogin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPageWrapper />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <SignupPageWrapper />
          </PublicRoute>
        ),
      },
      {
        path: "dashboard",
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
            path: "live-accounts",
            element: <LiveAccounts />,
          },
          {
            path: "my-accounts",
            element: <MyAccounts />,
          },
          {
            path: "manage-accounts",
            element: <ManageAccounts />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "trading-account",
            element: <TradingAccountCreation />,
          },
          // Funds Routes
          {
            path: "funds/deposit",
            element: <DepositFunds />,
          },
          {
            path: "funds/deposit/bank-transfer",
            element: <BankTransfer />,
          },
          {
            path: "funds/deposit/usdt-trc20",
            element: <TRC20 />,
          },
          {
            path: "funds/deposit/usdt-bep20",
            element: <BEP20 />,
          },

          {
            path: "funds/withdraw",
            element: <WithdrawFunds />,
          },
          {
            path: "funds/transfer",
            element: <InternalTransfer />,
          },
          {
            path: "funds/history",
            element: <TransactionHistory />,
          },
          {
            path: "set-commission",
            element: <SetCommission />,
          },
          {
            path: "set-commission-form",
            element: <SetCommissionForm />,
          },
          {
            path: "accordian",
            element: <IBAccordian />,
          },
          {
            path: "request-tree",
            element: <IBRequestTree />,
          },
          {
            path: "trade-history",
            element: <IBtradeHistory />,
          },
          {
            path: "transaction",
            element: <IBtransaction />,
          },
          {
            path: "business",
            element: <IBBusiness />,
          },
          {
            path: "sub-ib-summary",
            element: <MYSubIBSummnary />,
          },
          {
            path: "commission-report",
            element: <CommissionReport />,
          },

          {
            path: "2fa",
            element: <TwoFactorAuth />,
          },
          {
            path: "support",
            element: <Support />,
          },
          {
            path: "support/create-ticket",
            element: <CreateTicket />,
          },
          {
            path: "bonus-promotion",
            element: <BonusPromotion />,
          },
        ],
      },
      // Admin Routes - Separate top-level section
      {
        path: "afxadmin/login",
        element: <AdminLoginPage />,
      },
      {
        path: "afxadmin",
        element: (
          <ProtectedRoute>
            <AdminLayoutWrapper />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/afxadmin/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "support",
            element: <AdminSupport />,
          },
          {
            path: "users",
            element: <AdminUsers />,
          },
          // {
          //   path: 'accounts',
          //   element: <AdminAccounts />,
          // },
          {
            path: "transactions",
            element: <AdminTransactions />,
          },
          {
            path: "kyc",
            element: <AdminKYC />,
          },
          {
            path: "reports",
            element: <AdminReports />,
          },
          {
            path: "settings",
            element: <AdminSettings />,
          },
          {
            path: "clients-leads",
            element: <AdminClientsLeads />,
          },
          {
            path: "leads",
            element: <AdminLeads />,
          },
          {
            path: "financial",
            element: <AdminFinancial />,
          },
          {
            path: "financial/deposit-requests",
            element: <DepositRequests />,
          },
          {
            path: "financial/all-deposits",
            element: <AllDeposits />,
          },
          {
            path: "financial/deposit-history",
            element: <DepositHistory />,
          },
          {
            path: "financial/gateway-txns",
            element: <GatewayTxns />,
          },
          {
            path: "financial/withdrawal-requests",
            element: <WithdrawalRequests />,
          },
          {
            path: "financial/withdrawal-history",
            element: <WithdrawalHistory />,
          },
          {
            path: "financial/transfers",
            element: <Transfers />,
          },
          {
            path: "financial/ib-commission",
            element: <IBCommission />,
          },
          {
            path: "financial/client-wise-ib-commission",
            element: <ClientWiseIBCommission />,
          },
          {
            path: "financial/all-transactions",
            element: <AllTransactions />,
          },
          {
            path: "ib-partners",
            element: <AdminIBPartners />,
          },
          {
            path: "ib-partners/partner-requests",
            element: <PartnerRequests />,
          },
          {
            path: "ib-partners/ibs",
            element: <IBs />,
          },
          {
            path: "configurations",
            element: <AdminConfigurations />,
          },
          {
            path: "configurations/bank-settings",
            element: <BankSettings />,
          },
          {
            path: "configurations/manage-groups",
            element: <ManageGroups />,
          },
          {
            path: "configurations/group-settings",
            element: <GroupSettings />,
          },
          {
            path: "configurations/trading-symbols",
            element: <TradingSymbols />,
          },
          {
            path: "configurations/trading-categories",
            element: <TradingCategories />,
          },
          {
            path: "configurations/manage-subadmins",
            element: <ManageSubadmins />,
          },
          {
            path: "configurations/all-admins",
            element: <AllAdmins />,
          },
          {
            path: "bonus-promotion",
            element: <AdminBonusPromotion />,
          },
          {
            path: "promotional-banners",
            element: <AdminPromotionalBanners />,
          },
          {
            path: "manage-franchise",
            element: <AdminManageFranchise />,
          },
          {
            path: "manage-franchise/countries",
            element: <Countries />,
          },
          {
            path: "manage-franchise/cities",
            element: <Cities />,
          },
          {
            path: "sales-managers",
            element: <AdminSalesManagers />,
          },
        ],
      },
      // 404 Not Found Route - Catch all unmatched routes
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
