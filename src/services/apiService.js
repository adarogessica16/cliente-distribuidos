import axios from 'axios';

const getAuthHeader = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const apiService = axios.create({
    baseURL: '/api'
});

apiService.interceptors.request.use(config => {
    config.headers = {
        ...config.headers,
        ...getAuthHeader()
    };
    return config;
});