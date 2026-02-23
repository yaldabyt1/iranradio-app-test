import axios from "axios";

const client = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// demo user header (بدون Auth)
client.interceptors.request.use((config) => {
  config.headers["X-DEMO-USER"] = "1";
  return config;
});

export default client;