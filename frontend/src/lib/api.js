// frontend/src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://127.0.0.1:4000/api",
});

export default api; // ← export DEFAULT
