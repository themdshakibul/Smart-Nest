
import { serverFetch } from "../core/server";

export const getAllBookings = async (token) => {
  return serverFetch("/api/bookings",token);
};

export const getBookingsByOwnerId = async (ownerId, token) => {
  return serverFetch(`/api/bookings?ownerId=${ownerId}`,token);
};

export const getBookingByTenantId = async (tenantId, token) => {
  return serverFetch(`/api/bookings?tenantId=${tenantId}`,token);
};
