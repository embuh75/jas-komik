import { nhentaiClient } from "../lib/axios";

export const searchTag = async (type, query, limit = 10) => {
  const data = { type: type, query: query, limit: limit };
  const response = await nhentaiClient.post("/tags/search", data);

  return response.data;
};
