

import { requireRole } from "@/lib/core/session";
import OwnerDashboardClient from "./OwnerDashboardClient";
import { getOwnerAnalytics } from "@/lib/api/ownerAnalytics";


export default async function OwnerDashboardPage() {
  await requireRole("owner");
  const analytics = await getOwnerAnalytics();

  return <OwnerDashboardClient analytics={analytics} />;
}
