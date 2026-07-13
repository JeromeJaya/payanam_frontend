import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // change to your backend
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ── 403 SUSPENDED/BANNED ACCOUNT → force logout immediately ─────
    if (
      error.response?.status === 403 &&
      /suspend|ban|deactivat/i.test(error.response?.data?.message || "")
    ) {
      localStorage.removeItem("payanam_user");
      localStorage.removeItem("payanam_token");
      document.cookie = "accessToken=; max-age=0; path=/";
      document.cookie = "refreshToken=; max-age=0; path=/";
      window.dispatchEvent(new CustomEvent("payanam:force-logout", {
        detail: error.response?.data?.message
      }));
      // Redirect to admin login if on admin page, otherwise regular login
      const isAdminPage = window.location.pathname.startsWith("/admin");
      const loginPath = isAdminPage ? "/admin/login" : "/login";
      if (window.location.pathname !== loginPath) {
        window.location.href = loginPath;
      }
      return Promise.reject(error);
    }

    // if access token expired and request not retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/auth/refresh" &&
      originalRequest.url !== "/api/auth/login" &&
      originalRequest.url !== "/api/users/profile"
    ) {
      originalRequest._retry = true;

      try {
        // ask backend to create a new accessToken cookie
        await api.post("/api/auth/refresh");

        // retry the original failed request
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh failed:", refreshError);
        // Refresh truly failed — clear session
        localStorage.removeItem("payanam_user");
        localStorage.removeItem("payanam_token");
        document.cookie = "accessToken=; max-age=0; path=/";
        document.cookie = "refreshToken=; max-age=0; path=/";
        window.dispatchEvent(new CustomEvent("payanam:force-logout"));
        // Redirect to admin login if on admin page, otherwise regular login
        const isAdminPage = window.location.pathname.startsWith("/admin");
        const loginPath = isAdminPage ? "/admin/login" : "/login";
        if (window.location.pathname !== loginPath) {
          window.location.href = loginPath;
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;