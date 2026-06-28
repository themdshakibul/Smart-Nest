
import { getUserToken } from "../core/session";
import { serverFetch } from "../core/server";

export const getAdminAnalytics = async () => {
  const token = await getUserToken();
  return serverFetch("/api/admin/analytics", token);
};