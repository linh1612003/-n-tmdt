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
            console.log('axiosClient - Added Authorization header for URL:', config.url);
        } else {
            console.warn('axiosClient - No access_token found in localStorage for URL:', config.url);
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
        if (!error.response) {
            // Network error or no response
            return Promise.reject(new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'));
        }
        
        const { config, status, data } = error.response;
        const URLS = ['/api/auth/register','/api/auth/login'];

        // Log 401 errors for debugging
        if (status === 401) {
            console.error('axiosClient - 401 Unauthorized for URL:', config?.url);
            console.error('axiosClient - Error data:', data);
            const accessToken = localStorage.getItem('access_token');
            console.error('axiosClient - access_token in localStorage:', accessToken ? 'Present' : 'Missing');
            
            // Kiểm tra nếu token hết hạn hoặc không hợp lệ
            // Chuyển đổi message thành string (có thể là object hoặc string)
            const errorMessage = typeof data?.message === 'string' 
                ? data.message 
                : (typeof data?.message === 'object' 
                    ? JSON.stringify(data.message) 
                    : String(data?.message || ''));
            const isTokenExpired = typeof errorMessage === 'string' && (
                errorMessage.includes('hết hạn') || 
                errorMessage.includes('expired') || 
                errorMessage.includes('Token đã hết hạn') ||
                errorMessage.includes('Invalid token') ||
                errorMessage.includes('User not authenticated') ||
                errorMessage.includes('authenticated') ||
                errorMessage.includes('Unauthorized')
            );
            
            // Xử lý token hết hạn
            // Với chat API, chỉ dừng request nhưng không redirect ngay (để user có thể tiếp tục xem trang)
            // Với các API khác, redirect đến login
            const isChatApi = config?.url?.includes('/api/chat/');
            
            if (isTokenExpired && accessToken) {
                // Nếu là chat API, không log nhiều để tránh spam console
                // Component sẽ tự xử lý dừng interval
                if (!isChatApi) {
                    console.warn('axiosClient - Token expired or invalid, clearing localStorage');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('role');
                    
                    // Chỉ redirect nếu không phải đang ở trang login/register
                    const currentPath = window.location.pathname;
                    if (!currentPath.includes('/login') && !currentPath.includes('/register') && !currentPath.includes('/auth')) {
                        // Sử dụng setTimeout để tránh lỗi navigation trong interceptor
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 100);
                    }
                }
                // Với chat API, không log để tránh spam - component sẽ xử lý
            }
        }

        const err1 = data?.message || data || 'Đã xảy ra lỗi! Vui lòng thử lại sau.';
        if (URLS.includes(config?.url) && status === 401) {
            throw new Error(err1);
        }
        if (URLS.includes(config?.url) && status === 409) {
            throw new Error(err1);
        }
        // Handle other error cases here if needed
        return Promise.reject(err1);
    }
);

export default axiosClient;
