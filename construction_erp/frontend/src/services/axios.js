import axios from "axios";

// Create Axios instance with base URL
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach access token
API.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 by refreshing token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry only once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token available");

        // Use axios directly to avoid interceptor recursion
        const { data } = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
          refresh,
        });

        // Save new access token
        localStorage.setItem("access", data.access);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Refresh failed: log out
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;