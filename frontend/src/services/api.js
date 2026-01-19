import axios from "axios";

export const BASE_URL = (import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/+$/, "");

const api = axios.create({
  baseURL: BASE_URL + "/api",
  withCredentials: false,
});

// attach token automatically
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
