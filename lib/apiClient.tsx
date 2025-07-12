import { AuthService } from '@/services/AuthService';
import { Logger } from '@/utils/logger';
import axios from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './token';

const BASE_URL = 'http://192.168.205.37:5000/api'

// Create an axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10s timeout
});

// Attach token to every request
api.interceptors.request.use(async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});


// Refresh token on 401
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        console.log('API Error:', error.config);

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await getRefreshToken();
                if (!refreshToken) {
                    console.error('No refresh token available');
                    await clearTokens();
                    // Optional: navigate to login
                    return Promise.reject(error);
                }
                const res = await axios.post(BASE_URL + '/auth/refresh-token', {
                    refreshToken,
                });
                Logger.log('Token refreshed successfully');

                const { accessToken, refreshToken: newRefreshToken } = res.data;

                await saveTokens(accessToken, newRefreshToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Retry the original request with new tokens
                return api(originalRequest);
            } catch (err) {
                AuthService.logout(); // Clear tokens and logout user
                Logger.error('Token refresh failed', err);
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
