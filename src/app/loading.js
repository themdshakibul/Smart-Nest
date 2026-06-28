"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6 transition-colors duration-300">
      <div className="text-center max-w-sm flex flex-col items-center justify-center">
        {/* Brand Header using EB Garamond */}
        <motion.h1
          className="font-heading text-3xl md:text-4xl font-bold tracking-widest text-midnight-emerald dark:text-primary mb-6 transition-colors duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0.5, 1], y: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          LUXE ESTATE
        </motion.h1>

        {/* Luxury Minimal Spinner */}
        <div className="relative w-10 h-10 mb-6">
          <motion.div
            className="w-full h-full border-2 border-border/20 border-t-champagne dark:border-t-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Minimal Progress Bar Container using your theme tokens */}
        <div className="w-48 h-[2px] bg-border/20 rounded-full mx-auto overflow-hidden relative">
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-champagne dark:bg-primary rounded-full"
            initial={{ left: "-100%", right: "100%" }}
            animate={{
              left: ["-100%", "0%", "100%"],
              right: ["100%", "0%", "-100%"],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

       
        {/* Dynamic theme text token configuration */}
        <motion.p
          className="font-body text-xs uppercase tracking-[0.2em] text-muted mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Curating Spaces
        </motion.p>
      </div>
    </div>
  );
}
