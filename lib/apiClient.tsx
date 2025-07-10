import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// ✅ Create an axios instance
const api = axios.create({
    baseURL: 'http://192.168.205.37:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10s timeout
});

// ✅ Optional: Add request interceptor (e.g., to inject auth token)
api.interceptors.request.use(
    async (config) => {
        // If you have token stored in SecureStore or context, inject it here
        // const token = await SecureStore.getItemAsync('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Optional: Add response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with a status outside 2xx
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            console.error('No response from server');
        } else {
            console.error('Request setup error', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
