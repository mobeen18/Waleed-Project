import { getToken } from '../controller/authController';

export const getAuthConfig = () => {
  const token = getToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};