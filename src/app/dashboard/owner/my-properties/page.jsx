import { getPropertiesByUserId } from "@/lib/api/properties";
import { getUserSession } from "@/lib/core/session";
import Link from "next/link";
import PropertiesTableClient from "./PropertiesTableClient";

const MyProperties = async () => {
  const user = await getUserSession();
  const propertiesData = await getPropertiesByUserId(user?.id);
  const properties= propertiesData.data

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-primary font-semibold tracking-wide">
            My Properties
          </h1>
          <p className="font-body text-sm text-muted mt-1">
            Manage and monitor your architectural masterpieces.
          </p>
        </div>

        <Link href="/dashboard/owner/add-property">
          <button className="bg-primary hover:bg-primary/90 text-white font-body text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2 border border-border/20 cursor-pointer">
            <span className="text-lg">+</span> Add New Property
          </button>
        </Link>
      </div>

      {/* Client Side Interactive Table */}
      <PropertiesTableClient initialProperties={properties} />
    </div>
  );
};

export default MyProperties;
