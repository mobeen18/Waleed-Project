import { getToken } from '../controller/authController';

export const getAuthConfig = () => {
  const token = getToken();
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  }
  return {
    headers: {
      "Content-Type": "application/json",
    },
  };
};