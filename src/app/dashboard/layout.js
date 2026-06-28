
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { getUserSession } from "@/lib/core/session";

export default async function DashboardLayout({ children }) {
  const user = await getUserSession();
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      <DashboardSidebar user={user}/>
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}