
import { redirect } from "next/navigation";

import { getUserSession } from "@/lib/core/session";
import EditPropertyForm from "./EditPropertyForm";
import { getPropertyByPropertyId } from "@/lib/api/properties";


export default async function EditPropertyPage({params}) {
  const user= await getUserSession();

  if (!user) {
    redirect("/login");
  }
   const property = await getPropertyByPropertyId(params.id);

  if (!property) {
    redirect("/dashboard/owner/my-properties");
  }
  
  return (
    <EditPropertyForm user={user} property={property}/>
  );
}