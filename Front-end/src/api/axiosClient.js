import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5000/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
    function (config) {
        // Retrieve the accessToken from localStorage or any other storage mechanism
        const accessToken = localStorage.getItem('access_token'); // or get it from your state management

        // If accessToken exists, set the Authorization header
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
axiosClient.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response.data;
    },
    function (error) {
        // Any status codes that fall outside the range of 2xx cause this function to trigger
        // Do something with response error
        
        // Kiểm tra error.response có tồn tại không
        if (!error.response) {
            // Lỗi mạng hoặc server không phản hồi
            const networkError = error.message || 'Không thể kết nối đến server. Vui lòng thử lại.';
            return Promise.reject(new Error(networkError));
        }

        const { config, status, data } = error.response;
        const URLS = ['/api/auth/register','/api/auth/login'];

        // Kiểm tra data và data.message có tồn tại không
        const err1 = data?.message || data?.error || error.message || 'Đã xảy ra lỗi';
        
        // Kiểm tra config và config.url có tồn tại không
        if (config?.url && URLS.includes(config.url) && status === 401) {
            throw new Error(err1);
        }
        if (config?.url && URLS.includes(config.url) && status === 409) {
            throw new Error(err1);
        }
        // Handle other error cases here if needed
        return Promise.reject(err1);
    }
);

export default axiosClient;
