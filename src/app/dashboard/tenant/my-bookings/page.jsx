import { getBookingByTenantId } from "@/lib/api/booking";
import { getUserSession } from "@/lib/core/session";
import MyBookingsClient from "./MyBookingsClient";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function MyBookings() {
  const response = await auth.api.getToken({
      headers: await headers(),
    });
    const token = response?.token;
  const user = await getUserSession();
  const bookings = await getBookingByTenantId(user.id,token);
  console.log(bookings)
  const safeRequests = Array.isArray(bookings) ? bookings : [];

  return <MyBookingsClient bookings={safeRequests} />;
}
