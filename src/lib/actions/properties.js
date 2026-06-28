// import "server-only";


// import { protectedMutation, serverDelete, serverMutation } from "../core/server";
// import { getUserToken } from "../core/session";

// export const createProperty = async (newProperty) => {
//   return protectedMutation("/api/properties", newProperty);
// };

// export const updateProperty = async (propertyId, updatedProperty) => {
//   const token = await getUserToken();
//   return serverMutation(`/api/properties/${propertyId}`, updatedProperty, "PATCH", token);
// };

// export const deleteProperty = async (propertyId) => {
//   return serverDelete(`/api/properties/${propertyId}`);
// };


// src/lib/actions/properties.js
"use server"; 

// ✅ These imports are safe — they run on the server, never in the browser
import { protectedMutation, serverDelete, serverMutation } from "../core/server";
import { getUserToken } from "../core/session";

export const createProperty = async (newProperty) => {
  return protectedMutation("/api/properties", newProperty);
};

export const updateProperty = async (propertyId, updatedProperty) => {
  const token = await getUserToken();
  return serverMutation(`/api/properties/${propertyId}`, updatedProperty, "PATCH", token);
};

export const deleteProperty = async (propertyId) => {
  return serverDelete(`/api/properties/${propertyId}`);
};