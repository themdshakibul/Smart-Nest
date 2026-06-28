import { requireRole } from "@/lib/core/session";


const TenantLayout = async({children}) => {
    await requireRole("tenant")
    return children;
};

export default TenantLayout;