import axiosClient from './axiosClient';

const orderApi = {
    add(payloadPay) {
        const url = 'api/orders';
        return axiosClient.post(url,payloadPay);
    },
    get(orderId) {
        const url = `api/orders/${orderId}`
        return axiosClient.get(url);
    },
    remove(userId, productIds) {
        const encodedProductIds = encodeURIComponent(JSON.stringify(productIds));
        const url = `api/carts/user?userId=${userId}&productIds=${encodedProductIds}`;
        return axiosClient.put(url);
    },
     payment(orderId, paymentMethod) {
        const url = `api/orders/${orderId}/status`; 
        return axiosClient.put(url, { paymentMethod });
    },
    updateShippingInfo(userId,payload){
        const url = `api/users/${userId}/shipping-infor`; 
<<<<<<< HEAD
        console.log('orderApi.updateShippingInfo - URL:', url);
        console.log('orderApi.updateShippingInfo - payload:', JSON.stringify(payload, null, 2));
        return axiosClient.put(url, payload);
=======
        return axiosClient.put(url, { payload });
>>>>>>> origin/back-up
    },
      getOrderHistory(userId){
        const url =`http://localhost:5000/api/orders/${userId}/user`
        return axiosClient.get(url);
<<<<<<< HEAD
=======
      },
      getRevenueAndProfit(startDate, endDate) {
        const url = '/api/orders/revenue-profit';
        const params = {};
        if (startDate && endDate) {
            params.startDate = startDate;
            params.endDate = endDate;
        }
        return axiosClient.get(url, { params });
>>>>>>> origin/back-up
      }
}

export default orderApi;
