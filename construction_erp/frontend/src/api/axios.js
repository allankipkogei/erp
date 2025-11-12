import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach access token
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

// Response interceptor to handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and the request has not already been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token");

        // Attempt to get new access token
        const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
          refresh: refresh,
        });

        const newAccess = response.data.access;
        localStorage.setItem("access", newAccess);

        // Update Authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return API(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out user
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login"; // redirect to login page
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
