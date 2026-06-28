
import { getUserToken } from "../core/session";
import { serverFetch } from "../core/server";

export const getOwnerAnalytics = async () => {
  const token = await getUserToken();
  return serverFetch("/api/owner/analytics", token);
};
