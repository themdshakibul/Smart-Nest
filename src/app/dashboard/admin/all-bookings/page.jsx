import { getAllBookings } from '@/lib/api/booking';
import AllBookingsTableClient from './AllBookingsTableClient';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function AllBookingsPage() {
  const response = await auth.api.getToken({
      headers: await headers(),
    });
    const token = response?.token;

  const allBookings = await getAllBookings(token);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <AllBookingsTableClient initialBookings={Array.isArray(allBookings) ? allBookings : []} />
    </div>
  );
}