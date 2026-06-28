"use server"
import { protectedMutation } from "../core/server";

export const rejectionReason = async (newRejection) => {
  return protectedMutation("/api/rejections", newRejection);
};
