import { apiRequest } from './apiClient';

export const reportApi = {
  getSummary: async () => {
    return await apiRequest('/reports/summary');
  },

  getLogs: async () => {
    return await apiRequest('/reports/logs');
  },

  getTransactions: async () => {
    return await apiRequest('/transactions');
  },

  createTransaction: async (txnData) => {
    return await apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(txnData),
    });
  },
};
