"use client";

import React, { useState } from 'react';
import { Table } from "@heroui/react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Receipt, ShieldAlert, CheckCircle, Clock } from "lucide-react";
import Image from "next/image";


export default function AllBookingsTableClient({ initialBookings }) {

  const [bookings] = useState(initialBookings);

  // Status Badge visual configurations mapping matrix
  const getStatusConfig = (status) => {
    const normalStatus = status ? String(status).toLowerCase() : "pending";
    switch (normalStatus) {
      case "approved":
      case "success":
        return {
          label: "Approved",
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          icon: <CheckCircle className="w-3.5 h-3.5" />
        };
      case "rejected":
      case "cancelled":
        return {
          label: "Cancelled",
          color: "text-danger",
          bg: "bg-[#ffdad6]/40 dark:bg-danger/10",
          border: "border-danger/20",
          icon: <ShieldAlert className="w-3.5 h-3.5" />
        };
      default:
        return {
          label: "Pending",
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          icon: <Clock className="w-3.5 h-3.5" />
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-surface rounded-3xl shadow-sm border border-border/40 overflow-hidden"
    >
      {/* Header — Matched Navbar light theme color palette */}
      <div className="px-6 py-5 border-b border-border/20 bg-background/70 backdrop-blur-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            All <span className="text-secondary">Bookings</span>
          </h2>
          <p className="font-body text-xs mt-0.5 text-muted-foreground/80">
            Monitoring <span className="text-secondary font-semibold">{bookings.length}</span> active operational activities
          </p>
        </div>

        {/* Status Legend indicators */}
        <div className="flex items-center gap-4 self-start sm:self-auto">
          {["Approved", "Pending", "Cancelled"].map((lbl) => {
            const config = getStatusConfig(lbl);
            return (
              <div key={lbl} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${config.color.split(' ')[0]}`} style={{ backgroundColor: 'currentColor' }} />
                <span className="font-body text-[11px] text-muted">{lbl}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Table className="w-full text-left border-collapse">
        <Table.ScrollContainer>
          <Table.Content aria-label="SmartNest administrative framework live bookings stream">
            
            {/* Table Headers */}
            <Table.Header className="bg-surface-container-low border-b border-border/60">
              <Table.Column isRowHeader className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Property Details
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Tenant Info
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Host / Owner
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Schedule & Rate
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4 text-right">
                Activity Status
              </Table.Column>
            </Table.Header>

            {/* Table Core Content Rows */}
            <Table.Body>
              {bookings.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center font-body text-muted py-14">
                    No active framework reservation items found in database registry logs.
                  </Table.Cell>
                </Table.Row>
              ) : (
                bookings.map((booking) => {
                  const statusConfig = getStatusConfig(booking.BookingStatus);
                  
                  return (
                    <Table.Row
                      key={booking._id}
                      className="border-b border-border/20 bg-surface hover:bg-card transition-colors duration-150"
                    >
                      {/* Property Metadata Column */}
                      <Table.Cell className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-border/40 relative flex-shrink-0">
                            <Image
                              src={booking.image || "https://placehold.co/150x150?text=Property"}
                              alt={booking.title || "SmartNest Estate"}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="max-w-[200px] truncate">
                            <div className="font-body text-sm font-semibold text-primary truncate">
                              {booking.title || "Untitled Property Residence"}
                            </div>
                            <div className="flex items-center gap-1 font-body text-xs text-muted mt-0.5">
                              <MapPin className="w-3 h-3 text-muted/60" />
                              <span className="truncate">{booking.location}</span>
                            </div>
                          </div>
                        </div>
                      </Table.Cell>

                      {/* Tenant Column */}
                      <Table.Cell className="p-4">
                        <div className="font-body text-sm font-semibold text-foreground">
                          {booking.tenantFullName || "Anonymous Tenant"}
                        </div>
                        <div className="font-body text-xs text-muted font-light mt-0.5">
                          {booking.tenantEmail}
                        </div>
                        {booking.contactNumber && (
                          <div className="font-body text-[11px] text-muted-foreground/70 mt-0.5">
                            {booking.contactNumber}
                          </div>
                        )}
                      </Table.Cell>

                      {/* Owner Column */}
                      <Table.Cell className="p-4">
                        <div className="font-body text-sm font-medium text-foreground">
                          {booking.ownerName || "SmartNest Host"}
                        </div>
                        <div className="font-body text-xs text-muted font-light mt-0.5">
                          {booking.ownerEmail}
                        </div>
                      </Table.Cell>

                      {/* Financial/Schedule Information Column */}
                      <Table.Cell className="p-4">
                        <div className="flex items-center gap-1 font-body text-xs font-semibold text-primary">
                          <Receipt className="w-3.5 h-3.5 text-secondary" />
                          <span>${Number(booking.price).toLocaleString()}</span>
                          <span className="text-muted font-normal text-[11px]">/{booking.rentType || "Monthly"}</span>
                        </div>
                        <div className="flex items-center gap-1 font-body text-[11px] text-muted mt-1">
                          <Calendar className="w-3 h-3 text-muted/60" />
                          <span>Move In: {booking.moveInDate ? new Date(booking.moveInDate).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          }) : "N/A"}</span>
                        </div>
                      </Table.Cell>

                      {/* Activity Status Action/Badge Column */}
                      <Table.Cell className="p-4 text-right">
                        <div className="inline-flex items-center justify-end">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-body text-xs font-semibold uppercase ${statusConfig.color} ${statusConfig.bg} ${statusConfig.border}`}>
                            {statusConfig.icon}
                            <span>{statusConfig.label}</span>
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>

        {/* Global Registry Footer metadata status marker */}
        <Table.Footer className="p-4 bg-surface-container-lowest border-t border-border/40 text-xs font-body text-muted">
          Active Framework Transactions: {bookings.length} recorded bookings listed
        </Table.Footer>
      </Table>
    </motion.div>
  );
}