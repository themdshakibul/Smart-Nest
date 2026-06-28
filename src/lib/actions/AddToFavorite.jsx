"use server"
import { protectedMutation, serverDelete, serverMutation } from "../core/server"

export const addToFavorite=async(favoriteProperty)=>{
    return protectedMutation("/api/favorites",favoriteProperty)
}

export const deleteFavorite = async (favoritePropertyId) => {
  return serverDelete(`/api/favorites/${favoritePropertyId}`);
};