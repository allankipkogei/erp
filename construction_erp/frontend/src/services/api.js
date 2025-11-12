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

// Handle token expiration and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 404 errors
    if (error.response?.status === 404) {
      console.error("API endpoint not found:", originalRequest.url);
      return Promise.reject(new Error("Resource not found. Please check the API endpoint."));
    }

    // Handle 401 errors (token expiration)
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
