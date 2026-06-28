"use client";

import React from 'react';
import { motion } from "framer-motion";
import PropertyCard from './PropertyCard';



const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
  },
};

export default function FeaturedGridClient({ properties }) {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12 text-muted font-body">
        No featured properties available at the moment.
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible" // Triggers beautifully as the user scrolls down
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          itemVariants={itemVariants}
        />
      ))}
    </motion.div>
  );
}