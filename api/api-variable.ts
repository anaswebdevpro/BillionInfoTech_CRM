// BaseUrl
export const BASE_URL = "https://amf.billioninfotech.com/api/v1";
// auth
export const LOGIN = "/login";
export const SIGNUP = "/register";

//  profile data
export const GET_PROFILE = "/profile-data";
export const PROFILE_UPDATE = "/update-profile-data";
export const UPDATE_PASSWORD = "/update-password";
export const ADD_BANK_ACCOUNT = "/add-bankaccount-details";
export const DELETE_BANK_ACCOUNT = "/delete-bankaccount-details";
export const FETCH_BANK_DETAILS = "/fetch-bank-details";
export const UPLOAD_DOCUMENT = "/upload-document";

// dashbord data
export const DASHBOARD_DATA = "/dashboard-data";

// accounts
export const SAVE_BANK = "/save-bank";
export const DELETE_BANK = "/delete-bank";

//Meta accounts
export const MANAGE_ACCOUNTS = "/open-trade-account-list";
export const TRADE_ACCOUNT = "/trade-account";
export const CREATE_TRADE_ACCOUNT_OPTIONS = "/live-account";
export const OPEN_MT_ACCOUNT = "/open-mt-account";
export const UPDATE_ACCOUNT_PASSWORD = "/update-account-password";
export const GET_ACCOUNT_INFO = "/account-info";

//Bonus and promotions
export const FETCH_BONUS = "/fetch-bonuses";
export const CLAIM_BONUS = "/claim-bonus";

//support
export const CREATE_SUPPORT_TICKET = "/create-support-ticket";
export const HELP_DEPARTMENT = "/help-departments";
export const TICKET_ENQUIRY_LIST = "/ticket-enquery-list";
export const ALL_TICKETS = "/view-tickets";
export const NEW_COMMENTS = "/new-comment";
export const SHOW_ALL_SPECIFIC_COMMENT = "/show-specific-ticket";

// IBMENU sytem apis

export const MY_NETWORK = "/my-network";
export const GET_USER_DOWNLINE = "/get-user-downline";
export const IB_TRANSACTION = "/ajax-user-transactions";
export const GET_LOT_WISE_TRANSACTIONS = "/get-lot-wise-transactions";
export const COMMISSION_SETTINGS = "/client-network-settings";
export const UPDATE_COMMISSION_SETTINGS = "/update-network-settings";
export const GET_PARTNER_BUSINESS = "/get-partner-business";
export const GET_BROKERAGE_REPORTS = "/get-brokerage-reports/";
export const GET_TRADES_HISTORY = "/get-user-trades";

// funds
export const INTERNAL_TRANSFER = "/internal-transfer";
export const SUBMIT_INTERNAL_TRANSFER = "/do-internal-transfer";
export const DEPOSIT_METHODS = "/deposit-methods";
export const DEPOSIT_METHODS_TRC20 = "/wallet-address/trc20";
export const DEPOSIT_METHODS_BEP20 = "/wallet-address/bep20";
export const GET_CRYPTO_DEPOSIT_LIST = "/get-crypto-deposit";
export const GET_DEPOSIT_REPORT = "/get-deposit-request";
export const DEMO_BANK_DETAILS = "/fait-request";
export const SUBMIT_DEPOSIT_REQUEST = "/submit-deposit-request";
export const GET_WALLET_TRANSACTION_REPORT = "/get-wallet-transation-report";
export const WITHDRAW_FUNDS_OPTIONS = "/withdraw";
export const SUBMIT_WITHDRAW_FUNDS = "/withdraw-funds";
export const GET_WITHDRAWAL_HISTORY = "/get-withdrawal-history";

// Admin Api
export const ADMIN_LOGIN = "/admin/login";
export const ADMIN_DASHBOARD_DATA ="/admin/dashboard-stats";
export const ADMIN_RECENT_TRANSACTION ="/admin/recent-transaction";

//client management
export const ADMIN_GET_ALL_CLIENT ="/admin/get-all-clients"
export const ADMIN_GET_ALL_KYC ="/admin/get-key-requests"
export const ADMIN_ADD_NEW_CLIENT ="/admin/add-new-client"
export const ADMIN_ALL_TRADING_ACCOUNTS ="/admin/get-all-accounts";

// admin support system 
export const ADMIN_VIEW_ALL_TICKETS="/admin/view-all-tickets"
export const ADMIN_FETCH_ALL_MESSAGES ="/admin/view-ticket"
export const ADMIN_NEW_COMMENTS = "/admin/new-comment/";
export const ADMIN_CLOSED_TICKET = "/admin/closed-ticket/";
