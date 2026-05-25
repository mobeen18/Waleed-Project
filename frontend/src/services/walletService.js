import axios from "axios";
import { getToken } from "../controller/authController";

const BASE_URL = "http://localhost:5000/api/wallet";

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
  const response = await axios.get(
    `${BASE_URL}/wallets`,
    {
      params: { search },
      ...getAuthConfig(),
    }
  );
  return response.data;
};

export const depositFunds = async (amount) => {
  const response = await axios.post(
    `${BASE_URL}/deposit`,
    { amount },
    getAuthConfig()
  );
  return response.data;
};

export const withdrawFunds = async (amount) => {
  const response = await axios.post(
    `${BASE_URL}/withdraw`,
    { amount },
    getAuthConfig()
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