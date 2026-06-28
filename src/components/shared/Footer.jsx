"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
  // Stagger configurations for a premium appearance
  const footerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 15,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    },
  };

  return (
    <motion.footer 
      className="bg-tertiary text-white transition-colors duration-300"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={footerVariants}
    >
      {/* Upper Footer Links Section */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <motion.div variants={itemVariants} className="flex flex-col">
           <Link href="/">
              <div className="flex items-center gap-3">
                <Image
                  src="https://res.cloudinary.com/drvj2pqs7/image/upload/v1782473343/SmartNest_Final_Logo_xc47mk.png"
                  alt="SmartNest Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
                <p className="font-heading font-bold text-2xl tracking-tight">
                  Smart<span className="text-secondary">Nest</span>
                </p>
              </div>
            </Link>
          <p className="font-body text-sm text-white/70 mb-8 max-w-xs leading-relaxed">
            Connecting discerning tenants with the world's most exceptional living spaces.
          </p>
          
          {/* Social icons utilizing fallback system icons or raw layout styles */}
          <div className="flex gap-4">
            {["𝕏", "📸", "🔗"].map((icon, idx) => (
              <a 
                key={idx}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-champagne hover:text-midnight-emerald transition-all duration-300 text-sm" 
                href="#"
              >
                {icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Explore Columns */}
        <motion.div variants={itemVariants}>
          <h4 className="font-body text-sm uppercase tracking-[0.2em] font-semibold text-white mb-6">
            Explore
          </h4>
          <ul className="space-y-4">
            <li><Link className="font-body text-sm text-white/70 hover:text-champagne transition-colors" href="/">About Us</Link></li>
            <li><Link className="font-body text-sm text-white/70 hover:text-champagne transition-colors" href="/properties">All Properties</Link></li>
            <li><Link className="font-body text-sm text-white/70 hover:text-champagne transition-colors" href="/properties">Top Locations</Link></li>
            <li><Link className="font-body text-sm text-white/70 hover:text-champagne transition-colors" href="/">Our Story</Link></li>
          </ul>
        </motion.div>

        {/* Support Columns */}
        <motion.div variants={itemVariants}>
          <h4 className="font-body text-sm uppercase tracking-[0.2em] font-semibold text-white mb-6">
            Support
          </h4>
          <ul className="space-y-4">
            <li><Link className="font-body text-sm text-white/70 hover:text-champagne transition-colors" href="/">Contact</Link></li>
            <li><Link className="font-body text-sm text-white/70 hover:text-champagne transition-colors" href="/">Careers</Link></li>
            <li><Link className="font-body text-sm text-white/70 hover:text-champagne transition-colors" href="/">Privacy Policy</Link></li>
            <li><Link className="font-body text-sm text-white/70 hover:text-champagne transition-colors" href="/">Terms of Service</Link></li>
          </ul>
        </motion.div>

        {/* Newsletter Input Box */}
        <motion.div variants={itemVariants}>
          <h4 className="font-body text-sm uppercase tracking-[0.2em] font-semibold text-white mb-6">
            Newsletter
          </h4>
          <p className="font-body text-sm text-white/70 mb-4 leading-relaxed">
            Subscribe to receive exclusive off-market listings.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input 
              className="bg-white/5 border border-white/10 font-body text-sm rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-champagne text-white placeholder-white/40 transition-colors" 
              placeholder="Your Email" 
              type="email"
              required
            />
            <button 
              type="submit"
              className="bg-champagne text-midnight-emerald px-5 py-2.5 rounded-xl font-body text-sm font-semibold hover:brightness-110 active:scale-98 transition-all"
            >
              Join
            </button>
          </form>
        </motion.div>
      </div>

      {/* Sub Footer Bordered Copyright Info */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50">
        <p className="font-body text-xs tracking-wide">
          &copy; 2026 Luxe Estate. All rights reserved.
        </p>
        <div className="flex gap-8">
          <Link className="font-body text-xs tracking-wide hover:text-white transition-colors" href="/">Privacy</Link>
          <Link className="font-body text-xs tracking-wide hover:text-white transition-colors" href="/">Terms</Link>
        </div>
      </div>
    </motion.footer>
  );
}