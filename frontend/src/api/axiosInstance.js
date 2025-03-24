import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:1337/api",
});

API.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }
  return config;
});

export default API;
