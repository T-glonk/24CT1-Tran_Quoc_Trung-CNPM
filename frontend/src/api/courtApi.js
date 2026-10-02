import { apiRequest } from './apiClient';

export const courtApi = {
  getAllCourts: async () => {
    return await apiRequest('/courts');
  },

  getClubs: async () => {
    return await apiRequest('/courts/clubs/all');
  },

  updateStatus: async (courtId, status, currentGuest, currentSlot) => {
    return await apiRequest(`/courts/${courtId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, currentGuest, currentSlot }),
    });
  },

  addCourt: async (courtData) => {
    return await apiRequest('/courts', {
      method: 'POST',
      body: JSON.stringify(courtData),
    });
  },

  updatePrice: async (courtId, price) => {
    return await apiRequest(`/courts/${courtId}/price`, {
      method: 'PATCH',
      body: JSON.stringify({ price }),
    });
  },
};
