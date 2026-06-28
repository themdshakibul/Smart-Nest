import "server-only";
import { getUserToken } from "./session";

const baseURL = process.env.NEXT_PUBLIC_URL;



export const serverFetch = async (path, token = null) => {
  const headers = {};
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${baseURL}${path}`, {
    method: "GET",
    headers: headers,
  });
  return res.json();
};

export const protectedFetch = async (path) => {
  const headers = {};
  const token=await getUserToken();
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${baseURL}${path}`, {
    method: "GET",
    headers: headers,
  });
  return res.json();
};

export const serverMutation = async (path, data, action = "POST", token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${baseURL}${path}`, {
    method: action,
    headers: headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  return res.json();
};

export const protectedMutation = async (path, data, action = "POST") => {
  const headers = {
    "Content-Type": "application/json",
  };
  const token=await getUserToken();
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${baseURL}${path}`, {
    method: action,
    headers: headers,
    body: data ? JSON.stringify(data) : undefined,
  });
  return res.json();
};

export const serverDelete = async (path) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const token=await getUserToken();
  
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${baseURL}${path}`, {
    method: "DELETE",
    headers,
  });
  return res.json();
};
