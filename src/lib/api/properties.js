
import { protectedFetch, serverFetch } from "../core/server";

export const getAllProperties = async (page = 1, limit = 9) => {
  return serverFetch(`/api/properties?page=${page}&limit=${limit}`);
};
export const getHomeProperties = async () => {
  return serverFetch(`/api/home-properties`);
};

export const getFilteredProperties = async ({
  location,
  propertyType,
  minPrice,
  maxPrice,
  sort,
  status,
  page = 1,
}) => {
  const params = new URLSearchParams();

  if (location) params.append("search", location);

  if (propertyType && propertyType !== "All")
    params.append("propertyType", propertyType);

  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);

  if (sort) params.append("sort", sort);
  if (status) params.append("status", status);

  params.append("page", page);

  const queryString = params.toString();
  const path = queryString
    ? `/api/properties?${queryString}`
    : "/api/properties";

  return serverFetch(path);
};

export const getPropertiesByUserId = async (userId) => {
  return protectedFetch(`/api/properties?userId=${userId}`);
};

export const getPropertyByPropertyId = async (id) => {
  const result = protectedFetch(`/api/properties/${id}`);
  if (!result) return null;
  return result;
};
