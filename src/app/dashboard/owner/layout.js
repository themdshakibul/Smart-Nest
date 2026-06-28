import { requireRole } from "@/lib/core/session";


const OwnerLayout = async ({children}) => {
    await requireRole("owner");
    return children;
};

export default OwnerLayout;