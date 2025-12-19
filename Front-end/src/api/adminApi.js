import axiosClient from './axiosClient';

const adminApi = {
  getStats(startDate, endDate) {
    const url = '/api/admin/stats';
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return axiosClient.get(url, { params });
  },
};

export default adminApi;

