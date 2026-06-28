"use client";

import PropertyCard from "@/components/shared/PropertyCard";
import { Input, ListBox, Pagination, Select } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  MapPin,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function AllPropertiesClient({
  propertiesData,
  activeFilters = {},
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const properties = propertiesData.data;
  const currentPage = propertiesData.page;
  const totalPages = propertiesData.totalPage;

  // Controlled state for all filter inputs
  const [location, setLocation] = useState(activeFilters.location || "");
  const [propertyType, setPropertyType] = useState(
    activeFilters.propertyType && activeFilters.propertyType !== "All"
      ? activeFilters.propertyType
      : "",
  );
  const [minPrice, setMinPrice] = useState(activeFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(activeFilters.maxPrice || "");
  const [sort, setSort] = useState(activeFilters.sort || "");

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const displayedCount = properties.length;
  const totalCount = propertiesData.totalData;

  const hasActiveFilters =
    location || propertyType || minPrice || maxPrice || sort;

  const updateSearchParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key !== "page") {
      params.delete("page");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    // Clear all local state
    setLocation("");
    setPropertyType("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    // Clear URL params
    router.push("?", { scroll: false });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-12"
    >
      {/* HEADER SECTION */}
      <motion.div variants={itemVariants} className="space-y-3 max-w-2xl">
        <h1 className="font-heading text-4xl md:text-5xl text-primary font-medium tracking-tight">
          Curated Exclusivity
        </h1>
        <p className="font-body text-muted text-sm md:text-base leading-relaxed">
          Discover an architectural journey through the world's most prestigious
          residences, from sky-high penthouses to serene coastal retreats.
        </p>
      </motion.div>

      {/* SEARCH AND FILTERS BAR */}
      <motion.div
        variants={itemVariants}
        className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/40 shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          {/* 1. Location */}
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10 pointer-events-none">
              <MapPin size={16} />
            </span>
            <Input
              aria-label="Location Search"
              className="w-full bg-background rounded-xl text-sm font-body pl-8"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={(e) => updateSearchParam("location", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  updateSearchParam("location", e.target.value);
              }}
            />
          </div>

          {/* 2. Property Type */}
          <div className="w-full">
            <Select
              aria-label="Filter by Property Type"
              selectedKey={propertyType}
              onSelectionChange={(key) => {
                const val = key === "All" ? "" : key;
                setPropertyType(val);
                updateSearchParam("propertyType", key);
              }}
            >
              <Select.Trigger className="w-full bg-background rounded-xl border border-border/60 px-4 py-2.5 text-sm flex items-center justify-between text-muted font-body h-[40px]">
                <Select.Value placeholder="Property Type" />
                <Select.Indicator>
                  <ChevronDown size={16} className="text-muted" />
                </Select.Indicator>
              </Select.Trigger>
              <Select.Popover className="bg-background border border-border rounded-xl shadow-xl p-1 min-w-[200px]">
                <ListBox>
                  {["All", "Villa", "Penthouse", "Apartment", "Mansion"].map(
                    (type) => (
                      <ListBox.Item
                        key={type}
                        id={type}
                        textValue={type}
                        className="p-2 text-sm text-foreground hover:bg-card rounded-lg cursor-pointer font-body"
                      >
                        {type === "All" ? "All Types" : type}
                      </ListBox.Item>
                    ),
                  )}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          {/* 3. Min Price */}
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-body z-10 pointer-events-none">
              $
            </span>
            <Input
              aria-label="Minimum Budget Filter"
              type="number"
              className="w-full bg-background rounded-xl text-sm font-body pl-6"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={(e) => updateSearchParam("minPrice", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  updateSearchParam("minPrice", e.target.value);
              }}
            />
          </div>

          {/* 4. Max Price */}
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-body z-10 pointer-events-none">
              $
            </span>
            <Input
              aria-label="Maximum Budget Filter"
              type="number"
              className="w-full bg-background rounded-xl text-sm font-body pl-6"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={(e) => updateSearchParam("maxPrice", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  updateSearchParam("maxPrice", e.target.value);
              }}
            />
          </div>

          {/* 5. Sort */}
          <div className="w-full">
            <Select
              aria-label="Sort properties by price"
              selectedKey={sort}
              onSelectionChange={(key) => {
                setSort(key);
                updateSearchParam("sort", key);
              }}
            >
              <Select.Trigger className="w-full bg-background rounded-xl border border-border/60 px-4 py-2.5 text-sm flex items-center justify-between text-muted font-body h-[40px]">
                <Select.Value placeholder="Sort by Price" />
                <Select.Indicator>
                  <ChevronDown size={16} className="text-muted" />
                </Select.Indicator>
              </Select.Trigger>
              <Select.Popover className="bg-background border border-border rounded-xl shadow-xl p-1 min-w-[200px]">
                <ListBox>
                  <ListBox.Item
                    id="low-to-high"
                    textValue="Price: Low to High"
                    className="p-2 text-sm text-foreground hover:bg-card rounded-lg cursor-pointer font-body"
                  >
                    Price: Low to High
                  </ListBox.Item>
                  <ListBox.Item
                    id="high-to-low"
                    textValue="Price: High to Low"
                    className="p-2 text-sm text-foreground hover:bg-card rounded-lg cursor-pointer font-body"
                  >
                    Price: High to Low
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </div>

        {/* Reset row */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <p className="text-xs text-muted font-body">
                  Filters are active — results have been narrowed.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-xs font-body font-medium text-muted hover:text-primary border border-border/50 hover:border-border rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Reset filters</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* COUNTER */}
      <motion.div
        variants={itemVariants}
        className="pt-4 border-t border-border/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <h2 className="font-heading text-2xl text-primary font-medium">
            Featured Listings
          </h2>
          <p className="text-xs text-muted font-body">
            Showing{" "}
            <span className="font-semibold text-primary">{displayedCount}</span>{" "}
            out of{" "}
            <span className="font-semibold text-primary">{totalCount}</span>{" "}
            properties
          </p>
        </div>
      </motion.div>

      {/* LISTINGS */}
      <AnimatePresence mode="wait">
        {properties.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 bg-card/20 rounded-2xl border border-dashed border-border/60"
          >
            <SlidersHorizontal className="mx-auto text-muted mb-4" size={32} />
            <p className="text-muted font-body font-medium">
              No luxury estates matched your selection criteria.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  itemVariants={itemVariants}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <motion.div
                variants={itemVariants}
                className="flex justify-center pt-10"
              >
                <Pagination className="flex flex-col sm:flex-row items-center gap-4 bg-card/20 p-4 rounded-xl border border-border/40">
                  <Pagination.Summary className="text-xs text-muted font-body">
                    Page {currentPage} of {totalPages}
                  </Pagination.Summary>
                  <Pagination.Content>
                    <Pagination.Item>
                      <Pagination.Previous
                        disabled={currentPage === 1}
                        onClick={() =>
                          currentPage > 1 &&
                          updateSearchParam("page", currentPage - 1)
                        }
                        className={`flex items-center gap-1 text-sm font-body ${currentPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                      >
                        <Pagination.PreviousIcon />
                        <span>Previous</span>
                      </Pagination.Previous>
                    </Pagination.Item>
                    {pages.map((pageNum) => (
                      <Pagination.Item key={pageNum}>
                        <Pagination.Link
                          isActive={currentPage === pageNum}
                          onClick={() => updateSearchParam("page", pageNum)}
                          className={`cursor-pointer font-body text-sm relative transition-colors ${currentPage === pageNum && "bg-secondary backdrop-blur-sm text-white"}`}
                        >
                          {pageNum}
                        </Pagination.Link>
                      </Pagination.Item>
                    ))}
                    <Pagination.Item>
                      <Pagination.Next
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          currentPage < totalPages &&
                          updateSearchParam("page", currentPage + 1)
                        }
                        className={`flex items-center gap-1 text-sm font-body ${currentPage === totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                      >
                        <span>Next</span>
                        <Pagination.NextIcon />
                      </Pagination.Next>
                    </Pagination.Item>
                  </Pagination.Content>
                </Pagination>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
