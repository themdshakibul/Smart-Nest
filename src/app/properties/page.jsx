import { getFilteredProperties } from "@/lib/api/properties";
import AllPropertiesClient from "./AllPropertiesClient";



const AllPropertiesPage = async ({ searchParams }) => {
  
  const params = await searchParams;

  const queryFilters = {
    location: params.location || "",
    propertyType: params.propertyType || "All",
    minPrice: params.minPrice || "",
    maxPrice: params.maxPrice || "",
    sort: params.sort || "",
    status: "approved" || "",
    page: params.page || "1",
  };

  const allPropertiesData = await getFilteredProperties(queryFilters);
  

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <AllPropertiesClient
        propertiesData={allPropertiesData || []}
        activeFilters={queryFilters}
      />
    </div>
  );
};

export default AllPropertiesPage;
