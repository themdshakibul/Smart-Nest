// src/app/unauthorized/page.jsx
"use client";

import React from 'react';
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Home, Lock } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-danger/20">
      <div className="w-full max-w-md text-center space-y-8">
        
        {/* Animated Security Icon Matrix */}
        <div className="relative flex justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 w-24 h-24 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center text-danger"
          >
            <ShieldAlert className="w-12 h-12" />
          </motion.div>
          
          {/* Decorative background pulse */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute top-0 w-24 h-24 rounded-full bg-danger/5 blur-xl"
          />
        </div>

        {/* Header Messaging */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface-container-low font-body text-xs font-semibold text-muted uppercase tracking-wider">
            <Lock className="w-3 h-3 text-danger" />
            <span>Error 403: Forbidden</span>
          </div>
          
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Access <span className="text-danger">Denied</span>
          </h1>
          
          <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Your current account credentials lack the administrative clearance matrix required to view this operational framework ledger.
          </p>
        </motion.div>

        {/* Informative Warning Callout Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="p-4 rounded-2xl border border-border/40 bg-surface text-left font-body text-xs space-y-2 text-muted"
        >
          <div className="font-semibold text-primary">Why am I seeing this?</div>
          <p className="font-light text-muted-foreground/80 leading-normal">
            This route is strictly guarded by the system security layer. If you believe this is an error, please reach out to your primary network deployment coordinator to request role elevation updates.
          </p>
        </motion.div>

        {/* Interactive Framework Recovery Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border hover:bg-surface-container-low text-primary text-sm font-body font-medium transition-all duration-200 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-body font-medium shadow-sm transition-all duration-200 active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}