"use client";

import React, { useState } from 'react';
import { Table } from "@heroui/react";
import { motion } from "framer-motion";
import { CreditCard, Calendar, User, ArrowUpRight, DollarSign } from "lucide-react";

export default function AllTransactionsTableClient({ initialBookings }) {
  const [bookings] = useState(initialBookings);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-surface rounded-3xl shadow-sm border border-border/40 overflow-hidden"
    >
      {/* Header Layout */}
      <div className="px-6 py-5 border-b border-border/20 bg-background/70 backdrop-blur-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Financial <span className="text-secondary">Transactions</span>
          </h2>
          <p className="font-body text-xs mt-0.5 text-muted-foreground/80">
            Reviewing <span className="text-secondary font-semibold">{bookings.filter(b => b.transactionId).length}</span> processed network payments
          </p>
        </div>

        {/* Ledger Type Indicator badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/60 bg-surface-container-low font-body text-xs font-medium text-primary">
          <CreditCard className="w-3.5 h-3.5 text-secondary" />
          <span>Stripe Live Gateway Matrix</span>
        </div>
      </div>

      <Table className="w-full text-left border-collapse">
        <Table.ScrollContainer>
          <Table.Content aria-label="SmartNest administrative system transactions database registry">
            
            {/* Table Structured Columns */}
            <Table.Header className="bg-surface-container-low border-b border-border/60">
              <Table.Column isRowHeader className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Transaction ID
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Property Destination
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Tenant Actor
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Beneficiary Owner
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Execution Date
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4 text-right">
                Gross Amount
              </Table.Column>
            </Table.Header>

            {/* Core Row Maps */}
            <Table.Body>
              {bookings.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center font-body text-muted py-14">
                    No verified financial transaction logs registered in your current system.
                  </Table.Cell>
                </Table.Row>
              ) : (
                bookings.map((booking) => {
                  // Fallback string manipulation if Stripe transaction token string isn't generated yet
                  const displayTxId = booking.transactionId 
                    ? String(booking.transactionId) 
                    : `unprocessed_${booking._id.substring(0, 8)}`;

                  return (
                    <Table.Row
                      key={booking._id}
                      className="border-b border-border/20 bg-surface hover:bg-card transition-colors duration-150"
                    >
                      {/* TRANSACTION ID */}
                      <Table.Cell className="p-4 font-mono text-xs font-medium text-secondary tracking-tight">
                        <div className="flex items-center gap-1.5 selection:bg-secondary/20">
                          <span className="bg-secondary/10 px-2 py-1 rounded-md border border-secondary/20">
                            {displayTxId}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* PROPERTY NAME */}
                      <Table.Cell className="p-4">
                        <div className="font-body text-sm font-semibold text-primary max-w-[180px] truncate">
                          {booking.title || "Untitled Strategic Asset"}
                        </div>
                        <div className="font-body text-[11px] text-muted-foreground/60 mt-0.5">
                          Type: {booking.rentType || "Monthly Basis"}
                        </div>
                      </Table.Cell>

                      {/* TENANT NAME */}
                      <Table.Cell className="p-4">
                        <div className="flex items-center gap-1.5 font-body text-sm font-semibold text-foreground">
                          <span>{booking.tenantFullName || "Anonymous Client"}</span>
                        </div>
                        <div className="font-body text-xs text-muted font-light mt-0.5">
                          {booking.tenantEmail}
                        </div>
                      </Table.Cell>

                      {/* OWNER NAME */}
                      <Table.Cell className="p-4">
                        <div className="flex items-center gap-1.5 font-body text-sm font-medium text-foreground">
                          <User className="w-3 h-3 text-muted/50" />
                          <span>{booking.ownerName || "Platform Host"}</span>
                        </div>
                        <div className="font-body text-xs text-muted font-light mt-0.5">
                          {booking.ownerEmail}
                        </div>
                      </Table.Cell>

                      {/* TRANSACTION DATE */}
                      <Table.Cell className="p-4">
                        <div className="flex items-center gap-1.5 font-body text-xs text-muted">
                          <Calendar className="w-3.5 h-3.5 text-muted/60" />
                          <span>
                            {booking.moveInDate ? new Date(booking.moveInDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : "N/A"}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* TRANSACTION AMOUNT */}
                      <Table.Cell className="p-4 text-right">
                        <div className="inline-flex items-center justify-end gap-0.5">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-body text-xs font-bold">
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-90" />
                            <span>${Number(booking.price || 0).toLocaleString()}</span>
                            <span className="text-[10px] font-normal opacity-70">USD</span>
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
          Active Framework Records: {bookings.length} operational rows rendered
        </Table.Footer>
      </Table>
    </motion.div>
  );
}