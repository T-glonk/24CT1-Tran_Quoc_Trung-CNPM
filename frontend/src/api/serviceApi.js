import { apiRequest } from './apiClient';

export const serviceApi = {
  getAllServices: async (category) => {
    return await apiRequest(`/services${category ? `?category=${category}` : ''}`);
  },

  updateStock: async (serviceId, delta, stock) => {
    return await apiRequest(`/services/${serviceId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ delta, stock }),
    });
  },

  addService: async (serviceData) => {
    return await apiRequest('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  },

  posCheckout: async (cartData) => {
    return await apiRequest('/services/pos-checkout', {
      method: 'POST',
      body: JSON.stringify(cartData),
    });
  },
};
