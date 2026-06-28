"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";

// High-performance spring-based counting engine
function Counter({ value, suffix = "" }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 35,
    stiffness: 75,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, value, isInView]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString() + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0</span>;
}

export default function RentalStatistics() {
  const stats = [
    { target: 5000, suffix: "+", label: "Elite Properties" },
    { target: 20000, suffix: "+", label: "Happy Tenants" },
    { target: 99, suffix: "%", label: "Customer Satisfaction" },
  ];

  // Container variants to gracefully animate the entire layout zone
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="py-24 bg-midnight-emerald text-[var(--on-primary)] transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              {/* Animated Display Number */}
              <div className="font-heading text-5xl md:text-6xl font-bold text-champagne mb-2 tracking-tight">
                <Counter value={stat.target} suffix={stat.suffix} />
              </div>
              
              {/* Tracking Label */}
              <p className="font-body text-sm font-medium uppercase tracking-[0.2em] opacity-60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}