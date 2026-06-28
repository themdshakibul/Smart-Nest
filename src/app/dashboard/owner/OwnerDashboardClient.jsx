"use client";

import { motion } from "framer-motion";
import { Building2, DollarSign, CalendarCheck } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 260, damping: 22 },
  }),
};

const summaryCards = (analytics) => [
  {
    label: "Total Earnings",
    value: `$${Number(analytics.totalEarnings || 0).toLocaleString()}`,
    icon: <DollarSign className="w-5 h-5" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    label: "Total Properties",
    value: analytics.totalProperties ?? 0,
    icon: <Building2 className="w-5 h-5" />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    label: "Total Bookings",
    value: analytics.totalBookings ?? 0,
    icon: <CalendarCheck className="w-5 h-5" />,
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border/40 rounded-xl px-4 py-3 shadow-lg">
        <p className="font-body text-xs text-muted mb-1">{label}</p>
        <p className="font-heading text-sm font-bold text-primary">
          ${Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function OwnerDashboardClient({ analytics }) {
  const cards = summaryCards(analytics);
  const monthlyData = analytics.monthlyEarnings || [];

  return (
    // Tightened global vertical layout container spacing from space-y-8 to space-y-6
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Owner <span className="text-secondary">Dashboard</span>
        </h1>
        <p className="font-body text-sm text-muted-foreground mt-0.5">
          Your property performance at a glance
        </p>
      </motion.div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 grid-rows-3 xs:grid-cols-2 xs:grid-rows-none md:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className={`rounded-2xl border ${card.border} ${card.bg} p-5 lg:p-6 flex flex-col xl:flex-row xl:items-center gap-3 xl:gap-4 shadow-sm min-w-0`}
          >
            <div className={`p-3 rounded-xl bg-background/60 border ${card.border} ${card.color} w-11 h-11 flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
            <div className="min-w-0 w-full">
              <p className="font-body text-xs text-muted uppercase tracking-wider font-semibold block">
                {card.label}
              </p>
              <p className={`font-heading text-2xl lg:text-3xl font-bold mt-0.5 tracking-tight truncate ${card.color}`}>
                {card.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Monthly Earnings Chart Container */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="bg-surface rounded-3xl border border-border/40 shadow-sm p-5 sm:p-6" // Slightly reduced padding for a tighter container look
      >
        <div className="mb-4"> {/* Reduced header margin bottom to pull the chart closer */}
          <h2 className="font-heading text-xl font-bold text-foreground tracking-tight">
            Monthly <span className="text-secondary">Earnings</span>
          </h2>
          <p className="font-body text-xs text-muted mt-0.5">
            Last 12 months of confirmed booking revenue
          </p>
        </div>

        {monthlyData.length === 0 ? (
          <div className="flex items-center justify-center h-48 font-body text-sm text-muted">
            No earnings data available yet.
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={260}> {/* Adjusted height slightly to maintain professional dashboard ratios */}
              <LineChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }} // Normalized internal canvas margins
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(128,128,128,0.15)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fontFamily: "inherit", fill: "var(--color-muted, #888)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fontFamily: "inherit", fill: "var(--color-muted, #888)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#043927"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#043927", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#043927", stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </div>
  );
}