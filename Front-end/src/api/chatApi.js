import axiosClient from './axiosClient';

const chatApi = {
    getConversations: () => {
        const url = '/api/chat/conversations';
        return axiosClient.get(url);
    },
    getMessages: (otherUserId) => {
        const url = `/api/chat/messages/${otherUserId}`;
        return axiosClient.get(url);
    },
    sendMessage: (data) => {
        const url = '/api/chat/message';
        return axiosClient.post(url, data);
    },
    getUnreadCount: () => {
        const url = '/api/chat/unread-count';
        return axiosClient.get(url);
    },
    markAsRead: (senderId) => {
        const url = `/api/chat/mark-read/${senderId}`;
        return axiosClient.post(url);
    },
    getAdmin: () => {
        const url = '/api/chat/admin';
        return axiosClient.get(url);
    },
};

export default chatApi;

