import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // change to your backend
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if access token expired and request not retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/auth/refresh" &&
      originalRequest.url !== "/api/auth/login"
    ) {
      originalRequest._retry = true;

      try {
        // ask backend to create a new accessToken cookie
        await api.post("/api/auth/refresh");

        // retry the original failed request
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;