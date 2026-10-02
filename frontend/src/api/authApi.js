import { apiRequest } from './apiClient';

export const authApi = {
  login: async (credentials) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async (userId) => {
    return await apiRequest('/auth/profile', {
      method: 'GET',
      headers: { 'x-user-id': userId },
    });
  },
};
