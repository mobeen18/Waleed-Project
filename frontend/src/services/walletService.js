import axios from "axios";
import { getToken } from "../controller/authController";
import API_URL from "../config/api";

const BASE_URL = `${API_URL}/wallet`;

const getAuthConfig = () => {
  const token = getToken();
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

export const getWalletSummary = async () => {
  const response = await axios.get(`${BASE_URL}/summary`, getAuthConfig());
  return response.data;
};

export const getWallets = async (search = "") => {
  const response = await axios.get(`${BASE_URL}/wallets`, {
    params: { search },
    ...getAuthConfig(),
  });
  return response.data;
};

export const depositFunds = async (amount) => {
  const response = await axios.post(
    `${BASE_URL}/deposit`,
    { amount },
    getAuthConfig(),
  );
  return response.data;
};

export const withdrawFunds = async (amount) => {
  const response = await axios.post(
    `${BASE_URL}/withdraw`,
    { amount },
    getAuthConfig(),
  );
  return response.data;
};

export const getTransactions = async (page = 1, limit = 20, type = "") => {
  const params = new URLSearchParams({ page, limit });
  if (type) params.append("type", type);
  const response = await axios.get(
    `${BASE_URL}/transactions?${params}`,
    getAuthConfig(),
  );
  return response.data;
};

export const transferFunds = async (toUserId, amount, equipment) => {
  const response = await axios.post(
    `${BASE_URL}/transfer`,
    {
      toUserId,
      amount,
      equipment,
    },
    getAuthConfig()
  );
  return response.data;
};