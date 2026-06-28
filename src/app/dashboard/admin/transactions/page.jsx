// src/app/dashboard/admin/transactions/page.jsx
import { getAllBookings } from "@/lib/api/booking";
import AllTransactionsTableClient from "./AllTransactionsTableClient";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function TransactionsPage() {
  const response = await auth.api.getToken({
    headers: await headers(),
  });
  const token = response?.token;
  const allBookings = await getAllBookings(token);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <AllTransactionsTableClient initialBookings={allBookings || []} />
    </div>
  );
}
