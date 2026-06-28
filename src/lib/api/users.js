
import { protectedFetch } from "../core/server";


export const getAllUsers = async (page = 1) => {
  return protectedFetch(`/api/users?page=${page}&limit=10`);
};
