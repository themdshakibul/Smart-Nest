import Profile from "@/components/shared/Profile";
import { getUserSession } from "@/lib/core/session";

const adminProfile = async () => {
  const user = await getUserSession();
  return (
    <div>
      <Profile user={user} />
    </div>
  );
};

export default adminProfile;
