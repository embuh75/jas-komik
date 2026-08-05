import { nhentaiClient } from "../lib/axios";

export const getCDN = async () => {
  const response = await nhentaiClient.get("/config");

  return response.data;
};
