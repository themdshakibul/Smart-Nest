"use client";

import Image from "next/image";
import { Table } from "@heroui/react";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";


export default function MyBookingsClient({ bookings }) {
  

  const getBookingStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "confirmed":
        return "bg-[#e6f4ea] text-[#137333] border border-[#c2e7cc]";
      case "rejected":
      case "cancelled":
        return "bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf]";
      case "pending":
      default:
        return "bg-[#fef7e0] text-[#b06000] border border-[#feebc8]";
    }
  };

  // Payment status styles aligned with your theme variables
  const getPaymentStatusStyles = (status) => {
    if (status === "Paid") {
      return "bg-[#e6f4ea] text-[#137333] border border-[#c2e7cc]";
    }
    return "bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf]";
  };

  // Stagger configurations for parent tracking container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  // Individual child tracking elements (header element, table frame)
  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 260, damping: 25 } 
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 py-8 space-y-6"
    >
      {/* Animated Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="font-heading text-3xl font-bold text-primary">
          My Bookings
        </h1>
        <p className="font-body text-sm text-muted mt-1">
          Manage your property reservations, tracking details and payment states.
        </p>
      </motion.div>

      {/* Animated Table Container Wrap */}
      <motion.div 
        variants={itemVariants}
        className="bg-surface rounded-3xl shadow-sm border border-border/40 overflow-hidden"
      >
        <Table className="w-full text-left border-collapse">
          <Table.ScrollContainer>
            <Table.Content aria-label="Tenant bookings management table">
              {/* Header */}
              <Table.Header className="bg-surface-container-low border-b border-border/60">
                <Table.Column isRowHeader className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  Property Name
                </Table.Column>
                <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  Booking Date / Info
                </Table.Column>
                <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  Amount Paid
                </Table.Column>
                <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  Booking Status
                </Table.Column>
                <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  Payment Status
                </Table.Column>
              </Table.Header>

              {/* Body */}
              <Table.Body>
                {!bookings || bookings.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center font-body text-muted py-12">
                      No bookings found. You haven't placed any rental bookings yet.
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  bookings.map((item) => (
                    <Table.Row
                      key={item._id}
                      className="border-b border-border/30 hover:bg-surface-container-lowest transition-colors duration-150"
                    >
                      {/* Property */}
                      <Table.Cell className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 md:w-20 md:h-14 rounded-md overflow-hidden bg-card flex-shrink-0 border border-border/40 relative">
                            <Image
                              src={item.image || "https://placehold.co/600x400?text=SmartNest"}
                              alt={item.title || "Property"}
                              fill
                              sizes="(max-width: 768px) 56px, 80px"
                              className="object-cover"
                            />
                          </div>

                          <div>
                            <div className="font-body text-sm font-semibold text-primary">
                              {item.title || "Untitled Property"}
                            </div>
                            <div className="font-body text-xs text-muted font-light mt-0.5">
                              {item.location || "Location N/A"}
                            </div>
                          </div>
                        </div>
                      </Table.Cell>

                      {/* Booking Date */}
                      <Table.Cell className="p-4">
                        <div className="flex items-center gap-2 font-body text-sm text-foreground">
                          <Calendar className="text-secondary" size={14} />
                          <span>{item.moveInDate || "N/A"}</span>
                        </div>
                        <div className="font-body text-xs text-muted mt-0.5 ml-5">
                          {item.rentType || "Monthly"} Base
                        </div>
                      </Table.Cell>

                      {/* Amount Paid */}
                      <Table.Cell className="p-4">
                        <div className="font-body text-sm font-semibold text-primary">
                          ${Number(item.price || 0).toLocaleString()}
                        </div>
                        <div className="font-body text-xs text-muted font-light">
                          Verified Total
                        </div>
                      </Table.Cell>

                      {/* Booking Status */}
                      <Table.Cell className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full tracking-wide uppercase ${getBookingStatusStyles(
                            item.BookingStatus
                          )}`}
                        >
                          {item.BookingStatus || "Pending"}
                        </span>
                      </Table.Cell>

                      {/* Payment Status */}
                      <Table.Cell className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full tracking-wide uppercase ${getPaymentStatusStyles(
                            item.sessionId ? "Paid" : "Unpaid"
                          )}`}
                        >
                          {item.sessionId ? "Paid" : "Unpaid"}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </motion.div>
    </motion.div>
  );
}