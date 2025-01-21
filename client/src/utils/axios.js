import axios from "axios";

export const api = axios.create({
  baseURL: "https://wono-admin-panel-be.vercel.app/",
});

export const axiosPrivate = axios.create({
  baseURL: "https://wono-admin-panel-be.vercel.app/",
  withCredentials: true,
});
