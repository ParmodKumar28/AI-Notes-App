import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: false,
  timeout: 30000, // 30 second timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error);

    // Handle network errors
    if (!error.response) {
      error.message = "Network error. Please check your connection.";
    }

    // Handle specific HTTP status codes
    if (error.response?.status === 500) {
      error.message = "Server error. Please try again later.";
    } else if (error.response?.status === 404) {
      error.message = "Resource not found.";
    } else if (error.response?.status === 400) {
      error.message = error.response.data?.error || "Bad request.";
    }

    return Promise.reject(error);
  }
);

export default api;
