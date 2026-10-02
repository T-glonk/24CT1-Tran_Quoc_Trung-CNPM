import { apiRequest } from './apiClient';

export const bookingApi = {
  getAllBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/bookings${queryString ? `?${queryString}` : ''}`);
  },

  createBooking: async (bookingData) => {
    return await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  updateStatus: async (bookingId, status, note) => {
    return await apiRequest(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
  },

  cancelBooking: async (bookingId, reason) => {
    return await apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};
