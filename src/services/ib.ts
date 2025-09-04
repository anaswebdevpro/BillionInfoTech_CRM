import { apiRequest } from './api';
import type { IBRequest } from '../types';

export const ibAPI = {
  // Get all IB requests
  async getRequests(): Promise<IBRequest[]> {
    try {
      const response = await apiRequest<IBRequest[]>({
        endpoint: '/ib/requests',
        method: 'GET'
      });
      return response || [];
    } catch (error) {
      console.error('Error fetching IB requests:', error);
      return [];
    }
  },

  // Create new IB request
  async createRequest(data: Partial<IBRequest>): Promise<IBRequest | null> {
    try {
      const response = await apiRequest<IBRequest>({
        endpoint: '/ib/requests',
        method: 'POST',
        data
      });
      return response;
    } catch (error) {
      console.error('Error creating IB request:', error);
      return null;
    }
  },

  // Get IB request by ID
  async getRequest(id: string): Promise<IBRequest | null> {
    try {
      const response = await apiRequest<IBRequest>({
        endpoint: `/ib/requests/${id}`,
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching IB request:', error);
      return null;
    }
  },

  // Update IB request
  async updateRequest(id: string, data: Partial<IBRequest>): Promise<IBRequest | null> {
    try {
      const response = await apiRequest<IBRequest>({
        endpoint: `/ib/requests/${id}`,
        method: 'PUT',
        data
      });
      return response;
    } catch (error) {
      console.error('Error updating IB request:', error);
      return null;
    }
  },

  // Get IB statistics
  async getStats(): Promise<{
    totalCommission: number;
    totalReferrals: number;
    pendingPayouts: number;
  } | null> {
    try {
      const response = await apiRequest<{
        totalCommission: number;
        totalReferrals: number;
        pendingPayouts: number;
      }>({
        endpoint: '/ib/stats',
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching IB stats:', error);
      return null;
    }
  }
};
