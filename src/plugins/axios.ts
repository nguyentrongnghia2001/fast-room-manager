import axios from 'axios';

const baseURL = import.meta.env.BASE_URL; // Replace with your actual base URL

const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Interceptors
instance.interceptors.request.use(
  (config:any) => {
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response?.data);
  }
);

export default instance;
