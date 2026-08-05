import axios from "axios";

export const nhentaiClient = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: import.meta.env.NHENTAI_API_KEY ?? undefined,
  },
});
