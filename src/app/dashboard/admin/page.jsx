
import { requireRole } from "@/lib/core/session";
import AdminDashboardClient from "./AdminDashboardClient";
import { getAdminAnalytics } from "@/lib/api/adminAnalytics";

export default async function AdminDashboardPage() {
  await requireRole("admin");
  const analytics = await getAdminAnalytics();

  return <AdminDashboardClient analytics={analytics} />;
}