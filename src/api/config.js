import { nhentaiClient } from "../lib/axios";

export const getConfig = async () => {
  const response = await nhentaiClient.get("/config");

  return response.data;
};

export const getCDN = async () => {
  const response = await nhentaiClient.get("/cdn");

  return response.data;
};
