"use server"

import { protectedMutation } from "../core/server"

export const postReviews=async(newReview)=>{
    return protectedMutation("/api/reviews",newReview)
}