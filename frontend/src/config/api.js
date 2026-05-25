import axios from "axios";

// API Configuration - uses environment variables for flexibility
const API_URL =
  process.env.REACT_APP_API_URL || "/api";

console.log("API Base URL:", API_URL);

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});

// Add request interceptor to log requests
API.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log responses and handle errors
API.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export default API;
