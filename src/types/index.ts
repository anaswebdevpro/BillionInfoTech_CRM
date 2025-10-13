// AccountType for account type grids
export interface AccountType {
  id: string;
  name: string;
  markUp: string;
  commission: string;
  swap: string;
  ib: string;
  minDeposit: string;
}

// User type
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  balance: number;
  verified: boolean;
  twoFactorEnabled: boolean;
  profileImage?: string;
}

// Extended User type with additional profile fields - matches actual API response
export interface ExtendedUser {
  id: number;
  sponsor: number;
  email: string;
  d_password: string;
  remember_token: string;
  address: string | null;
  city: string | null;
  country: string | null;
  created_on: string;
  disable_commission: number;
  email_verified_at: string | null;
  first_name: string;
  franchise_id: number | null;
  institute_id: number | null;
  is_paid: number;
  isd_code: number;
  last_login: string;
  last_login_ip: string;
  last_name: string;
  main_balance: number;
  middle_name: string | null;
  phone: string;
  profile_picture: string | null;
  profit_balance: number;
  referral_code: string;
  state: string | null;
  status: number;
  theme: number;
  updated_on: string | null;
  withdrawal_status: number;
  zip_code: string | null;
  // user_type indicates role like 'admin' or 'user' returned from the API
  user_type?: string;
}

// Account type for user accounts
export interface Account {
  id: string;
  userId: string | number;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  leverage: string;
  status: string;
}

// Internal Transfer API Response types
export interface InternalTransferResponse {
  response: boolean;
  title: string;
  main_wallet: string;
  profit_wallet: string;
  live_accounts: LiveAccount[];
  from_account: FromAccount[];
  to_account: ToAccount[];
}

export interface LiveAccount {
  name: string;
  account_number: number;
  symbol: string;
  leverage: string;
  slug: string;
}

export interface FromAccount {
  wallet?: string;
  balance?: string;
  account_number?: number;
  slug?: string;
}

export interface ToAccount {
  account_number: number;
  slug: string;
}

// Transaction type
export interface Transaction {
  id: string;
  userId: string | number;
  type: string;
  amount: number;
  currency: string;
  method?: string;
  status: string;
  date: string;
  fromAccount?: string;
  toAccount?: string;
}

// KYC Document type
export interface KycDocument {
  id: string;
  userId: string | number;
  documentType: string;
  status: string;
  uploadDate: string;
}

// IB Request type
export interface IBRequest {
  id: string;
  userId: string | number;
  companyName: string;
  contactPerson: string;
  status: string;
  submissionDate: string;
  email?: string;
  phone?: string;
  address?: string;
  experience?: string;
}

// Dashboard data type (used by API response)
export interface DashboardData {
  version: string;
  name: string;
  description: string;
  wallet_balance: string;
  referral_link: string;
  live_accounts: LiveAccount[];
  recent_trades: RecentTrade[];
  recent_transactions: RecentTransaction[];
  stats: Stats;
}

export interface RecentTrade {
  account_number: number;
  category: string;
  close_price: number;
  closed_on: string;
  created_on: string;
  execution_id: number;
  id: number;
  is_distributed: number;
  is_haze: number;
  open_price: number;
  order_id: number;
  platform_id: number;
  profit: number;
  profit_update: number;
  sent_to_meta: number;
  side: string;
  status: number;
  stop_loss: number;
  symbol: string;
  take_profit: number;
  user_id: number;
  volume: number;
  zero_profit: number;
}

export interface RecentTransaction {
  txn_type: string; // e.g., 'external-transfer' or 'level-income'
  type: string; // 'debit' | 'credit'
  amount: number;
  remarks: string;
  created_on: string;
}

export interface Stats {
  commission: string;
  deposits: string;
  withdrawals: string;
  eta_drawals: string;
  wallet_balance?: string;
}

// Position type
export interface Position {
  srNo: number;
  orderId: string;
  account: string;
  type: string;
  openPrice: number;
  symbol: string;
  volume: number;
  id: string;
}

//ib form data type
export interface IBFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
}

export interface AccountCreationFormData {
  platformType: string;
  accountVariant: string;
  accountType: string;
  currency: string;
  leverage: string;
  investorPassword: string;
  masterPassword: string;
  initialDeposit?: number;
}

export interface FundTransferFormData {
  fromAccount: string;
  toAccount: string;
  amount: number;
  currency: string;
  transferDate: string;
}

export interface KYCFormData {
  file: File | null;
  documentType: string;
  documentNumber: string;
  expiryDate: string;
  uploadDate: string;
}

export interface KYCDocument {
  id: string;
  userId: string | number;
  documentType: string;
  documentNumber: string;
  expiryDate: string;
  uploadDate: string;
  status: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  twoFactorEnabled?: boolean;
  agreeToTerms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: ExtendedUser | null;
  token: string | null;
  login: (user: ExtendedUser, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone: string;
  isd_code: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  referral_code?: string;
  profile_picture?: string;
}

export interface BankDetailsFormData {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  iban: string;
}

export interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode?: string;
  iban?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface DepositFormData {
  accountId: string;
  amount: number;
  currency: string;
  depositDate: string;
  method?: string;
}

export interface OutletContext {
  isAuthenticated: boolean;
  handleLogin: (token: string) => void;
  handleSignup: (token: string) => void;
}

// Support Ticket types
export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string | number;
  department: string;
  subject: string;
  priority: "low" | "medium" | "high" | "urgent";
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
}

export interface CreateSupportTicketFormData {
  department: string;
  subject: string;
  priority: "low" | "medium" | "high" | "urgent";
  description: string;
}

// Network/Tree types for IB Request components
export interface TreeMember {
  memberId: number;
  encryptedmemberId: string;
  parentId: number | null;
  otherInfo: string;
  account_number: string | number;
  business: string;
  status?: number | string;
}

export interface TooltipData {
  id: number;
  name: string;
  join_on: string;
  buss: string;
  activated_on: string;
  account_number: string | number;
  business: string;
  class: string;
  ib_status: string;
}

export interface NetworkData {
  title: string;
  gototop: boolean;
  tree: TreeMember[];
  tooltip: TooltipData[];
}

// API Response types
export interface ApiResponse<T = unknown> {
  response: boolean;
  message?: string;
  data?: T;
}

// Error types for better error handling
export interface ApiError {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}
