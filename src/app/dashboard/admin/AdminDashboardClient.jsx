"use client";

import { motion } from "framer-motion";
import {
  Building2,
  CalendarCheck,
  CheckCircle,
  Clock,
  DollarSign,
  UserCheck,
  UserCog,
  Users,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Animation Variants ───────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.45, ease: "easeOut" },
  },
});

// ─── Custom Tooltip ───────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border/40 rounded-xl px-4 py-3 shadow-lg space-y-1">
      <p className="font-body text-[11px] text-muted uppercase tracking-wider">
        {label}
      </p>
      {payload.map((p) => (
        <p
          key={p.dataKey}
          className="font-heading text-sm font-bold"
          style={{ color: p.color }}
        >
          {p.dataKey === "revenue"
            ? `$${Number(p.value).toLocaleString()}`
            : p.value}
          <span className="font-body text-xs font-normal text-muted ml-1">
            {p.name}
          </span>
        </p>
      ))}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, bg, border, delay }) => (
  <motion.div
    {...fadeUp(delay)}
    className={`rounded-2xl border ${border} ${bg} p-5 flex items-center gap-4 shadow-sm`}
  >
    <div
      className={`p-3 rounded-xl bg-background/60 border ${border} ${color} shrink-0`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="font-body text-[11px] text-muted uppercase tracking-wider font-semibold truncate">
        {label}
      </p>
      <p
        className={`font-heading text-2xl sm:text-3xl font-bold mt-0.5 ${color}`}
      >
        {value}
      </p>
    </div>
  </motion.div>
);

// ─── Status Pill ─────────────────────────────────────────────
const StatusPill = ({ label, count, total, color, bg, border, icon }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div
      className={`rounded-xl border ${border} ${bg} p-4 flex items-center gap-3`}
    >
      <div className={`${color} shrink-0`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-body text-xs font-semibold text-foreground">
            {label}
          </span>
          <span className={`font-heading text-sm font-bold ${color}`}>
            {count}
          </span>
        </div>
        <div className="w-full h-1.5 bg-border/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
            className={`h-full rounded-full`}
            style={{
              backgroundColor: color.includes("emerald")
                ? "#10b981"
                : color.includes("amber")
                  ? "#f59e0b"
                  : "#ef4444",
            }}
          />
        </div>
        <p className="font-body text-[10px] text-muted mt-1">
          {pct}% of all properties
        </p>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────
export default function AdminDashboardClient({ analytics }) {
  const {
    totalUsers = 0,
    totalOwners = 0,
    totalTenants = 0,
    totalProperties = 0,
    totalBookings = 0,
    totalRevenue = 0,
    pendingProperties = 0,
    approvedProperties = 0,
    rejectedProperties = 0,
    monthlyStats = [],
    propertyTypeStats = [],
  } = analytics || {};

  const statCards = [
    {
      label: "Platform Revenue",
      value: `$${Number(totalRevenue).toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Total Users",
      value: totalUsers,
      icon: <Users className="w-5 h-5" />,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Total Properties",
      value: totalProperties,
      icon: <Building2 className="w-5 h-5" />,
      color: "text-secondary",
      bg: "bg-secondary/10",
      border: "border-secondary/20",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: <CalendarCheck className="w-5 h-5" />,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8 pb-16">
      {/* ── Header ── */}
      <motion.div {...fadeUp(0)}>
        <p className="font-body text-[11px] uppercase tracking-widest text-muted font-semibold mb-1">
          Control Center
        </p>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Platform <span className="text-secondary">Overview</span>
        </h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Live snapshot of SmartNest activity across all users and properties.
        </p>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Revenue + Bookings Chart ── */}
      <motion.div
        {...fadeUp(0.3)}
        className="bg-surface rounded-3xl border border-border/40 shadow-sm p-5 sm:p-8"
      >
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground tracking-tight">
              Monthly <span className="text-secondary">Performance</span>
            </h2>
            <p className="font-body text-xs text-muted mt-0.5">
              Revenue & bookings over the last 12 months
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-body">
            <span className="flex items-center gap-1.5 text-muted">
              <span className="w-3 h-0.5 bg-[#043927] inline-block rounded-full" />{" "}
              Revenue
            </span>
            <span className="flex items-center gap-1.5 text-muted">
              <span className="w-3 h-0.5 bg-purple-500 inline-block rounded-full" />{" "}
              Bookings
            </span>
          </div>
        </div>

        {monthlyStats.length === 0 ? (
          <div className="flex items-center justify-center h-48 font-body text-sm text-muted">
            No data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={monthlyStats}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#043927" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#043927" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="bookingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(128,128,128,0.12)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 11,
                  fontFamily: "inherit",
                  fill: "var(--color-muted,#888)",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                tick={{
                  fontSize: 11,
                  fontFamily: "inherit",
                  fill: "var(--color-muted,#888)",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                }
                width={52}
              />
              <YAxis
                yAxisId="bookings"
                orientation="right"
                tick={{
                  fontSize: 11,
                  fontFamily: "inherit",
                  fill: "var(--color-muted,#888)",
                }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#043927"
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                dot={{
                  r: 3.5,
                  fill: "#043927",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{
                  r: 5.5,
                  fill: "#043927",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
              <Area
                yAxisId="bookings"
                type="monotone"
                dataKey="bookings"
                name="Bookings"
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#bookingsGrad)"
                dot={{ r: 3, fill: "#a855f7", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{
                  r: 5,
                  fill: "#a855f7",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* ── Bottom Row: User Breakdown + Property Status + Property Types ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Breakdown */}
        <motion.div
          {...fadeUp(0.4)}
          className="bg-surface rounded-3xl border border-border/40 shadow-sm p-5 sm:p-6 space-y-5"
        >
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground tracking-tight">
              User <span className="text-secondary">Breakdown</span>
            </h2>
            <p className="font-body text-xs text-muted mt-0.5">
              Registered platform members
            </p>
          </div>

          <div className="space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between py-3 border-b border-border/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-body text-sm text-foreground font-medium">
                  Total Users
                </span>
              </div>
              <span className="font-heading text-xl font-bold text-blue-600">
                {totalUsers}
              </span>
            </div>

            {/* Owners */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-secondary/10 rounded-lg border border-secondary/20">
                  <UserCog className="w-4 h-4 text-secondary" />
                </div>
                <span className="font-body text-sm text-foreground font-medium">
                  Owners
                </span>
              </div>
              <div className="text-right">
                <span className="font-heading text-xl font-bold text-secondary">
                  {totalOwners}
                </span>
                <p className="font-body text-[10px] text-muted">
                  {totalUsers > 0
                    ? Math.round((totalOwners / totalUsers) * 100)
                    : 0}
                  % of users
                </p>
              </div>
            </div>

            {/* Tenants */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-body text-sm text-foreground font-medium">
                  Tenants
                </span>
              </div>
              <div className="text-right">
                <span className="font-heading text-xl font-bold text-purple-600">
                  {totalTenants}
                </span>
                <p className="font-body text-[10px] text-muted">
                  {totalUsers > 0
                    ? Math.round((totalTenants / totalUsers) * 100)
                    : 0}
                  % of users
                </p>
              </div>
            </div>

            {/* Visual bar */}
            <div className="pt-2">
              <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                <motion.div
                  initial={{ flex: 0 }}
                  animate={{ flex: totalOwners }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="bg-secondary rounded-l-full"
                />
                <motion.div
                  initial={{ flex: 0 }}
                  animate={{ flex: totalTenants }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="bg-purple-500 rounded-r-full"
                />
              </div>
              <div className="flex justify-between font-body text-[10px] text-muted mt-1.5">
                <span>Owners</span>
                <span>Tenants</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Property Status */}
        <motion.div
          {...fadeUp(0.45)}
          className="bg-surface rounded-3xl border border-border/40 shadow-sm p-5 sm:p-6 space-y-5"
        >
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground tracking-tight">
              Property <span className="text-secondary">Status</span>
            </h2>
            <p className="font-body text-xs text-muted mt-0.5">
              Listing approval pipeline
            </p>
          </div>
          <div className="space-y-3">
            <StatusPill
              label="Approved"
              count={approvedProperties}
              total={totalProperties}
              color="text-emerald-600"
              bg="bg-emerald-500/5"
              border="border-emerald-500/20"
              icon={<CheckCircle className="w-4 h-4" />}
            />
            <StatusPill
              label="Pending Review"
              count={pendingProperties}
              total={totalProperties}
              color="text-amber-600"
              bg="bg-amber-500/5"
              border="border-amber-500/20"
              icon={<Clock className="w-4 h-4" />}
            />
            <StatusPill
              label="Rejected"
              count={rejectedProperties}
              total={totalProperties}
              color="text-red-500"
              bg="bg-red-500/5"
              border="border-red-500/20"
              icon={<XCircle className="w-4 h-4" />}
            />
          </div>
        </motion.div>

        {/* Property Types Bar Chart */}
        <motion.div
          {...fadeUp(0.5)}
          className="bg-surface rounded-3xl border border-border/40 shadow-sm p-5 sm:p-6 space-y-5"
        >
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground tracking-tight">
              Property <span className="text-secondary">Types</span>
            </h2>
            <p className="font-body text-xs text-muted mt-0.5">
              Listings by category
            </p>
          </div>

          {propertyTypeStats.length === 0 ? (
            <div className="flex items-center justify-center h-32 font-body text-sm text-muted">
              No data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={propertyTypeStats}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                barSize={12}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(128,128,128,0.1)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{
                    fontSize: 10,
                    fontFamily: "inherit",
                    fill: "var(--color-muted,#888)",
                  }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="type"
                  tick={{
                    fontSize: 11,
                    fontFamily: "inherit",
                    fill: "var(--color-muted,#888)",
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                />
                <Tooltip
                  cursor={{ fill: "rgba(128,128,128,0.06)" }}
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="bg-background border border-border/40 rounded-lg px-3 py-2 shadow-md">
                        <p className="font-body text-xs text-muted">
                          {payload[0]?.payload?.type}
                        </p>
                        <p className="font-heading text-sm font-bold text-secondary">
                          {payload[0]?.value} listings
                        </p>
                      </div>
                    ) : null
                  }
                />
                <Bar
                  dataKey="count"
                  name="Listings"
                  fill="#043927"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
    </div>
  );
}
