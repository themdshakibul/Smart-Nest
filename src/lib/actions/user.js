"use server"
import { serverMutation } from "../core/server"

export const updateUser=async(userId, updatedUser)=>{
  return serverMutation(`/api/users/${userId}`, updatedUser, "PATCH")
}