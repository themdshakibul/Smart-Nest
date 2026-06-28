// // "use client";

// // import React, { useState } from "react";
// // import {
// //   Briefcase,
// //   ChartLineArrowUp,
// //   CirclePlus,
// //   Envelope,
// //   Heart,
// //   House,
// //   LayoutSideContentLeft,
// //   Person,
// //   PersonFill,
// //   SquareChartColumn,
// //   XmarkShape,
// // } from "@gravity-ui/icons";
// // import { Button, Drawer, DrawerContent, DrawerBody } from "@heroui/react";
// // import Link from "next/link";

// // export function DashboardSidebar({ user }) {
// //   const [isOpen, setIsOpen] = useState(false);

// //   const dashboardItems = {
// //     tenant: [
// //       { icon: House, href: "/dashboard/tenant", label: "Overview" },
// //       { icon: Briefcase, href: "/dashboard/tenant/my-bookings", label: "My Bookings" },
// //       { icon: Heart, href: "/dashboard/tenant/favorites", label: "Favorites" },
// //       { icon: Person, href: "/dashboard/tenant/profile", label: "Profile" },
// //     ],
// //     owner: [
// //       { icon: ChartLineArrowUp, href: "/dashboard/owner", label: "Overview" },
// //       { icon: CirclePlus, href: "/dashboard/owner/add-property", label: "Add Property" },
// //       { icon: Briefcase, href: "/dashboard/owner/my-properties", label: "My Properties" },
// //       { icon: Envelope, href: "/dashboard/owner/booking-requests", label: "Booking Requests" },
// //       { icon: Person, href: "/dashboard/owner/profile", label: "Profile" },
// //     ],
// //     admin: [
// //       { icon: PersonFill, href: "/dashboard/admin/all-users", label: "All Users" },
// //       { icon: Briefcase, href: "/dashboard/admin/all-properties", label: "All Properties" },
// //       { icon: Envelope, href: "/dashboard/admin/all-bookings", label: "All Bookings" },
// //       { icon: SquareChartColumn, href: "/dashboard/admin/transactions", label: "Transactions" },
// //     ],
// //   };

// //   const navItems = dashboardItems[user?.role] || [];

// //   // Core navigation renderer shared between Mobile Drawer and Desktop Sidebar
// //   const renderNavContent = () => (
// //     <nav className="flex flex-col gap-1.5 mt-6 font-body w-full">
// //       {navItems.map((item) => (
// //         <Link
// //           key={item.label}
// //           onClick={() => setIsOpen(false)} // Closes mobile drawer automatically on selection
// //           className="group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-muted border-l-2 border-transparent transition-all duration-200 hover:text-foreground hover:bg-card hover:border-secondary active:scale-[0.98]"
// //           href={item.href}
// //         >
// //           <item.icon className="w-5 h-5 text-muted group-hover:text-secondary transition-colors duration-200 shrink-0" />
// //           <span className="truncate">{item.label}</span>
// //         </Link>
// //       ))}
// //     </nav>
// //   );

// //   return (
// //     <>
// //       {/* DESKTOP SIDEBAR: Visible only on md screens and up */}
// //       <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border/20 bg-surface/50 backdrop-blur-md p-5 min-h-[calc(100vh-4rem)] sticky top-16 font-body">
// //         <Link href="/" className="px-2 mb-4 block">
// //           <div className="flex items-center gap-3">
// //             <p className="font-heading font-bold text-2xl tracking-tight text-foreground">
// //               Smart<span className="text-secondary">Nest</span>
// //             </p>
// //           </div>
// //         </Link>
// //         <div className="px-2 py-0.5">
// //           <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
// //             {user?.role || "Workspace"} Management
// //           </p>
// //         </div>
// //         {renderNavContent()}
// //       </aside>

// //       {/* MOBILE NAVIGATION HEADER: Visible on small viewports, stacks above main content */}
// //       <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/10 bg-background/80 backdrop-blur-md sticky top-0 z-30 w-full font-body">
// //         <div className="flex items-center justify-between w-full">

// //           {/* Menu Trigger Button */}
// //           <Button
// //             onPress={() => setIsOpen(true)}
// //             className="min-w-0 p-2.5 h-10 w-10 bg-card border border-border/20 text-foreground hover:bg-surface-container rounded-xl transition-all active:scale-95"
// //             aria-label="Open Menu"
// //           >
// //             <LayoutSideContentLeft className="w-5 h-5 shrink-0" />
// //           </Button>

// //           {/* Mobile App Branding */}
// //           <p className="font-heading font-bold text-lg tracking-tight text-foreground">
// //             Smart<span className="text-secondary">Nest</span>
// //           </p>

// //           {/* Dummy element to preserve centered/justified layout symmetry */}
// //           <div className="w-10 h-10" />
// //         </div>
// //       </div>

// //       {/* HeroUI Drawer Element */}
// //       <Drawer
// //         isOpen={isOpen}
// //         onOpenChange={setIsOpen}
// //         placement="left"
// //         size="xs"
// //         classNames={{
// //           base: "bg-surface max-w-[280px] h-full rounded-r-2xl border-r border-border/20 shadow-xl",
// //           backdrop: "bg-black/40 backdrop-blur-sm",
// //         }}
// //       >
// //         <DrawerContent>
// //           {() => (
// //             <DrawerBody className="p-0 flex flex-col h-full">
// //               {/* Drawer Header */}
// //               <div className="flex items-center justify-between border-b border-border/10 px-5 py-4 shrink-0">
// //                 <div className="flex flex-col">
// //                   <p className="font-heading font-bold text-xl tracking-tight text-foreground">
// //                     Smart<span className="text-secondary">Nest</span>
// //                   </p>
// //                   <p className="text-[10px] text-muted uppercase tracking-widest font-bold mt-0.5">
// //                     {user?.role || "Tenant"} Navigation
// //                   </p>
// //                 </div>
// //                 <button
// //                   onClick={() => setIsOpen(false)}
// //                   className="text-muted p-2 hover:bg-card hover:text-foreground rounded-xl transition-all active:scale-90"
// //                   aria-label="Close Sidebar"
// //                 >
// //                   <XmarkShape className="w-4 h-4" />
// //                 </button>
// //               </div>

// //               {/* Drawer Navigation Links */}
// //               <div className="flex-1 overflow-y-auto px-4 py-2">
// //                 {renderNavContent()}
// //               </div>
// //             </DrawerBody>
// //           )}
// //         </DrawerContent>
// //       </Drawer>
// //     </>
// //   );
// // }

// "use client";

// "use client";

// import {
//   Briefcase,
//   ChartLineArrowUp,
//   CirclePlus,
//   Envelope,
//   Heart,
//   House,
//   LayoutSideContentLeft,
//   Person,
//   PersonFill,
//   SquareChartColumn,
//   XmarkShape,
// } from "@gravity-ui/icons";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useEffect, useState } from "react";

// export function DashboardSidebar({ user }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname();

//   // Lock body scroll when drawer is open
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isOpen]);

//   const dashboardItems = {
//     tenant: [
//       { icon: House, href: "/dashboard/tenant", label: "Overview" },
//       {
//         icon: Briefcase,
//         href: "/dashboard/tenant/my-bookings",
//         label: "My Bookings",
//       },
//       { icon: Heart, href: "/dashboard/tenant/favorites", label: "Favorites" },
//       { icon: Person, href: "/dashboard/tenant/profile", label: "Profile" },
//     ],
//     owner: [
//       { icon: ChartLineArrowUp, href: "/dashboard/owner", label: "Overview" },
//       {
//         icon: CirclePlus,
//         href: "/dashboard/owner/add-property",
//         label: "Add Property",
//       },
//       {
//         icon: Briefcase,
//         href: "/dashboard/owner/my-properties",
//         label: "My Properties",
//       },
//       {
//         icon: Envelope,
//         href: "/dashboard/owner/booking-requests",
//         label: "Booking Requests",
//       },
//       { icon: Person, href: "/dashboard/owner/profile", label: "Profile" },
//     ],
//     admin: [
//       { icon: House, href: "/dashboard/admin", label: "Overview" },
//       {
//         icon: PersonFill,
//         href: "/dashboard/admin/all-users",
//         label: "All Users",
//       },
//       {
//         icon: Briefcase,
//         href: "/dashboard/admin/all-properties",
//         label: "All Properties",
//       },
//       {
//         icon: Envelope,
//         href: "/dashboard/admin/all-bookings",
//         label: "All Bookings",
//       },
//       {
//         icon: SquareChartColumn,
//         href: "/dashboard/admin/transactions",
//         label: "Transactions",
//       },
//       { icon: Person, href: "/dashboard/admin/profile", label: "Profile" },
//     ],
//   };

//   const navItems = dashboardItems[user?.role] || [];

//   return (
//     <>
//       {/* ── DESKTOP SIDEBAR ── */}
//       <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border/20 bg-surface/50 backdrop-blur-md p-5 min-h-[calc(100vh-4rem)] sticky top-16 font-body">
//         <Link href="/" className="px-2 mb-4 block">
//           <p className="font-heading font-bold text-2xl tracking-tight text-foreground">
//             Smart<span className="text-secondary">Nest</span>
//           </p>
//         </Link>
//         <div className="px-2 py-0.5 mb-2">
//           <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
//             {user?.role || "Workspace"} Management
//           </p>
//         </div>
//         <nav className="flex flex-col gap-1.5 font-body w-full">
//           {navItems.map((item) => {
//             const isActive = pathname === item.href;
//             return (
//               <Link
//                 key={item.label}
//                 href={item.href}
//                 className={[
//                   "group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium",
//                   "border-l-2 transition-all duration-200 active:scale-[0.98]",
//                   isActive
//                     ? "bg-card border-secondary text-foreground"
//                     : "border-transparent text-muted hover:text-foreground hover:bg-card hover:border-secondary",
//                 ].join(" ")}
//               >
//                 <item.icon
//                   className={[
//                     "w-5 h-5 shrink-0 transition-colors duration-200",
//                     isActive
//                       ? "text-secondary"
//                       : "text-muted group-hover:text-secondary",
//                   ].join(" ")}
//                 />
//                 <span className="truncate">{item.label}</span>
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>

//       {/* ── MOBILE TOP BAR ── */}
//       <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/10 bg-background/80 backdrop-blur-md sticky top-0 z-30 w-full font-body">
//         <button
//           onClick={() => setIsOpen(true)}
//           className="flex items-center justify-center p-2.5 h-10 w-10 bg-card border border-border/20 text-foreground hover:bg-surface-container rounded-xl transition-all active:scale-95"
//           aria-label="Open Menu"
//         >
//           <LayoutSideContentLeft className="w-5 h-5 shrink-0" />
//         </button>
//         <Link href="/">
//           <p className="font-heading font-bold text-lg tracking-tight text-foreground">
//             Smart<span className="text-secondary">Nest</span>
//           </p>
//         </Link>

//         <div className="w-10 h-10" aria-hidden="true" />
//       </div>

//       {/* ── CUSTOM MOBILE DRAWER ── */}

//       {/* Backdrop */}
//       <div
//         onClick={() => setIsOpen(false)}
//         aria-hidden="true"
//         className={[
//           "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
//           isOpen
//             ? "opacity-100 pointer-events-auto"
//             : "opacity-0 pointer-events-none",
//         ].join(" ")}
//       />

//       {/* Panel — solid bg, never transparent */}
//       <div
//         role="dialog"
//         aria-modal="true"
//         aria-label="Navigation menu"
//         style={{ backgroundColor: "#1a1a2e" }}
//         className={[
//           "fixed top-0 left-0 z-50 h-full w-[280px]",
//           "flex flex-col",
//           "shadow-2xl rounded-r-2xl",
//           "transition-transform duration-300 ease-in-out md:hidden",
//           isOpen ? "translate-x-0" : "-translate-x-full",
//         ].join(" ")}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 shrink-0">
//           <div>
//             <p className="font-heading font-bold text-xl tracking-tight text-white">
//               Smart<span className="text-secondary">Nest</span>
//             </p>
//             <p className="text-[10px] uppercase tracking-widest font-bold mt-0.5 text-white/50">
//               {user?.role || "Tenant"} Navigation
//             </p>
//           </div>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="p-2 rounded-xl transition-all active:scale-90 text-white/50 hover:text-white hover:bg-white/10"
//             aria-label="Close menu"
//           >
//             <XmarkShape className="w-4 h-4" />
//           </button>
//         </div>

//         {/* Links */}
//         <div className="flex-1 overflow-y-auto px-4 py-2">
//           <nav className="flex flex-col gap-1 mt-4 w-full">
//             {navItems.map((item) => {
//               const isActive = pathname === item.href;
//               return (
//                 <Link
//                   key={item.label}
//                   href={item.href}
//                   onClick={() => setIsOpen(false)}
//                   className={[
//                     "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium",
//                     "border-l-2 transition-all duration-150 active:scale-[0.98]",
//                     isActive
//                       ? "border-secondary bg-white/10 text-white"
//                       : "border-transparent text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30",
//                   ].join(" ")}
//                 >
//                   <item.icon className="w-5 h-5 shrink-0" />
//                   <span className="truncate">{item.label}</span>
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>
//       </div>
//     </>
//   );
// }


"use client";

import {
  Briefcase,
  ChartLineArrowUp,
  CirclePlus,
  Envelope,
  Heart,
  House,
  LayoutSideContentLeft,
  Person,
  PersonFill,
  SquareChartColumn,
  XmarkShape,
  ArrowLeft,
} from "@gravity-ui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function DashboardSidebar({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const dashboardItems = {
    tenant: [
      { icon: House, href: "/dashboard/tenant", label: "Overview" },
      {
        icon: Briefcase,
        href: "/dashboard/tenant/my-bookings",
        label: "My Bookings",
      },
      { icon: Heart, href: "/dashboard/tenant/favorites", label: "Favorites" },
      { icon: Person, href: "/dashboard/tenant/profile", label: "Profile" },
    ],
    owner: [
      { icon: ChartLineArrowUp, href: "/dashboard/owner", label: "Overview" },
      {
        icon: CirclePlus,
        href: "/dashboard/owner/add-property",
        label: "Add Property",
      },
      {
        icon: Briefcase,
        href: "/dashboard/owner/my-properties",
        label: "My Properties",
      },
      {
        icon: Envelope,
        href: "/dashboard/owner/booking-requests",
        label: "Booking Requests",
      },
      { icon: Person, href: "/dashboard/owner/profile", label: "Profile" },
    ],
    admin: [
      { icon: House, href: "/dashboard/admin", label: "Overview" },
      {
        icon: PersonFill,
        href: "/dashboard/admin/all-users",
        label: "All Users",
      },
      {
        icon: Briefcase,
        href: "/dashboard/admin/all-properties",
        label: "All Properties",
      },
      {
        icon: Envelope,
        href: "/dashboard/admin/all-bookings",
        label: "All Bookings",
      },
      {
        icon: SquareChartColumn,
        href: "/dashboard/admin/transactions",
        label: "Transactions",
      },
      { icon: Person, href: "/dashboard/admin/profile", label: "Profile" },
    ],
  };

  const navItems = dashboardItems[user?.role] || [];

  // Shared "Back to Home" button — used in both sidebar and drawer
  const GoHomeLink = ({ onClick }) => (
    <Link
      href="/"
      onClick={onClick}
      className="group flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted border border-border/20 bg-card/50 hover:bg-card hover:text-foreground hover:border-secondary/40 transition-all duration-200 active:scale-[0.98]"
    >
      <ArrowLeft className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
      <span>Back to Home</span>
    </Link>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border/20 bg-surface/50 backdrop-blur-md p-5 min-h-[calc(100vh-4rem)] sticky top-16 font-body">
        {/* Brand */}
        <Link href="/" className="px-2 mb-4 block">
          <p className="font-heading font-bold text-2xl tracking-tight text-foreground">
            Smart<span className="text-secondary">Nest</span>
          </p>
        </Link>

        {/* Workspace label */}
        <div className="px-2 py-0.5 mb-2">
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
            {user?.role || "Workspace"} Management
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1.5 font-body w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  "group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium",
                  "border-l-2 transition-all duration-200 active:scale-[0.98]",
                  isActive
                    ? "bg-card border-secondary text-foreground"
                    : "border-transparent text-muted hover:text-foreground hover:bg-card hover:border-secondary",
                ].join(" ")}
              >
                <item.icon
                  className={[
                    "w-5 h-5 shrink-0 transition-colors duration-200",
                    isActive
                      ? "text-secondary"
                      : "text-muted group-hover:text-secondary",
                  ].join(" ")}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Back to Home — pinned at the bottom of the sidebar ── */}
        <div className="mt-auto pt-4 border-t border-border/10">
          <GoHomeLink />
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/10 bg-background/80 backdrop-blur-md sticky top-0 z-30 w-full font-body">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center p-2.5 h-10 w-10 bg-card border border-border/20 text-foreground hover:bg-surface-container rounded-xl transition-all active:scale-95"
          aria-label="Open Menu"
        >
          <LayoutSideContentLeft className="w-5 h-5 shrink-0" />
        </button>

        <Link href="/">
          <p className="font-heading font-bold text-lg tracking-tight text-foreground">
            Smart<span className="text-secondary">Nest</span>
          </p>
        </Link>

        {/* Back to Home — visible shortcut on mobile top bar */}
        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 h-10 px-3 bg-card border border-border/20 text-muted hover:text-foreground rounded-xl transition-all active:scale-95 text-xs font-medium"
          aria-label="Go to Home"
        >
          <House className="w-4 h-4 shrink-0" />
          <span className="hidden xs:inline">Home</span>
        </Link>
      </div>

      {/* ── CUSTOM MOBILE DRAWER ── */}

      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={[
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{ backgroundColor: "#1a1a2e" }}
        className={[
          "fixed top-0 left-0 z-50 h-full w-[280px]",
          "flex flex-col",
          "shadow-2xl rounded-r-2xl",
          "transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 shrink-0">
          <div>
            <p className="font-heading font-bold text-xl tracking-tight text-white">
              Smart<span className="text-secondary">Nest</span>
            </p>
            <p className="text-[10px] uppercase tracking-widest font-bold mt-0.5 text-white/50">
              {user?.role || "Tenant"} Navigation
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl transition-all active:scale-90 text-white/50 hover:text-white hover:bg-white/10"
            aria-label="Close menu"
          >
            <XmarkShape className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <nav className="flex flex-col gap-1 mt-4 w-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={[
                    "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium",
                    "border-l-2 transition-all duration-150 active:scale-[0.98]",
                    isActive
                      ? "border-secondary bg-white/10 text-white"
                      : "border-transparent text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30",
                  ].join(" ")}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── Back to Home — pinned at the bottom of the drawer ── */}
        <div className="px-4 py-4 border-t border-white/10 shrink-0">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="group flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white/50 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200 active:scale-[0.98] w-full"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </>
  );
}
