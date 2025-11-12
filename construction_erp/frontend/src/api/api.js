import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // ✅ Added /api
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach access token to every request
api.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// ✅ Auto-refresh when token expires
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh });
        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
