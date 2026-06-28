import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../auth";

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user || null;
};

export const getUserToken = async () => {
  try {
    const response = await auth.api.getToken({
      headers: await headers(),
    });
    return response?.token || null;
  } catch {
    return null;
  }
};

export const requireUser=async()=>{
 const user = await getUserSession();
  if (!user) {
    redirect("/signin");
  } 
  return user;
}
export const requireRole = async (role) => {
  const user = await getUserSession();
  if (!user) {
    redirect("/signin");
  }
  if (user?.role !== role) {
    redirect("/unauthorized");
  }
  return user;
};
