

import { protectedFetch, serverFetch } from "../core/server";

export const getFavoritePropertyByUserId = async (tenantId, page=1) => {
  return protectedFetch(`/api/favorites?tenantId=${tenantId}&page=${page}&limit=10`);
};
export const getFavoriteButtonToggle = async (tenantId, propertyId) => {
  return serverFetch(`/api/favorites?tenantId=${tenantId}&propertyId=${propertyId}`);
};
