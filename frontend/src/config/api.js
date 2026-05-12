import axios from "axios";

// API Configuration - uses environment variables for flexibility
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const API = axios.create({
  baseURL: API_URL,
});

export default API;
