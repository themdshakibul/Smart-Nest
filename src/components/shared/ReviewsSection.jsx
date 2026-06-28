"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Skeleton } from "@heroui/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getAllReviews } from "@/lib/api/reviews";

const FALLBACK_BG = "#00234B";

// Luxury stagger configuration for parent container
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Smooth lift-up animation for individual items
const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 50, damping: 15 } 
  },
};

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllReviews()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.reviews ?? []);
        setReviews(list.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container)]/60 transition-colors duration-300 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Animated Headers */}
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.18em] font-semibold mb-2 text-secondary"
          >
            What Tenants Say
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl font-normal text-midnight-emerald dark:text-primary"
          >
            Tenant Experiences
          </motion.h2>
        </div>

        {/* Animated Grid Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <motion.div key={`skeleton-${i}`} variants={cardVariants}>
                  <ReviewSkeleton />
                </motion.div>
              ))
            : reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
        </motion.div>
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  const { tenantName, tenantImage, tenantLocation, rating = 5, comment } = review;

  const clampedRating = Math.min(5, Math.max(0, Math.round(rating)));

  const initials = tenantName
    ? tenantName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ 
        y: -6, 
        scale: 1.015,
        boxShadow: "0 12px 30px -10px rgba(0,0,0,0.08)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="flex flex-col p-8 rounded-2xl border border-border/10 bg-card dark:bg-[var(--surface-container)] shadow-sm transition-colors duration-300 h-full"
    >
      {/* Stars */}
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            strokeWidth={0}
            fill={i < clampedRating ? "var(--champagne-accent)" : "var(--outline-variant)"}
          />
        ))}
      </div>

      {/* Comment — flex-grow pins author to bottom */}
      <p className="text-sm leading-relaxed italic flex-grow mb-0 text-muted">
        &ldquo;{comment}&rdquo;
      </p>

      {/* Author — always pinned to card bottom */}
      <div className="mt-8 pt-5 border-t border-border/20">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative w-12 h-12 flex-shrink-0">
            {tenantImage ? (
              <>
                <Image
                  src={tenantImage}
                  alt={tenantName}
                  fill
                  className="rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = "flex";
                    }
                  }}
                />
                <div
                  className="w-12 h-12 rounded-full items-center justify-center text-sm font-medium text-white absolute inset-0"
                  style={{ background: FALLBACK_BG, display: "none" }}
                >
                  {initials}
                </div>
              </>
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium text-white"
                style={{ background: FALLBACK_BG }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Name + location */}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate font-label-md text-midnight-emerald dark:text-secondary">
              {tenantName}
            </p>
            <p className="text-xs mt-0.5 truncate text-muted">
              {tenantLocation ?? "Verified Tenant"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ReviewSkeleton() {
  return (
    <div
      className="flex flex-col p-8 rounded-2xl border border-border/10 bg-card dark:bg-[var(--surface-container)]"
      style={{ minHeight: "260px" }}
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-3.5 h-3.5 rounded-sm" />
        ))}
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-5/6 rounded-md" />
        <Skeleton className="h-3 w-4/6 rounded-md" />
      </div>
      <div className="mt-8 pt-5 flex items-center gap-3 border-t border-border/20">
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-2.5 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}