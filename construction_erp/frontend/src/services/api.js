import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem("access_token", access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const register = async (email, password, role = "worker") => {
  const response = await axios.post(`${API_URL}/accounts/register/`, {
    email,
    password,
    role,
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/accounts/token/`, {
    email,
    password,
  });
  
  if (response.data.access) {
    localStorage.setItem("access_token", response.data.access);
  }
  if (response.data.refresh) {
    localStorage.setItem("refresh_token", response.data.refresh);
  }
  
  return response.data;
};

// Projects API - COMPLETELY REWRITTEN
export const fetchProjects = async () => {
  const response = await api.get("/projects/");
  // response.data from axios is already the data
  // DRF pagination returns { count, next, previous, results }
  return response.data;
};

// User API
export const fetchCurrentUser = async () => {
  const response = await api.get("/accounts/users/me/");
  return response.data;
};

export default api;
