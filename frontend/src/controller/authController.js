import axios from "axios";

const BASE_URL = "http://localhost:5001/api/auth";
const TOKEN_KEY = "medilease_token";
const USER_KEY = "medilease_user";

const saveAuthData = ({ token, user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const register = async (formData) => {
  const response = await axios.post(`${BASE_URL}/register`, formData);
  if (response.data.token) {
    saveAuthData(response.data);
  }
  return response.data;
};

export const login = async (credentials) => {
  const response = await axios.post(`${BASE_URL}/login`, credentials);
  if (response.data.token) {
    saveAuthData(response.data);
  }
  return response.data;
};
