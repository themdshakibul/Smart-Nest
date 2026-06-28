

// "use client";

// import { updateUser } from "@/lib/actions/user";
// import { Table, Pagination } from "@heroui/react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Loader2, ShieldCheck, User, ChevronDown, Check, ShieldUserIcon } from "lucide-react";
// import Image from "next/image";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useRef, useEffect } from "react";
// import toast from "react-hot-toast";

// export default function AllUsersTableClient({ initialUsersData }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const initialUsers = initialUsersData?.data;
//   const currentPage = initialUsersData?.page || 1;
//   const totalPages = initialUsersData?.totalPage || 1;
//   const totalCount = initialUsersData?.totalData || 0;

//   const [users, setUsers] = useState(initialUsers);
//   const [processingId, setProcessingId] = useState(null);
//   const [openDropdownId, setOpenDropdownId] = useState(null);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     setUsers(initialUsers);
//   }, [initialUsers]);

//   const pages = [];
//   for (let i = 1; i <= totalPages; i++) {
//     pages.push(i);
//   }

//   const updateSearchParam = (key, value) => {
//     const params = new URLSearchParams(searchParams.toString());
//     if (value) {
//       params.set(key, value);
//     } else {
//       params.delete(key);
//     }
//     router.push(`?${params.toString()}`, { scroll: false });
//   };

//   const rolesList = [
//     {
//       value: "admin",
//       label: "Admin",
//       desc: "Full administrative dashboard control",
//       color: "text-danger",
//       bg: "bg-[#ffdad6]",
//       border: "border-danger/30",
//       dot: "bg-danger",
//       icon: <ShieldUserIcon className="w-3.5 h-3.5" />,
//     },
//     {
//       value: "owner",
//       label: "Owner",
//       desc: "Property listings management and hosting",
//       color: "text-secondary",
//       bg: "bg-secondary/10",
//       border: "border-secondary/30",
//       dot: "bg-secondary",
//       icon: <ShieldCheck className="w-3.5 h-3.5" />,
//     },
//     {
//       value: "tenant",
//       label: "Tenant",
//       desc: "Search portfolios and book structures",
//       color: "text-primary",
//       bg: "bg-primary/10",
//       border: "border-primary/20",
//       dot: "bg-primary",
//       icon: <User className="w-3.5 h-3.5" />,
//     },
//   ];

//   const getRoleConfig = (role) =>
//     rolesList.find((r) => r.value === role?.toString()?.toLowerCase()) ||
//     rolesList[2];

//   const handleRoleChange = async (userId, currentRole, newRole) => {
//     if (!newRole || currentRole === newRole) return;

//     setOpenDropdownId(null);
//     setProcessingId(userId);
//     const toastId = toast.loading("Updating role...");

//     try {
//       const data = await updateUser(userId, { role: newRole });
//       if (data?.error) throw new Error(data.error);

//       setUsers((prev) =>
//         prev.map((user) =>
//           user._id === userId ? { ...user, role: newRole } : user
//         )
//       );

//       toast.success(`Role updated to ${newRole.toUpperCase()}!`, { id: toastId });
//       router.refresh();
//     } catch (error) {
//       console.error("Role Modifier Error:", error);
//       toast.error(error.message || "Failed to update role.", { id: toastId });
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpenDropdownId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="flex flex-col gap-6">
//       <motion.div
//         initial={{ opacity: 0, y: 25 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="bg-surface rounded-3xl shadow-sm border border-border/40 overflow-hidden"
//       >
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-border/20 bg-background/70 backdrop-blur-lg flex items-center justify-between">
//           <div>
//             <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
//               User <span className="text-secondary">Registry</span>
//             </h2>
//             <p className="font-body text-xs mt-0.5 text-muted">
//               {totalCount} active profiles in registry
//             </p>
//           </div>

//           {/* Role legend */}
//           <div className="hidden sm:flex items-center gap-4">
//             {rolesList.map((r) => (
//               <div key={r.value} className="flex items-center gap-1.5">
//                 <span className={`w-2 h-2 rounded-full ${r.dot}`} />
//                 <span className="font-body text-[11px] text-muted">{r.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <Table className="w-full text-left border-collapse">
//           <Table.ScrollContainer>
//             <Table.Content aria-label="SmartNest administrative system users registry">
//               <Table.Header className="bg-surface-container-low border-b border-border/60">
//                 <Table.Column isRowHeader className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
//                   User Profile Information
//                 </Table.Column>
//                 <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
//                   Current Role Status
//                 </Table.Column>
//                 <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
//                   Registered Date
//                 </Table.Column>
//                 <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4 text-right">
//                   Modify Permissions
//                 </Table.Column>
//               </Table.Header>

//               <Table.Body>
//                 {users?.length === 0 ? (
//                   <Table.Row>
//                     <Table.Cell colSpan={4} className="text-center font-body text-muted py-14">
//                       No active user records registered in your framework catalog.
//                     </Table.Cell>
//                   </Table.Row>
//                 ) : (
//                   users?.map((user) => {
//                     const userRole = user.role?.toString()?.toLowerCase() || "tenant";
//                     const roleConfig = getRoleConfig(userRole);
//                     const isOpen = openDropdownId === user._id;

//                     return (
//                       <Table.Row
//                         key={user._id}
//                         className="border-b border-border/20 bg-surface hover:bg-card transition-colors duration-150"
//                       >
//                         {/* Profile */}
//                         <Table.Cell className="p-4">
//                           <div className="flex items-center gap-3">
//                             <div className="relative flex-shrink-0">
//                               <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border/40 relative">
//                                 <Image
//                                   src={user.image || "https://placehold.co/100x100?text=U"}
//                                   alt={user.name || "User"}
//                                   fill
//                                   sizes="40px"
//                                   className="object-cover"
//                                 />
//                               </div>
//                               <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${roleConfig.dot}`} />
//                             </div>
//                             <div>
//                               <div className="font-body text-sm font-semibold text-primary">
//                                 {user.name || "Anonymous System Profile"}
//                               </div>
//                               <div className="font-body text-xs text-muted font-light mt-0.5">
//                                 {user.email}
//                               </div>
//                             </div>
//                           </div>
//                         </Table.Cell>

//                         {/* Role badge */}
//                         <Table.Cell className="p-4">
//                           <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-body text-xs font-semibold capitalize ${roleConfig.color} ${roleConfig.bg} ${roleConfig.border}`}>
//                             {roleConfig.icon}
//                             {userRole}
//                           </div>
//                         </Table.Cell>

//                         {/* Date */}
//                         <Table.Cell className="p-4">
//                           <div className="font-body text-xs text-muted">
//                             {user.createdAt
//                               ? new Date(user.createdAt).toLocaleDateString("en-US", {
//                                   year: "numeric",
//                                   month: "short",
//                                   day: "numeric",
//                                 })
//                               : "N/A"}
//                           </div>
//                         </Table.Cell>

//                         {/* Role selector */}
//                         <Table.Cell className="p-4 text-right">
//                           <div className="flex items-center justify-end gap-2">
//                             {processingId === user._id && (
//                               <Loader2 className="w-4 h-4 animate-spin text-secondary" />
//                             )}

//                             <div className="w-48 text-left relative" ref={dropdownRef}>
//                               <button
//                                 type="button"
//                                 disabled={processingId !== null}
//                                 onClick={() => setOpenDropdownId(isOpen ? null : user._id)}
//                                 className={`w-full border rounded-xl px-3 py-2 flex items-center justify-between font-body text-xs font-semibold cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${roleConfig.color} ${roleConfig.bg} ${roleConfig.border} ${isOpen ? "ring-2 ring-secondary/60" : ""}`}
//                               >
//                                 <div className="flex items-center gap-1.5">
//                                   {roleConfig.icon}
//                                   <span>{roleConfig.label}</span>
//                                 </div>
//                                 <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
//                               </button>

//                               <AnimatePresence>
//                                 {isOpen && (
//                                   <motion.div
//                                     initial={{ opacity: 0, y: -8, scale: 0.96 }}
//                                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                                     exit={{ opacity: 0, y: -8, scale: 0.96 }}
//                                     transition={{ duration: 0.15, ease: "easeOut" }}
//                                     className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border/60 shadow-xl rounded-2xl overflow-hidden p-1.5 z-50"
//                                   >
//                                     <div className="h-0.5 rounded-full mb-1.5 mx-1 bg-champagne/60" />
//                                     {rolesList.map((role) => {
//                                       const isSelected = userRole === role.value;
//                                       return (
//                                         <button
//                                           type="button"
//                                           key={role.value}
//                                           onClick={() => handleRoleChange(user._id, userRole, role.value)}
//                                           className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 flex items-start justify-between gap-2 ${isSelected ? `${role.bg} ${role.border} border` : "hover:bg-card border border-transparent"}`}
//                                         >
//                                           <div className="flex items-start gap-2.5">
//                                             <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${role.dot}`} />
//                                             <div>
//                                               <span className={`font-body text-xs font-semibold block ${role.color}`}>
//                                                 {role.label}
//                                               </span>
//                                               <span className="font-body text-[10px] text-muted block mt-0.5 leading-relaxed">
//                                                 {role.desc}
//                                               </span>
//                                             </div>
//                                           </div>
//                                           {isSelected && (
//                                             <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${role.color}`} />
//                                           )}
//                                         </button>
//                                       );
//                                     })}
//                                   </motion.div>
//                                 )}
//                               </AnimatePresence>
//                             </div>
//                           </div>
//                         </Table.Cell>
//                       </Table.Row>
//                     );
//                   })
//                 )}
//               </Table.Body>
//             </Table.Content>
//           </Table.ScrollContainer>

//           <Table.Footer className="p-4 bg-surface-container-lowest border-t border-border/40 text-xs font-body text-muted">
//             Showing {users?.length || 0} of {totalCount} active profiles
//           </Table.Footer>
//         </Table>
//       </motion.div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center">
//           <Pagination className="flex flex-col sm:flex-row items-center gap-4 bg-card/20 p-4 rounded-xl border border-border/40">
//             <Pagination.Summary className="text-xs text-muted font-body">
//               Page {currentPage} of {totalPages}
//             </Pagination.Summary>
//             <Pagination.Content>
//               <Pagination.Item>
//                 <Pagination.Previous
//                   disabled={currentPage === 1}
//                   onClick={() => currentPage > 1 && updateSearchParam("page", currentPage - 1)}
//                   className={`flex items-center gap-1 text-sm font-body ${currentPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
//                 >
//                   <Pagination.PreviousIcon />
//                   <span>Previous</span>
//                 </Pagination.Previous>
//               </Pagination.Item>

//               {pages.map((pageNum) => (
//                 <Pagination.Item key={pageNum}>
//                   <Pagination.Link
//                     isActive={currentPage === pageNum}
//                     onClick={() => updateSearchParam("page", pageNum)}
//                     className={`cursor-pointer font-body text-sm transition-colors ${currentPage === pageNum ? "bg-secondary backdrop-blur-sm text-white" : ""}`}
//                   >
//                     {pageNum}
//                   </Pagination.Link>
//                 </Pagination.Item>
//               ))}

//               <Pagination.Item>
//                 <Pagination.Next
//                   disabled={currentPage === totalPages}
//                   onClick={() => currentPage < totalPages && updateSearchParam("page", currentPage + 1)}
//                   className={`flex items-center gap-1 text-sm font-body ${currentPage === totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
//                 >
//                   <span>Next</span>
//                   <Pagination.NextIcon />
//                 </Pagination.Next>
//               </Pagination.Item>
//             </Pagination.Content>
//           </Pagination>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { updateUser } from "@/lib/actions/user";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ShieldCheck,
  User,
  ChevronDown,
  Check,
  ShieldUserIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

// ─── Role config ────────────────────────────────────────────────────────────

const rolesList = [
  {
    value: "admin",
    label: "Admin",
    desc: "Full administrative dashboard control",
    color: "text-danger",
    bg: "bg-[#ffdad6]",
    border: "border-danger/30",
    dot: "bg-danger",
    icon: <ShieldUserIcon className="w-3.5 h-3.5" />,
  },
  {
    value: "owner",
    label: "Owner",
    desc: "Property listings management and hosting",
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/30",
    dot: "bg-secondary",
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
  },
  {
    value: "tenant",
    label: "Tenant",
    desc: "Search portfolios and book structures",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    dot: "bg-primary",
    icon: <User className="w-3.5 h-3.5" />,
  },
];

const getRoleConfig = (role) =>
  rolesList.find((r) => r.value === role?.toString()?.toLowerCase()) ||
  rolesList[2];

// ─── Portal dropdown ─────────────────────────────────────────────────────────

function RoleDropdownPortal({ anchorRect, onClose, children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !anchorRect) return null;

  // Decide whether to open upward or downward
  const spaceBelow = window.innerHeight - anchorRect.bottom;
  const dropdownHeight = 200; // approximate
  const openUpward = spaceBelow < dropdownHeight + 16;

  const style = {
    position: "fixed",
    width: "14rem", // 224px ~ w-56
    zIndex: 9999,
    left: anchorRect.right - 224, // right-align with button
    ...(openUpward
      ? { bottom: window.innerHeight - anchorRect.top + 8 }
      : { top: anchorRect.bottom + 8 }),
  };

  return createPortal(
    <>
      {/* Invisible backdrop to catch outside clicks */}
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />
      <div style={style}>{children}</div>
    </>,
    document.body
  );
}

// ─── Role selector for a single row ──────────────────────────────────────────

function RoleSelector({ user, processingId, onRoleChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const [anchorRect, setAnchorRect] = useState(null);

  const userRole = user.role?.toString()?.toLowerCase() || "tenant";
  const roleConfig = getRoleConfig(userRole);

  const openDropdown = () => {
    if (buttonRef.current) {
      setAnchorRect(buttonRef.current.getBoundingClientRect());
    }
    setIsOpen(true);
  };

  const closeDropdown = () => setIsOpen(false);

  // Keep anchorRect up-to-date on scroll/resize while open
  useEffect(() => {
    if (!isOpen) return;
    const update = () => {
      if (buttonRef.current) {
        setAnchorRect(buttonRef.current.getBoundingClientRect());
      }
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [isOpen]);

  return (
    <div className="relative w-48 text-left">
      {/* Trigger button */}
      <button
        ref={buttonRef}
        type="button"
        disabled={processingId !== null}
        onClick={isOpen ? closeDropdown : openDropdown}
        className={`w-full border rounded-xl px-3 py-2 flex items-center justify-between font-body text-xs font-semibold cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${roleConfig.color} ${roleConfig.bg} ${roleConfig.border} ${isOpen ? "ring-2 ring-secondary/60" : ""}`}
      >
        <div className="flex items-center gap-1.5">
          {roleConfig.icon}
          <span>{roleConfig.label}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Portal dropdown — escapes all overflow:hidden parents */}
      <AnimatePresence>
        {isOpen && (
          <RoleDropdownPortal anchorRect={anchorRect} onClose={closeDropdown}>
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-surface border border-border/60 shadow-xl rounded-2xl overflow-hidden p-1.5"
            >
              <div className="h-0.5 rounded-full mb-1.5 mx-1 bg-champagne/60" />
              {rolesList.map((role) => {
                const isSelected = userRole === role.value;
                return (
                  <button
                    type="button"
                    key={role.value}
                    onClick={() => {
                      closeDropdown();
                      onRoleChange(user._id, userRole, role.value);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 flex items-start justify-between gap-2 ${
                      isSelected
                        ? `${role.bg} ${role.border} border`
                        : "hover:bg-card border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${role.dot}`}
                      />
                      <div>
                        <span
                          className={`font-body text-xs font-semibold block ${role.color}`}
                        >
                          {role.label}
                        </span>
                        <span className="font-body text-[10px] text-muted block mt-0.5 leading-relaxed">
                          {role.desc}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check
                        className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${role.color}`}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </RoleDropdownPortal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AllUsersTableClient({ initialUsersData }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialUsers = initialUsersData?.data;
  const currentPage = initialUsersData?.page || 1;
  const totalPages = initialUsersData?.totalPage || 1;
  const totalCount = initialUsersData?.totalData || 0;

  const [users, setUsers] = useState(initialUsers);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  const updateSearchParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleRoleChange = useCallback(
    async (userId, currentRole, newRole) => {
      if (!newRole || currentRole === newRole) return;

      setProcessingId(userId);
      const toastId = toast.loading("Updating role...");

      try {
        const data = await updateUser(userId, { role: newRole });
        if (data?.error) throw new Error(data.error);

        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );

        toast.success(`Role updated to ${newRole.toUpperCase()}!`, {
          id: toastId,
        });
        router.refresh();
      } catch (error) {
        console.error("Role Modifier Error:", error);
        toast.error(error.message || "Failed to update role.", { id: toastId });
      } finally {
        setProcessingId(null);
      }
    },
    [router]
  );

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-surface rounded-3xl shadow-sm border border-border/40 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/20 bg-background/70 backdrop-blur-lg flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              User <span className="text-secondary">Registry</span>
            </h2>
            <p className="font-body text-xs mt-0.5 text-muted">
              {totalCount} active profiles in registry
            </p>
          </div>

          {/* Role legend */}
          <div className="hidden sm:flex items-center gap-4">
            {rolesList.map((r) => (
              <div key={r.value} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${r.dot}`} />
                <span className="font-body text-[11px] text-muted">
                  {r.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Table — plain HTML table, no HeroUI Table wrapper */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-border/60">
              <tr>
                <th className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  User Profile Information
                </th>
                <th className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  Current Role Status
                </th>
                <th className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  Registered Date
                </th>
                <th className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4 text-right">
                  Modify Permissions
                </th>
              </tr>
            </thead>

            <tbody>
              {!users?.length ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center font-body text-muted py-14"
                  >
                    No active user records registered in your framework catalog.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const userRole =
                    user.role?.toString()?.toLowerCase() || "tenant";
                  const roleConfig = getRoleConfig(userRole);

                  return (
                    <tr
                      key={user._id}
                      className="border-b border-border/20 bg-surface hover:bg-card transition-colors duration-150"
                    >
                      {/* Profile */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border/40 relative">
                              <Image
                                src={
                                  user.image ||
                                  "https://placehold.co/100x100?text=U"
                                }
                                alt={user.name || "User"}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${roleConfig.dot}`}
                            />
                          </div>
                          <div>
                            <div className="font-body text-sm font-semibold text-primary">
                              {user.name || "Anonymous System Profile"}
                            </div>
                            <div className="font-body text-xs text-muted font-light mt-0.5">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role badge */}
                      <td className="p-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-body text-xs font-semibold capitalize ${roleConfig.color} ${roleConfig.bg} ${roleConfig.border}`}
                        >
                          {roleConfig.icon}
                          {userRole}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-4">
                        <div className="font-body text-xs text-muted">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </div>
                      </td>

                      {/* Role selector */}
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {processingId === user._id && (
                            <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                          )}
                          <RoleSelector
                            user={user}
                            processingId={processingId}
                            onRoleChange={handleRoleChange}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            <tfoot>
              <tr>
                <td
                  colSpan={4}
                  className="p-4 bg-surface-container-lowest border-t border-border/40 text-xs font-body text-muted"
                >
                  Showing {users?.length || 0} of {totalCount} active profiles
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-card/20 p-4 rounded-xl border border-border/40">
            <span className="text-xs text-muted font-body">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-1">
              {/* Previous */}
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  currentPage > 1 &&
                  updateSearchParam("page", currentPage - 1)
                }
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-body transition-colors ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed text-muted"
                    : "cursor-pointer hover:bg-card text-foreground"
                }`}
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
                <span>Previous</span>
              </button>

              {/* Page numbers */}
              {pages.map((pageNum) => (
                <button
                  type="button"
                  key={pageNum}
                  onClick={() => updateSearchParam("page", pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-body transition-colors ${
                    currentPage === pageNum
                      ? "bg-secondary text-white"
                      : "hover:bg-card text-foreground cursor-pointer"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next */}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  currentPage < totalPages &&
                  updateSearchParam("page", currentPage + 1)
                }
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-body transition-colors ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed text-muted"
                    : "cursor-pointer hover:bg-card text-foreground"
                }`}
              >
                <span>Next</span>
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}