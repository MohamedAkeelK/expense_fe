import axios from "axios";

export const getToken = () => {
  return new Promise((resolve) => {
    resolve(`Bearer ${localStorage.getItem("token") || null}`);
  });
};

const api = axios.create({
  // baseURL: "https://devnoteapp-production.up.railway.app/api",
  baseURL: "http://localhost:8800/api",
});

api.interceptors.request.use(
  async function (config) {
    config.headers["Authorization"] = await getToken();
    return config;
  },
  function (error) {
    console.log("Request error: ", error);
    return Promise.reject(error);
  }
);

export default api;