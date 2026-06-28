
import { getUserToken } from "../core/session";
import { serverFetch } from "../core/server";

export const getTenantAnalytics = async () => {
  const token = await getUserToken();
  return serverFetch("/api/tenant/analytics", token);
};
