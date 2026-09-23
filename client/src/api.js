import axios from "axios";

// In production, set VITE_API_URL to your deployed server (e.g. https://api.example.com/api)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // send the httpOnly auth cookie with every request
});

export const getErrorMessage = (err) =>
  err.response?.data?.message || "Something went wrong. Check your connection and try again.";

export default api;
