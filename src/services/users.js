import api from "./apiConfig";
import { jwtDecode } from "jwt-decode";

export const register = async (credentials) => {
  console.log("registering..");
  try {
    const resp = await api.post("/users/register", credentials);
    localStorage.setItem("token", resp.data.token);
    const user = jwtDecode(resp.data.token);
    return user;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  console.log("logging in..");
  try {
    const resp = await api.post("/users/login", credentials);
    localStorage.setItem("token", resp.data.token); // Save the token to localStorage
    const user = jwtDecode(resp.data.token); // Decode the token to get user info
    return user;
  } catch (error) {
    throw error;
  }
};

export const verify = async () => {
  console.log("verifying..");
  const token = localStorage.getItem("token");
  if (token) {
    const res = await api.get("/users/verify");
    return res.data;
  }
  return false;
};

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const res = await api.get("/users/profile");
      return res.data;
    } catch (err) {
      console.error("Error fetching user profile:", err.message);
      return null;
    }
  }
  return false;
};
