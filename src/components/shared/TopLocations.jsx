"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function TopLocations() {
  const locations = [
    { 
      name: "Paris", 
      count: "142 Exclusive Properties", 
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8GdYDw7eMRrTBgbK2PDDFr0sO_VdPpK4vHs5akmEZrzmED6sQ-e5tQeNXuAaWE7KNIDddvAfVnnWktwKILMg2rAy_EUSBQaJHwRaZcnIGtjCGKf3XmZTb7AXto_ZVHe4IdDmK_IxGP82fI4FuLH8JFluxP0xaHEhnt_BLPjoxwanHjoFNuUEtiyuflBasphX0feIqkY6YcOPYBA4-bKkiy9y0vieNnANlShd7iz13o2bM5Naf6iMVv9qnOzi0dSl_m6Q7oeRP8g7W",
      className: "md:col-span-2 md:row-span-2 h-[400px] md:h-auto" 
    },
    { 
      name: "Dubai", 
      count: "85 Properties", 
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuByVP5qaZNMlIQeOx2HLQaexhntI_aNjueULDu1XnkTEFlFL0t_ab3k9rGEjxVySycMWW87z1emzhA8rSjotHNoLea9Zt7RkRsxkiUV5FwTc3bMqR6vJkTGJTBB7Z31QIRYPINXbS383rnOfZMDMLbzfhnR3FsDSOR5q1ZUES_J8alU1A13uieee46EADssWcC7mjOjfUK1VcWoMijNplo79aTVVAsev2T54dzUwRVEDuDgecq5TueUrOl46oV1uKP1ToG1ijwfEBr4",
      className: "md:col-span-1 md:row-span-2 h-[400px] md:h-auto" 
    },
    { 
      name: "New York", 
      count: "", 
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE_aR5XwfBkarZqmfLa91xz1ACUXTgrDSY3_kXWRLwv-l5M_t-D2La0TTNqeXr1AZxL1oZZERUfaW2TDyiRpWF298uWoU-8RLwUBYa1Cc4-gjf7d8L87YUoNN0nmyXskEidR9wG_CjNzBJ2Y5BXfaUSzoqzrL6jyyNzi1Kai8hSe_nuCqa9kINJnSWyOSVIzoZr5U3kwjKluBmVJegC1BT0TJxYS2_EH9Gy2Zx7JP0OIbKEsWr0wjxnfxfnyMcZQxVEFLEvBkd65cM",
      className: "md:col-span-1 md:row-span-1 h-[188px] md:h-auto" 
    },
    { 
      name: "Dhaka", 
      count: "", 
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvTy8i8OOl_CtVran0yhUzfDbMJ9qkKcGDrlm5_7We3kG8L0GEmnNOMbwHoLRlEAlvb1ITxLtzTveWIdYZAyGgfXU4_xaKyapVplAzmU0z70uYwOMdAk_vQ6vFtL-opKldCUhJdr2FyMlgI08r8P9-ENkYoU-AMV_wE74teDH1otQmq6WKUPzngkW0MHxCmCyDUOLb13LUU0cBxYf3cJSa8ELxQ9Icb5ihXW28dLpbCqVyDc21ZVj3h3vLajVSRLRucNF35lMAns48",
      className: "md:col-span-1 md:row-span-1 h-[188px] md:h-auto" 
    },
  ];

  // Container animation configuration for cascading drop-in
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Staggers the arrival of each grid item
      },
    },
  };

  // Card slide-up and fade configuration
  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 60, damping: 15 } 
    },
  };

  return (
    <section className="py-24 max-w-[1280px] mx-auto px-6 md:px-12 bg-background text-foreground transition-colors duration-300">
      
      {/* Header section styling with defined design tokens */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="block text-xs uppercase tracking-[0.25em] text-secondary dark:text-primary font-semibold mb-2 font-heading">
          Global Reach
        </span>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-midnight-emerald dark:text-primary">
          Premier Destinations
        </h2>
      </motion.div>
      
      {/* Responsive Bento Box Layout with Container Animations */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 md:h-[520px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {locations.map((loc, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className={loc.className}
          >
            <Link 
              href={`/properties?location=${encodeURIComponent(loc.name)}`}
              className="group relative w-full h-full rounded-[2rem] overflow-hidden cursor-pointer block border border-border/10"
            >
              {/* Native Next.js Responsive Image optimization */}
              <Image 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={loc.img} 
                alt={loc.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                priority={index === 0}
              />
              
              {/* Visual Contrast Layer */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Text Overlay */}
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="font-heading text-2xl font-medium tracking-wide drop-shadow-sm">
                  {loc.name}
                </h3>
                {loc.count && (
                  <p className="font-body text-xs tracking-wider text-white/80 mt-1">
                    {loc.count}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}