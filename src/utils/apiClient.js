import axios from "axios";
import Cookies from "js-cookie";
// import { API_BASE_URL } from './BASE_URL';

const API_BASE_URL = "https://api.barakahvault.com/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        // "Content-Type": "application/json",
        'Content-Type': 'multipart/form-data',
    },
});

// Request Interceptor: Attach token dynamically before each request
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle expired tokens (401 Unauthorized)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Cookies.remove("token"); // Remove expired token
            // window.location.reload(); // Refresh to apply logout
        }
        return Promise.reject(error);
    }
);

export default apiClient;
