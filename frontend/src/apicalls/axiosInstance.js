import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:4000/ags', // ✅ replace with your backend base URL
   baseURL: 'https://inventorybackend-4rqd.onrender.com/ags',
  headers: {
    'Content-Type': 'application/json',
  },
});
// 🟢 Attach JWT token automatically (if stored in localStorage)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔴 Handle 401 (Unauthorized) or 403 (Forbidden) globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      console.warn("⚠️ Session expired or unauthorized. Logging out...");
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;