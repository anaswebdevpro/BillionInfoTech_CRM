import { apiRequest } from './api';
import type { DashboardStats, Transaction, Position } from '../types';

export const dashboardAPI = {
  // Get dashboard statistics
  async getStats(): Promise<DashboardStats | null> {
    try {
      const response = await apiRequest<DashboardStats>({
        endpoint: '/dashboard/stats',
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    }
  },

  // Get recent transactions
  async getRecentTransactions(): Promise<Transaction[]> {
    try {
      const response = await apiRequest<Transaction[]>({
        endpoint: '/dashboard/recent-transactions',
        method: 'GET'
      });
      return response || [];
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      return [];
    }
  },

  // Get trading positions
  async getPositions(): Promise<Position[]> {
    try {
      const response = await apiRequest<Position[]>({
        endpoint: '/dashboard/positions',
        method: 'GET'
      });
      return response || [];
    } catch (error) {
      console.error('Error fetching positions:', error);
      return [];
    }
  },

  // Get market data
  async getMarketData(): Promise<Array<{
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
  }>> {
    try {
      const response = await apiRequest<Array<{
        symbol: string;
        price: number;
        change: number;
        changePercent: number;
      }>>({
        endpoint: '/dashboard/market-data',
        method: 'GET'
      });
      return response || [];
    } catch (error) {
      console.error('Error fetching market data:', error);
      return [];
    }
  },

  // Get account summary
  async getAccountSummary(): Promise<{
    totalBalance: number;
    equity: number;
    margin: number;
    freeMargin: number;
  } | null> {
    try {
      const response = await apiRequest<{
        totalBalance: number;
        equity: number;
        margin: number;
        freeMargin: number;
      }>({
        endpoint: '/dashboard/account-summary',
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching account summary:', error);
      return null;
    }
  },

  // Get performance data
  async getPerformanceData(): Promise<{
    monthlyGrowth: number[];
    profitLoss: number;
    totalTrades: number;
  } | null> {
    try {
      const response = await apiRequest<{
        monthlyGrowth: number[];
        profitLoss: number;
        totalTrades: number;
      }>({
        endpoint: '/dashboard/performance',
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching performance data:', error);
      return null;
    }
  }
};
