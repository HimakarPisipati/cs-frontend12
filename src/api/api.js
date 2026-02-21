import axios from "axios";

// 1. Create the Axios instance
const API = axios.create({
  // ✅ Fallback to localhost:5000 if the env variable is missing
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 2. Add the Interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
}, (error) => {
  return Promise.reject(error);
});

export default API;