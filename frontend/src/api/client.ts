import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Default to local backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach the JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
