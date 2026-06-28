"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background text-foreground px-6 py-24 transition-colors duration-300">
      <div className="text-center max-w-md mx-auto">
        
        {/* Dynamic Abstract 404 Visual Layer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 40, damping: 12 }}
          className="relative mb-8 select-none"
        >
          <h1 className="font-heading text-9xl font-bold tracking-tighter opacity-10 text-midnight-emerald dark:text-primary leading-none transition-colors duration-300">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-2xl font-medium tracking-wide text-midnight-emerald dark:text-primary bg-background px-4 transition-colors duration-300">
              Property Not Found
            </span>
          </div>
        </motion.div>

        {/* Messaging Area using text-muted token */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="font-body text-base text-muted mb-10 leading-relaxed transition-colors duration-300">
            The architectural masterpiece or hidden listing you are searching for has migrated, or the link has expired.
          </p>

          {/* Styled Buttons matching your specific branding utilities */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-body text-sm font-semibold text-white bg-midnight-emerald dark:bg-primary dark:text-tertiary shadow-sm hover:brightness-110 active:scale-98 transition-all text-center duration-300"
            >
              Return to Homepage
            </Link>
            
            <Link 
              href="/properties"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-body text-sm font-semibold border border-border/30 bg-surface hover:bg-card transition-all text-center text-foreground duration-300"
            >
              Explore Listings
            </Link>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}