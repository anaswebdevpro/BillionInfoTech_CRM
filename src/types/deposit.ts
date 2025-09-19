// TypeScript interfaces for Deposit Methods API response

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface DepositMethod {
  badge: string;
  fee: string;
  limits: string;
  min_deposit: string;
  name: string;
  processing_time: string;
  route: string;
}

export interface DepositMethodsResponse {
  response: boolean;
  title: string;
  user: User;
  deposit_methods: DepositMethod[];
}

// Local interface for UI representation
export interface UIDepositMethod extends DepositMethod {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}
