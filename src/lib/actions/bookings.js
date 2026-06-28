"use server"
import { protectedMutation } from "../core/server"

export const updateBookingStatus=async(bookingId,status)=>{
    const payload = { BookingStatus: status };
    return protectedMutation(`/api/bookings/${bookingId}`,payload,"PATCH")
}