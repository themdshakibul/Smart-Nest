import { getFavoritePropertyByUserId } from "@/lib/api/AddToFavourite";
import { getUserSession } from "@/lib/core/session";
import FavoritePropertiesTableClient from "./FavoritePropertiesTableClient";

const FavoriteProperties = async ({ searchParams }) => {
  const user = await getUserSession();

  const params = await searchParams;
  const page = Number(params?.page) || 1;

  if (!user || !user.id) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p>Please sign in to view your favorites.</p>
      </div>
    );
  }

  const favoritePropertiesData = await getFavoritePropertyByUserId(
    user.id,
    page,
  );

  return (
    <FavoritePropertiesTableClient
      favoritePropertiesData={favoritePropertiesData}
    />
  );
};

export default FavoriteProperties;
