import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors (token expired)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: refreshToken
          });
          
          const newAccessToken = response.data.access;
          localStorage.setItem("access_token", newAccessToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, logout
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }
    
    // Normalize error response
    const normalized = {
      message: error.response?.data?.detail || error.message,
      status: error.response?.status || null,
      data: error.response?.data || null,
    };
    return Promise.reject(normalized);
  }
);

// Auth API
export const register = async (email, password, role = "worker", first_name = "", last_name = "") => {
  try {
    const response = await axios.post(`${API_URL}/accounts/register/`, {
      email,
      password,
      role,
      first_name,
      last_name
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
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
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Projects API
export const fetchProjects = async () => {
  try {
    const response = await api.get("/projects/");
    return response.data;
  } catch (error) {
    console.error("fetchProjects error:", error);
    // Return empty results on error
    return { results: [], count: 0 };
  }
};

// User API
export const fetchCurrentUser = async () => {
  try {
    const response = await api.get("/accounts/users/me/");
    return response.data;
  } catch (error) {
    console.error("fetchCurrentUser error:", error);
    throw error;
  }
};

export default api;
