import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

const notificationApi = {
  getAll: async () => {
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  getUnread: async () => {
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}/unread`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  getUnreadCount: async () => {
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}/unread-count`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.put(
      `${API_URL}/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },

  markAllAsRead: async () => {
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.put(
      `${API_URL}/mark-all-read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },
};

export default notificationApi;

