import { apiRequest } from './api';
import type { Transaction } from '../types';

export const transactionsAPI = {
  // Get all transactions
  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await apiRequest<Transaction[]>({
        endpoint: '/transactions',
        method: 'GET'
      });
      return response || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },

  // Create new transaction
  async createTransaction(data: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const response = await apiRequest<Transaction>({
        endpoint: '/transactions',
        method: 'POST',
        data
      });
      return response;
    } catch (error) {
      console.error('Error creating transaction:', error);
      return null;
    }
  },

  // Get transaction by ID
  async getTransaction(id: string): Promise<Transaction | null> {
    try {
      const response = await apiRequest<Transaction>({
        endpoint: `/transactions/${id}`,
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  },

  // Internal transfer
  async internalTransfer(data: {
    fromAccount: string;
    toAccount: string;
    amount: number;
    description?: string;
  }): Promise<Transaction | null> {
    try {
      const response = await apiRequest<Transaction>({
        endpoint: '/transactions/internal-transfer',
        method: 'POST',
        data
      });
      return response;
    } catch (error) {
      console.error('Error processing internal transfer:', error);
      return null;
    }
  },

  // Deposit
  async deposit(data: {
    amount: number;
    method: string;
    currency: string;
    description?: string;
  }): Promise<Transaction | null> {
    try {
      const response = await apiRequest<Transaction>({
        endpoint: '/transactions/deposit',
        method: 'POST',
        data
      });
      return response;
    } catch (error) {
      console.error('Error processing deposit:', error);
      return null;
    }
  },

  // Withdrawal
  async withdraw(data: {
    amount: number;
    method: string;
    currency: string;
    accountDetails?: string;
    description?: string;
  }): Promise<Transaction | null> {
    try {
      const response = await apiRequest<Transaction>({
        endpoint: '/transactions/withdraw',
        method: 'POST',
        data
      });
      return response;
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      return null;
    }
  }
};
