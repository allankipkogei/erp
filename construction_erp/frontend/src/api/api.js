import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // ✅ Django backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header
api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

// Response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const auth = JSON.parse(localStorage.getItem("auth"));
        const refreshToken = auth?.refreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Request new access token from Django
        const res = await axios.post("http://localhost:8000/api/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;

        // Update stored token
        auth.accessToken = newAccessToken;
        localStorage.setItem("auth", JSON.stringify(auth));

        // Update Authorization header and retry original request
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // If refresh fails, logout the user
        localStorage.removeItem("auth");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
