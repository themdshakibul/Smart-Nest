"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

const owners = [
  {
    name: "Julien Dupont",
    specialty: "Owner of 12+ Luxury Flats in Paris",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApqTAP4AuzLooQdriTlTUvwDunYPcAm3jIS8OcHjTH9_gRRdZx6pR0oKunnTTpPadnPHvXRyG6PQCWRPYyLSnZV_r82M7ECVNsfO_rEgHib8bA2dUhUfjfiOwPGZQy_FOD1113AAuAZEGyQiEjpMBde7ntU-URDoPJhWQiYATJUNRuQjVnkCDv0ZegMR5BPMXdd6EhiUyiFesiYf-upDbZwz1kDMyr0tHnYEjar304c5xXC9y4pFexD-ciK4rAL8zzDlwR31CxJAKA",
  },
  {
    name: "Sophia Lorenzi",
    specialty: "Specialist in Tuscany Estates",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWhfaMXQbPM02S-Zs7ESY9BVx5oiQtYKKzYOGcQaWMr_lauMC0hn0NBxkL9gUxW1sUVo3dVhQRWoLFM0b6AdxA5q7OSZWHtSGZuvOK3Dt8CiBx9mYMEuFirKvtahpN2FAKQoO5rUlbkbaSGXciihZ_43Ac6Q1tv0nmSaDazu9fIIghWdqZHDIi4YxTU7au2E6e52CL35Wz1awBYTB3iEKGuarAIDIUMo-cgyHKLoDivSPDqhN6gw2ufJwrUUcyNBEwHjVMXvni6Tom",
  },
  {
    name: "Alaric Sterling",
    specialty: "Curator of NYC Modern Penthouses",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC4rE4onAH7dYr3mrCV1UeuMT5uIKZrwaPv4JCoAKs9yW9jHqSDsOjtbr-R8Lb7NQvY5T8oG7TgAiSEa2ZqFkoH5ZbpVWBn0pq48GFXVppwU52sWwokA22TNiDIEELl0Lq1tEgu5GeBblRFm-y1oKIlbBNHtbE2OpsC2PrQgKMHzDq-z7oDR_n7vJkzFx-kbUzKK66Cu-kWC_D5CMkfHPA8BRR9yS0AZlFFxQ9zazkhNd-bhB3WfPBSq-GoVOjxd59RxzWdhRQSFww",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.215, 0.61, 0.355, 1] } },
};

export default function TrustedOwners() {
  return (
    <section className="py-24 bg-[var(--surface-container-low)] dark:bg-[var(--surface-container)]/60 transition-colors duration-300 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.18em] font-semibold mb-2 text-secondary">
            Our Community
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-normal text-midnight-emerald dark:text-primary">
            Meet Our Premier Owners
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {owners.map((owner) => (
            <motion.div
              key={owner.name}
              variants={itemVariants}
              className="text-center group"
            >
              {/* Avatar ring */}
              <div className="w-32 h-32 rounded-full mx-auto mb-6 p-1 border-2 border-champagne group-hover:scale-105 transition-transform duration-300">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={owner.image}
                    alt={owner.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Name + verified badge */}
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <h3 className="font-heading text-xl font-semibold text-midnight-emerald dark:text-secondary">
                  {owner.name}
                </h3>
                <BadgeCheck
                  size={18}
                  className="text-blue-500 flex-shrink-0"
                  fill="#3b82f6"
                  strokeWidth={0}
                />
              </div>

              {/* Specialty */}
              <p className="text-sm text-muted">
                {owner.specialty}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
