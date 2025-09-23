// AccountType for account type grids

// export interface AccountType {
//   success: boolean;
//   data: {
//     id: number;
//     name: string;
//     type: number;
//     group_slug: string;
//     bonus: number;
//     created_on: string;
//     currency_id: number;
//     income_copied: number | null;
//     income_type: number;
//     is_dedicated: number;
//     is_visible: number;
//     leverage: string;
//     master_ids: number | null;
//     min_deposit: number;
//     platform_id: number;
//     status: number;
//     updated_on: string;
//   }[];}

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

// Extended User type with additional profile fields
export interface ExtendedUser extends User {
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone?: string;
  isd_code?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  referral_code?: string;
  profile_picture?: string;
  sponsor?: string;
  status?: number;
  theme?: number;
  withdrawal_status?: number;
  kycDocuments?: Array<{
    name: string;
    uploadedAt: string;
    status: string;
  }>;
}

// Account type for user accounts


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
  account_number: number;
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

// Dashboard stats type
export interface DashboardStats {
  totalBalance: number;
  totalProfit: number;
  totalTrades: number;
  activeAccounts: number;
  monthlyGrowth: number;
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

export interface KYCDocument{
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
  twoFactorEnabled ?: boolean;
  agreeToTerms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}



export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
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
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
}

export interface CreateSupportTicketFormData {
  department: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
}




export interface Account {
  id: number;
  account_name: string;
  account_number: number;
  currency_symbol: string;
  leverage_show_value: string;
  leverage_value: string;
  platform_slug: string;
  status: string;
  type: string;
}