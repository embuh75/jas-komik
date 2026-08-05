import { nhentaiClient } from "../lib/axios";

export const getUser = async (id, username) => {
  const response = await nhentaiClient.get(`/users/${id}/${username}`);

  return response.data;
};
