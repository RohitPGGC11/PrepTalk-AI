import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// Attach access token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


//  Handle expired token AFTER response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const token = localStorage.getItem("token");
    // If user never logged in → don't try refresh
    if (!token) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/refresh"
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post("http://localhost:4000/api/user-login/refresh",
          {},
          {withCredentials:true}
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("token", newAccessToken);

        // Update header for retry
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;

