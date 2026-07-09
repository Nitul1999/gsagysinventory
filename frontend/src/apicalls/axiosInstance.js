import axios from 'axios';
console.log(process.env.REACT_APP_API_URL);
const axiosInstance = axios.create({
  //baseURL: 'http://localhost:4000/ags', // 
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//  Attach JWT token automatically (if stored in localStorage)
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

//  Handle 401 (Unauthorized) or 403 (Forbidden) globally
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