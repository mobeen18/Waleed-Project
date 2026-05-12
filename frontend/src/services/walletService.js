import API from "../config/api";
import { getAuthConfig } from "../utils/authUtils";

export const getWalletSummary = async () => {
  const response = await API.get("/wallet/summary", getAuthConfig());
  return response.data;
};

export const getWallets = async (search = "") => {
  const response = await API.get("/wallet/wallets", {
    params: { search },
    ...getAuthConfig(),
  });
  return response.data;
};

export const depositFunds = async (amount) => {
  const response = await API.post(
    "/wallet/deposit",
    { amount },
    getAuthConfig(),
  );
  return response.data;
};

export const withdrawFunds = async (amount) => {
  const response = await API.post(
    "/wallet/withdraw",
    { amount },
    getAuthConfig(),
  );
  return response.data;
};

export const getTransactions = async (page = 1, limit = 20, type = "") => {
  const params = new URLSearchParams({ page, limit });
  if (type) params.append("type", type);
  const response = await API.get(
    `/wallet/transactions?${params}`,
    getAuthConfig(),
  );
  return response.data;
};

export const transferFunds = async (toUserId, amount, equipment) => {
  const response = await API.post(
    "/wallet/transfer",
    {
      toUserId,
      amount,
      equipment,
    },
    getAuthConfig(),
  );
  return response.data;
};
