"use client";

import { Input, ListBox, Select } from "@heroui/react";
import { ChevronDown, MapPin, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Banner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Track state synchronized with browser queries including min/max price
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    propertyType: searchParams.get("propertyType") || "All",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  // Unified routing handler function
  const updateSearchParam = (key, value) => {
    const resolvedValue =
      typeof value === "object" && value.currentKey ? value.currentKey : value;

    const updatedFilters = { ...filters, [key]: resolvedValue };
    setFilters(updatedFilters);

    const params = new URLSearchParams();

    if (updatedFilters.location.trim()) {
      params.set("location", updatedFilters.location.trim());
    }
    if (updatedFilters.propertyType && updatedFilters.propertyType !== "All") {
      params.set("propertyType", updatedFilters.propertyType);
    }
    if (updatedFilters.minPrice) {
      params.set("minPrice", updatedFilters.minPrice);
    }
    if (updatedFilters.maxPrice) {
      params.set("maxPrice", updatedFilters.maxPrice);
    }
    if (updatedFilters.sort) {
      params.set("sort", updatedFilters.sort);
    }

    // Instantly redirects onto your listings search page matrix
    router.push(`/properties?${params.toString()}`);
  };

  // Helper for manual search button trigger
  const handleSearchSubmit = () => {
    updateSearchParam("location", filters.location);
  };

  // Framer Motion Variants for Staggered Children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] }, // Elegant custom cubic-bezier
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 overflow-hidden">
      {/* Background Underlay Graphics with Initial Fade-In */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.7, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/drvj2pqs7/image/upload/v1782114488/ultra_luxurious_coastal_mansion_at_sunset_overlooking_the_mediterranean_sea_fsqicc.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background/60" />
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 w-full"
      >
        {/* Animated Typography Headers */}
        <motion.div variants={itemVariants} className="max-w-3xl mb-12">
          <h1 className="font-heading text-5xl md:text-7xl text-foreground leading-[1.1] mb-6 text-balance tracking-tight">
            Discover Your Next{" "}
            <span className="italic font-normal text-champagne-accent text-[#FDB73E]">
              Masterpiece
            </span>{" "}
            Living.
          </h1>
          <p className="font-body text-lg md:text-xl text-foreground/80 max-w-xl">
            Experience the world's most exclusive rentals, curated for those who
            seek the extraordinary in every detail.
          </p>
        </motion.div>

        {/* Animated Search Bar Grid Container */}
        <motion.div 
          variants={itemVariants}
          className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/40 shadow-xl max-w-6xl w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            
            {/* 1. Location Input Field */}
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10 pointer-events-none">
                <MapPin size={16} />
              </span>
              <Input
                aria-label="Location Search"
                className="w-full bg-background rounded-xl text-sm font-body pl-8"
                placeholder="Location"
                value={filters.location}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, location: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchSubmit();
                }}
              />
            </div>

            {/* 2. Property Type Select Dropdown */}
            <div className="w-full">
              <Select
                aria-label="Filter by Property Type"
                onSelectionChange={(key) => updateSearchParam("propertyType", key)}
              >
                <Select.Trigger className="w-full bg-background rounded-xl border border-border/60 px-4 py-2.5 text-sm flex items-center justify-between text-muted font-body h-[40px]">
                  <Select.Value
                    placeholder={
                      filters.propertyType === "All" || !filters.propertyType
                        ? "Property Type"
                        : filters.propertyType
                    }
                  />
                </Select.Trigger>

                <Select.Popover className="bg-background border border-border rounded-xl shadow-xl p-1 min-w-[200px]">
                  <ListBox>
                    {["All", "Villa", "Penthouse", "Apartment", "Mansion"].map((type) => (
                      <ListBox.Item
                        key={type}
                        id={type}
                        textValue={type}
                        className="p-2 text-sm text-foreground hover:bg-card rounded-lg cursor-pointer font-body"
                      >
                        {type === "All" ? "All Types" : type}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* 3. Max Price Filter */}
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-body z-10 pointer-events-none">$</span>
              <Input
                aria-label="Maximum Budget Filter"
                type="number"
                className="w-full bg-background rounded-xl text-sm font-body pl-6"
                placeholder="Max price"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchSubmit();
                }}
              />
            </div>

            {/* 4. Min Price Filter */}
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-body z-10 pointer-events-none">$</span>
              <Input
                aria-label="Minimum Budget Filter"
                type="number"
                className="w-full bg-background rounded-xl text-sm font-body pl-6"
                placeholder="Min price"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchSubmit();
                }}
              />
            </div>

            {/* 5. Search Submission Button with Interactive Hover Scales */}
            <div className="w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearchSubmit}
                className="w-full bg-midnight-emerald hover:opacity-90 text-white font-body font-medium transition-opacity rounded-xl h-[40px] flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
              >
                <Search size={16} />
                <span>Search Estates</span>
              </motion.button>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}