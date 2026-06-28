import { getAllProperties } from "@/lib/api/properties";
import AllPropertiesTableClient from "./AllPropertiesTableClient";


export const metadata = {
  title: "Admin Panel | Manage Master Architecture Listings",
};


export default async function AllPropertiesPage(props) {
  
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const limit = 9; 

  const allPropertiesData = await getAllProperties(page, limit);

  return (
    <div className="font-body p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-3xl text-foreground tracking-tight">
          Global Asset Inventory
        </h1>
        <p className="text-muted text-xs mt-1 max-w-xl">
          Review, approve, modify, or permanently evict structural property
          entries across the entire user base landscape.
        </p>
      </div>

      <AllPropertiesTableClient initialProperties={allPropertiesData} />
    </div>
  );
}

// import { getFavoritePropertyByUserId } from '@/lib/api/AddToFavourite';
// import { getUserSession } from '@/lib/core/session';
// import React from 'react';
// import FavoritePropertiesTableClient from '../../tenant/favorites/FavoritePropertiesTableClient';


// const FavoriteProperties = async ({ searchParams }) => {
//     const user = await getUserSession();
//     if (!user || !user.id) {
//         return (
//             <div className="min-h-[50vh] flex items-center justify-center">
//                 <p className="font-body text-muted">Please sign in to view your favorites.</p>
//             </div>
//         );
//     }

//     const { page = 1 } = await searchParams;
//     const favoritePropertiesData = await getFavoritePropertyByUserId(user.id, Number(page));

//     return (
//         <div>
//             <section className="container mx-auto py-8 px-4 max-w-7xl">
//                 <div className="mb-6">
//                     <h1 className="font-heading text-3xl font-bold text-primary tracking-tight">
//                         My Favorites
//                     </h1>
//                     <p className="font-body text-sm text-muted mt-1">
//                         Manage and view all your saved properties for SmartNest.
//                     </p>
//                 </div>
//                 <FavoritePropertiesTableClient favoritePropertiesData={favoritePropertiesData || []} />
//             </section>
//         </div>
//     );
// };

// export default FavoriteProperties;