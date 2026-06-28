"use client";
import { useSession } from "@/lib/auth-client";
import { MapPin } from "@gravity-ui/icons";
import { Card, Link } from "@heroui/react";
import { motion } from "framer-motion";
import { Bath, BedDouble, Square } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";


const PropertyCard = ({ property, itemVariants }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const handleViewDetails = (e) => {
    e.preventDefault();
    if (!user) {
      e.preventDefault();
      router.push(`/signin?redirect=/properties/${property._id}`);
      return;
    }
    router.push(`/properties/${property._id}`);
  };
 
  return (
    <motion.div key={property._id} variants={itemVariants} layout>
      <Card className="bg-surface-container-lowest border border-border/40 overflow-hidden hover:shadow-xl transition-all duration-300 rounded-2xl group flex flex-col h-full">
        <div className="relative aspect-[4/3] w-full bg-surface-container overflow-hidden">
          {property.images?.[0] ? (
            <motion.div
              className="w-full h-full"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              <Image
                src={property.images[0]}
                alt={property.title}
                height={400}
                width={400}
                className="object-cover w-full h-full rounded-t-2xl"
                loading="lazy"
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted/60 text-xs uppercase tracking-wider font-body">
              Image Coming Soon
            </div>
          )}
          {Number(property.rentPrice) > 15000 && (
            <span className="absolute top-4 left-4 bg-midnight-emerald/90 backdrop-blur-sm text-white font-body text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm z-10">
              Exclusive Listing
            </span>
          )}
          {property.propertyType && (
            <span className="absolute top-4 right-4 bg-secondary/90 backdrop-blur-sm text-white font-body text-[11px] font-medium px-2.5 py-1 rounded-full shadow-sm z-10">
              {property.propertyType}
            </span>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
          <div>
            <h3 className="font-heading text-xl text-primary font-semibold tracking-wide line-clamp-1 mb-2 group-hover:text-secondary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5 text-muted text-xs font-body">
              <MapPin size={13} className="text-muted/80" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/30 text-xs font-body text-muted">
            <div className="flex items-center gap-1.5">
              <BedDouble size={14} className="text-muted/70" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center border-x border-border/30">
              <Bath size={14} className="text-muted/70" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <Square size={13} className="text-muted/70" />
              <span>{Number(property.size || 0).toLocaleString()} Sqft</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="font-heading text-lg font-bold text-primary">
                ${Number(property.rentPrice || 0).toLocaleString()}
              </span>
              <span className="text-muted text-xs font-body">
                /{property.rentType === "Monthly" ? "mo" : "yr"}
              </span>
            </div>
            <Link
              href={`/properties/${property._id}`}
              onClick={handleViewDetails}
            >
              <motion.button
                whileHover={{ x: 3 }}
                className="text-secondary hover:text-champagne font-body font-bold text-sm underline underline-offset-4 decoration-2 transition-colors duration-200 py-1 flex items-center gap-0.5 cursor-pointer"
              >
                View Details
              </motion.button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PropertyCard;
