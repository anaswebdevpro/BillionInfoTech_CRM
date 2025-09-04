// Central export file for all API services
export { apiRequest } from './api';
export { accountsAPI } from './accounts';
export { transactionsAPI } from './transactions';
export { kycAPI } from './kyc';
export { ibAPI } from './ib';
export { dashboardAPI } from './dashboard';
export { createSupportTicket, validateFileUploads } from './support';

// Re-export types
export type { ApiCallOptions } from './api';
export type { CreateTicketPayload, CreateTicketResponse } from './support';
