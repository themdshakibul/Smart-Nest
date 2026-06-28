
const baseURL = process.env.NEXT_PUBLIC_URL || "";

export const getAllReviews = async () => {
  const res = await fetch(`${baseURL}/api/reviews`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

// const baseURL = process.env.NEXT_PUBLIC_URL || "";

// export const clientGetAllReviews = async () => {
//   const res = await fetch(`${baseURL}/api/reviews`);
//   if (!res.ok) throw new Error("Failed to fetch reviews");
//   return res.json();
// };
