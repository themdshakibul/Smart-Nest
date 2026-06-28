import { getBookingsByOwnerId } from '@/lib/api/booking';
import { getUserSession } from '@/lib/core/session';
import React from 'react';
import BookingRequestTableClient from './BookingRequestTableClient';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';


const BookingRequestOwner = async () => {
    const response = await auth.api.getToken({
        headers: await headers(),
      });
      const token = response?.token;
    const owner = await getUserSession();
    const ownerBookingRequests = await getBookingsByOwnerId(owner.id,token);
    console.log(ownerBookingRequests)
    
    // Ensure fallback to empty array if data layer fails or returns null
    const safeRequests = Array.isArray(ownerBookingRequests) ? ownerBookingRequests : [];

    return (
        <div className="container mx-auto py-10 px-4 max-w-7xl space-y-8">
            {/* Page Header Section using Theme Fonts */}
            <div className="flex flex-col gap-1.5 border-b border-border/20 pb-5">
                <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold tracking-wide">
                    Booking Requests
                </h1>
                <p className="font-body text-sm text-muted">
                    Manage real-time reservation applications, approve trustworthy tenants, or decline requests.
                </p>
            </div>
            
            {/* Client Interactive Presentational Layer */}
            <BookingRequestTableClient initialBookings={safeRequests} />
        </div>
    );
};

export default BookingRequestOwner;