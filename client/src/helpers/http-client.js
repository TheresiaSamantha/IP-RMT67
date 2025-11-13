import axios from "axios";

export const apiKey = axios.create({
  baseURL: "http://127.0.0.1:3000",
  // baseURL: "https://service.cozydish.cloud",
});
