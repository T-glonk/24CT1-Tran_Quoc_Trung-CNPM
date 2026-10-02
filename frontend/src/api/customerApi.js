import { apiRequest } from './apiClient';

export const customerApi = {
  getAllCustomers: async () => {
    return await apiRequest('/customers');
  },

  getCustomerById: async (id) => {
    return await apiRequest(`/customers/${id}`);
  },

  toggleStatus: async (id) => {
    return await apiRequest(`/customers/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },

  updateRole: async (id, role) => {
    return await apiRequest(`/customers/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  addCustomer: async (customerData) => {
    return await apiRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },
};
