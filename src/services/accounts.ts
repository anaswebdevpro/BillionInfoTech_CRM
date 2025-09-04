import { apiRequest } from './api';
import type { Account, AccountCreationFormData } from '../types';

export const accountsAPI = {
  // Get all accounts
  async getAccounts(): Promise<Account[]> {
    try {
      const response = await apiRequest<Account[]>({
        endpoint: '/accounts',
        method: 'GET'
      });
      return response || [];
    } catch (error) {
      console.error('Error fetching accounts:', error);
      return [];
    }
  },

  // Create new account
  async createAccount(data: AccountCreationFormData): Promise<Account | null> {
    try {
      const response = await apiRequest<Account>({
        endpoint: '/accounts',
        method: 'POST',
        data
      });
      return response;
    } catch (error) {
      console.error('Error creating account:', error);
      return null;
    }
  },

  // Get single account
  async getAccount(id: string): Promise<Account | null> {
    try {
      const response = await apiRequest<Account>({
        endpoint: `/accounts/${id}`,
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching account:', error);
      return null;
    }
  },

  // Update account
  async updateAccount(id: string, data: Partial<Account>): Promise<Account | null> {
    try {
      const response = await apiRequest<Account>({
        endpoint: `/accounts/${id}`,
        method: 'PUT',
        data
      });
      return response;
    } catch (error) {
      console.error('Error updating account:', error);
      return null;
    }
  },

  // Delete account
  async deleteAccount(id: string): Promise<boolean> {
    try {
      await apiRequest({
        endpoint: `/accounts/${id}`,
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  }
};
