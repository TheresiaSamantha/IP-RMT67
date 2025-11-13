import axios from "axios";

// Prefer environment variable via Vite. Define VITE_API_BASE_URL in .env files.
const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://127.0.0.1:3000";

export const apiKey = axios.create({
  baseURL: BASE_URL,
});
