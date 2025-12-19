import axiosClient from "./axiosClient"

const userApi = {
    register(data){
        const url = 'api/auth/register';
        return axiosClient.post(url,data)
    },

    checkEmailAndSendOtp(email){
        const url = 'api/auth/check-email';
        return axiosClient.post(url, { email })
    },

    verifyOtpAndRegister(data){
        const url = 'api/auth/verify-otp';
        return axiosClient.post(url, data)
    },

    login(data){
        const url = 'api/auth/login';
        return axiosClient.post(url,data)
    },
    getInfo(userId){
        const url = `api/auth/${userId}`;
        return axiosClient.get(url)
    },
    update(userId, data) {
        const url = `api/users/${userId}`;
        return axiosClient.put(url, data);
    },
    forgotPassword(email) {
        const url = 'api/auth/forgot-password';
        return axiosClient.post(url, { email });
    },
    resetPassword(data) {
        const url = 'api/auth/reset-password';
        return axiosClient.post(url, data);
    }
}

export default userApi