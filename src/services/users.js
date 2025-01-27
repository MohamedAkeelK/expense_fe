import api from "./apiConfig";
import { jwtDecode } from "jwt-decode";

export const register = async (credentials) => {
  try {
    const resp = await api.post("/user/sign-up", credentials);
    localStorage.setItem("token", resp.data.token);
    const user = jwtDecode(resp.data.token);
    return user;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const resp = await api.post("/user/sign-in", credentials);
    localStorage.setItem("token", resp.data.token); // Save the token to localStorage
    const user = jwtDecode(resp.data.token); // Decode the token to get user info
    return user;
  } catch (error) {
    throw error;
  }
};
