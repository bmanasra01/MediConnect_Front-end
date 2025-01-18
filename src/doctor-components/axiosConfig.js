import axios from 'axios';

const doctorAxiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Doctor-specific base URL, if different
});

doctorAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
    } else {
      console.error("Token not found in localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default doctorAxiosInstance;
