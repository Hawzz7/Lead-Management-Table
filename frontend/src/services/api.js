import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true // important for cookie-based auth
});

console.log("API BASE URL:", import.meta.env.VITE_API_URL)

export default API;
