import { requireRole } from "@/lib/core/session";
import TenantDashboardClient from "./TenantDashboardClient";
import { getTenantAnalytics } from "@/lib/api/tenantAnalytics";

export default async function TenantDashboardPage() {
  const user = await requireRole("tenant");
  const analytics = await getTenantAnalytics();

  return <TenantDashboardClient analytics={analytics} user={user} />;
}