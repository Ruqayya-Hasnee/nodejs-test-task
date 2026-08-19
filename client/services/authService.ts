import { axios } from "@/utils/axios";
import { setToken } from "@/services/tokenService";

type SignupValues = {
  name: string;
  email: string;
  password: string;
};

type LoginValues = {
  email: string;
  password: string;
};

export const signup = async (values: SignupValues) => {
  return await axios.post("/auth/signup", values).then((res) => res.data);
};

export const login = async (values: LoginValues) => {
  return await axios.post("/auth/login", values).then((res) => {
    setToken(res.data);
    return res.data;
  });
};
