"use server";

import { protectedMutation } from "../core/server";


export const payment=async(paymentData)=>{
    return protectedMutation("/api/bookings", paymentData)
} 