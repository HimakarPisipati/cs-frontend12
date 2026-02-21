import axios from "axios";

// 1. Create the Axios instance
const API = axios.create({
  // ✅ Fallback to localhost:5000 if the env variable is missing
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 2. Add the Interceptor
API.interceptors.request.use((req) => {
  // ✅ Check Session Storage first (for active session)
  let token = localStorage.getItem("token");

  // ✅ Check Local Storage as a backup (if you add "Remember Me" later)
  if (!token) {
    token = localStorage.getItem("token");
  }

  // ✅ Only attach the header if a token exists
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
}, (error) => {
  return Promise.reject(error);
});

export default API;