import { nhentaiClient } from "../lib/axios";

export const getByTag = async (tag_id = 19440, sort = "popular-week", page = 1, per_page = 25) => {
  const response = await nhentaiClient.get(`/galleries/tagged?tag_id=${tag_id}&sort=${sort}&page=${page}&per_page=${per_page}`);

  return response.data;
};

export const getByID = async (id, include = null) => {
  let response = await nhentaiClient.get(`/galleries/${id}`);

  if (include !== null) {
    response = await nhentaiClient.get(`/galleries/${id}?include=${include}`);
  }

  return response.data;
}