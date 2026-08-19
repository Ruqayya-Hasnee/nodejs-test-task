import Axios from "axios";
import { getToken, removeToken } from "@/services/tokenService";

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["auth-token"] = token;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      removeToken();
    }
    throw error;
  },
);
