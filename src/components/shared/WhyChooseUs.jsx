"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import { Shield, CreditCard, Headset, KeyRound } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-champagne" />,
      title: "Verified Listings",
      description: "Every property is physically inspected to ensure it meets our strict quality guidelines.",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-champagne" />,
      title: "Secure Payments",
      description: "Encrypted escrow services for all transactions, protecting both tenants and owners.",
    },
    {
      icon: <Headset className="w-8 h-8 text-champagne" />,
      title: "24/7 Concierge",
      description: "Personalized support for maintenance, transport, and lifestyle requests anytime.",
    },
    {
      icon: <KeyRound className="w-8 h-8 text-champagne" />,
      title: "Exclusive Access",
      description: "Get early access to off-market properties and members-only events.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18 },
    },
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  return (
    <section className="bg-[var(--surface-container-low)] dark:bg-[var(--surface-container)]/60 py-24 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Animated Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-midnight-emerald dark:text-primary mb-4 tracking-wide">
            The Gold Standard of Rentals
          </h2>
          <p className="font-body text-base md:text-lg text-muted max-w-xl mx-auto">
            We provide more than just a place to live. We provide a lifestyle managed with absolute precision and care.
          </p>
        </motion.div>

        {/* Animated Features Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUpVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="h-full" // Keeps wrapper boxes matching heights
            >
              <Card 
                shadow="sm"
                className="h-full border border-border/10 bg-card dark:bg-[var(--surface-container)] rounded-2xl p-4 transition-all duration-300 hover:shadow-md"
              >
                <div className="p-6 flex flex-col items-start gap-5 overflow-hidden">
                  {/* Icon Wrapper */}
                  <div className="p-3 bg-midnight-emerald/5 dark:bg-primary/10 rounded-xl">
                    {feature.icon}
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-midnight-emerald dark:text-secondary mb-2">
                      {feature.title}
                    </h3>
                    <p className="font-body text-sm text-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}