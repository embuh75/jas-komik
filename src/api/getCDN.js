import { nhentaiClient } from "../lib/axios";

export const getCDN = async () => {
  const response = await nhentaiClient.get("/cdn");

  return response.data;
};
