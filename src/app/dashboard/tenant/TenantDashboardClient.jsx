"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck,
  DollarSign,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Image from "next/image";
import Link from "next/link";

// ─── Helpers ──────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.42, ease: "easeOut" },
  },
});

const getStatusConfig = (status) => {
  const s = status?.toLowerCase();
  if (s === "approved" || s === "success")
    return {
      label: "Approved",
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
    };
  if (s === "cancelled" || s === "rejected")
    return {
      label: "Cancelled",
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      icon: <XCircle className="w-3.5 h-3.5" />,
    };
  return {
    label: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: <Clock className="w-3.5 h-3.5" />,
  };
};

// ─── Custom Bar Tooltip ───────────────────────────────────────
const SpendingTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border/40 rounded-xl px-4 py-3 shadow-lg">
      <p className="font-body text-[11px] text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="font-heading text-sm font-bold text-secondary">
        ${Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, bg, border, sub, delay }) => (
  <motion.div
    {...fadeUp(delay)}
    className={`rounded-2xl border ${border} ${bg} p-5 flex items-center gap-4 shadow-sm`}
  >
    <div className={`p-3 rounded-xl bg-background/60 border ${border} ${color} shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="font-body text-[11px] text-muted uppercase tracking-wider font-semibold">
        {label}
      </p>
      <p className={`font-heading text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
      {sub && <p className="font-body text-[10px] text-muted mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────
export default function TenantDashboardClient({ analytics, user }) {
  const {
    totalBookings = 0,
    totalApproved = 0,
    totalPending = 0,
    totalCancelled = 0,
    totalSpent = 0,
    totalFavorites = 0,
    monthlySpending = [],
    recentBookings = [],
  } = analytics || {};

  const firstName = user?.name?.split(" ")[0] || "Tenant";

  const statCards = [
    {
      label: "Total Spent",
      value: `$${Number(totalSpent).toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      sub: "across approved bookings",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: <CalendarCheck className="w-5 h-5" />,
      color: "text-secondary",
      bg: "bg-secondary/10",
      border: "border-secondary/20",
      sub: `${totalApproved} approved`,
    },
    {
      label: "Pending",
      value: totalPending,
      icon: <Clock className="w-5 h-5" />,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      sub: "awaiting confirmation",
    },
    {
      label: "Saved Properties",
      value: totalFavorites,
      icon: <Heart className="w-5 h-5" />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      sub: "in your collection",
    },
  ];
  

  // max value for bar highlight
  const maxSpent = Math.max(...monthlySpending.map((m) => m.spent), 1);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8 pb-16">

      {/* ── Welcome Header ── */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-body text-[11px] uppercase tracking-widest text-muted font-semibold mb-1">
            My Dashboard
          </p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Welcome back,{" "}
            <span className="text-secondary">{firstName}</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Here's a summary of your rental activity.
          </p>
        </div>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 bg-[#043927] hover:bg-[#03291c] text-white font-body font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-sm shrink-0"
        >
          Browse Properties <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Main Content Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Monthly Spending Chart — 3 cols */}
        <motion.div
          {...fadeUp(0.3)}
          className="lg:col-span-3 bg-surface rounded-3xl border border-border/40 shadow-sm p-5 sm:p-7 space-y-5"
        >
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground tracking-tight">
              Monthly <span className="text-secondary">Spending</span>
            </h2>
            <p className="font-body text-xs text-muted mt-0.5">
              Your rental payments over the last 6 months
            </p>
          </div>

          {monthlySpending.every((m) => m.spent === 0) ? (
            <div className="flex flex-col items-center justify-center h-44 gap-2">
              <DollarSign className="w-8 h-8 text-muted/40" />
              <p className="font-body text-sm text-muted">No spending data yet.</p>
              <Link
                href="/properties"
                className="font-body text-xs text-secondary underline underline-offset-2"
              >
                Find your first property
              </Link>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={monthlySpending}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                barSize={32}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(128,128,128,0.1)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fontFamily: "inherit", fill: "var(--color-muted,#888)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fontFamily: "inherit", fill: "var(--color-muted,#888)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                  }
                  width={48}
                />
                <Tooltip content={<SpendingTooltip />} cursor={{ fill: "rgba(128,128,128,0.06)" }} />
                <Bar dataKey="spent" radius={[6, 6, 0, 0]}>
                  {monthlySpending.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.spent === maxSpent ? "#043927" : "#043927"}
                      fillOpacity={entry.spent === maxSpent ? 1 : 0.35}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Booking Status Breakdown — 2 cols */}
        <motion.div
          {...fadeUp(0.38)}
          className="lg:col-span-2 bg-surface rounded-3xl border border-border/40 shadow-sm p-5 sm:p-7 space-y-5"
        >
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground tracking-tight">
              Booking <span className="text-secondary">Status</span>
            </h2>
            <p className="font-body text-xs text-muted mt-0.5">
              Overview of all your bookings
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Approved",
                count: totalApproved,
                color: "text-emerald-600",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20",
                bar: "#10b981",
                icon: <CheckCircle className="w-4 h-4" />,
              },
              {
                label: "Pending",
                count: totalPending,
                color: "text-amber-600",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20",
                bar: "#f59e0b",
                icon: <Clock className="w-4 h-4" />,
              },
              {
                label: "Cancelled",
                count: totalCancelled,
                color: "text-red-500",
                bg: "bg-red-500/10",
                border: "border-red-500/20",
                bar: "#ef4444",
                icon: <XCircle className="w-4 h-4" />,
              },
            ].map((item) => {
              const pct = totalBookings > 0 ? Math.round((item.count / totalBookings) * 100) : 0;
              return (
                <div
                  key={item.label}
                  className={`rounded-xl border ${item.border} ${item.bg} p-4`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center gap-2 ${item.color}`}>
                      {item.icon}
                      <span className="font-body text-xs font-semibold text-foreground">
                        {item.label}
                      </span>
                    </div>
                    <span className={`font-heading text-lg font-bold ${item.color}`}>
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-border/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.6, duration: 0.65, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.bar }}
                    />
                  </div>
                  <p className="font-body text-[10px] text-muted mt-1.5">{pct}% of total</p>
                </div>
              );
            })}
          </div>

          {/* Total display */}
          <div className="pt-2 border-t border-border/20 flex items-center justify-between">
            <span className="font-body text-xs text-muted">Total bookings</span>
            <span className="font-heading text-xl font-bold text-foreground">{totalBookings}</span>
          </div>
        </motion.div>
      </div>

      {/* ── Recent Bookings ── */}
      <motion.div
        {...fadeUp(0.45)}
        className="bg-surface rounded-3xl border border-border/40 shadow-sm overflow-hidden"
      >
        <div className="px-5 sm:px-7 py-5 border-b border-border/20 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground tracking-tight">
              Recent <span className="text-secondary">Bookings</span>
            </h2>
            <p className="font-body text-xs text-muted mt-0.5">Your 5 most recent reservations</p>
          </div>
          <Link
            href="/dashboard/tenant/my-bookings"
            className="font-body text-xs text-secondary hover:underline underline-offset-2 flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CalendarCheck className="w-10 h-10 text-muted/30" />
            <p className="font-body text-sm text-muted">No bookings yet.</p>
            <Link
              href="/properties"
              className="font-body text-xs text-secondary underline underline-offset-2"
            >
              Browse available properties
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {recentBookings.map((booking, i) => {
              const status = getStatusConfig(booking.status);
              return (
                <motion.div
                  key={String(booking.id)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  className="flex items-center gap-4 px-5 sm:px-7 py-4 hover:bg-surface-container/40 transition-colors"
                >
                  {/* Property image */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-border/30 relative shrink-0">
                    <Image
                      src={booking.image || "https://placehold.co/48x48?text=P"}
                      alt={booking.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground truncate">
                      {booking.title}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-muted/60 shrink-0" />
                      <span className="font-body text-xs text-muted truncate">
                        {booking.location}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="font-heading text-sm font-bold text-secondary">
                      ${Number(booking.price).toLocaleString()}
                    </p>
                    <p className="font-body text-[10px] text-muted">
                      /{booking.rentType}
                    </p>
                  </div>

                  {/* Move-in date */}
                  <div className="text-right shrink-0 hidden md:block">
                    <p className="font-body text-[11px] text-muted">Move in</p>
                    <p className="font-body text-xs font-semibold text-foreground">
                      {new Date(booking.moveInDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-body text-[11px] font-semibold shrink-0 ${status.color} ${status.bg} ${status.border}`}
                  >
                    {status.icon}
                    <span className="hidden sm:inline">{status.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
