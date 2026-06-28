"use client";

import { updateBookingStatus } from "@/lib/actions/bookings";
import { Button, Table } from "@heroui/react";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingRequestTableClient({ initialBookings }) {
  const router = useRouter();
  const [bookings, setBookings] = useState(initialBookings);
  const [processingId, setProcessingId] = useState(null);

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-[#e6f4ea] text-[#137333] border border-[#c2e7cc]";
      case "rejected":
        return "bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf]";
      case "pending":
      default:
        return "bg-[#fef7e0] text-[#b06000] border border-[#feebc8]";
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setProcessingId(bookingId);
    const toastId = toast.loading(`Processing your response...`);

    try {
      const data = await updateBookingStatus(bookingId, newStatus);

      if (data?.error) {
        throw new Error(data.error);
      }

      setBookings((prev) =>
        prev.map((item) =>
          item._id === bookingId ? { ...item, BookingStatus: newStatus } : item,
        ),
      );

      if (newStatus === "Approved") {
        toast.success("Booking request approved successfully!", { id: toastId });
      } else {
        toast.success("Booking request has been rejected.", { id: toastId });
      }

      router.refresh();
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error(error.message || "Failed to alter transaction status.", { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-surface rounded-3xl shadow-sm border border-border/40 overflow-hidden"
    >
      <Table className="w-full text-left border-collapse">
        <Table.ScrollContainer>
          <Table.Content aria-label="Tenant property applications ledger">
            <Table.Header className="bg-surface-container-low border-b border-border/60">
              <Table.Column isRowHeader className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Property Information
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Tenant Information
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Booking Amount
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Status
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4 text-right">
                Actions
              </Table.Column>
            </Table.Header>

            <Table.Body>
              {bookings.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center font-body text-muted py-14">
                    No structural booking requests found for your catalog.
                  </Table.Cell>
                </Table.Row>
              ) : (
                bookings.map((item, index) => (
                  <Table.Row
                    key={item._id}
                    className="border-b border-border/30 hover:bg-surface-container-lowest transition-colors duration-150"
                  >
                    {/* PROPERTY DETAILS */}
                    <Table.Cell className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-md overflow-hidden bg-card flex-shrink-0 border border-border/40 relative">
                          <Image
                            src={item.image || "https://placehold.co/600x400?text=SmartNest"}
                            alt={item.title || "Property Listing"}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-body text-sm font-semibold text-primary">
                            {item.title || "Untitled Property"}
                          </div>
                          <div className="font-body text-xs text-muted font-light mt-0.5">
                            {item.location || "N/A"}
                          </div>
                        </div>
                      </div>
                    </Table.Cell>

                    {/* TENANT PROFILE */}
                    <Table.Cell className="p-4">
                      <div className="font-body text-sm font-medium text-foreground">
                        {item.tenantFullName || "Anonymous Tenant"}
                      </div>
                      <div className="font-body text-xs text-muted mt-0.5 space-y-0.5">
                        <p className="hover:text-primary transition-colors">
                          {item.tenantEmail}
                        </p>
                        <p className="text-primary/80 font-medium">
                          {item.contactNumber || "No Phone Contact"}
                        </p>
                      </div>
                    </Table.Cell>

                    {/* PRICING SPECS */}
                    <Table.Cell className="p-4">
                      <div className="font-body text-sm font-semibold text-primary">
                        ${Number(item.price || 0).toLocaleString()}
                      </div>
                      <div className="font-body text-xs text-muted font-light mt-0.5">
                        Term: {item.rentType || "Monthly"}
                      </div>
                      <div className="font-body text-xs text-secondary font-semibold mt-1">
                        Move-in: {item.moveInDate || "Immediate"}
                      </div>
                    </Table.Cell>

                    {/* STATUS CHIP */}
                    <Table.Cell className="p-4">
                      <span
                        key={item.BookingStatus}
                        initial={{ scale: 0.92, opacity: 0.6 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full tracking-wide uppercase ${getStatusStyles(
                          item.BookingStatus
                        )}`}
                      >
                        {item.BookingStatus || "Pending"}
                      </span>
                    </Table.Cell>

                    {/* INLINE ACTION DECISIONS */}
                    <Table.Cell className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* APPROVE BUTTON */}
                        <Button
                          size="sm"
                          disabled={processingId !== null}
                          onClick={() => handleStatusUpdate(item._id, "Approved")}
                          className={`font-body text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm ${
                            item.BookingStatus === "Approved"
                              ? "bg-[#e6f4ea] text-[#137333] border border-[#c2e7cc]"
                              : "bg-primary text-white hover:bg-primary/90"
                          }`}
                        >
                          {processingId === item._id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {item.BookingStatus === "Approved" ? "Approved" : "Approve"}
                          </span>
                        </Button>

                        {/* REJECT BUTTON */}
                        <Button
                          size="sm"
                          disabled={processingId !== null}
                          onClick={() => handleStatusUpdate(item._id, "Rejected")}
                          className={`font-body text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            item.BookingStatus === "Rejected"
                              ? "bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf]"
                              : "bg-transparent border border-danger text-danger hover:bg-danger/10"
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>
                            {item.BookingStatus === "Rejected" ? "Rejected" : "Reject"}
                          </span>
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>

        <Table.Footer className="p-4 bg-surface-container-lowest border-t border-border/40 text-xs font-body text-muted">
          Active Portfolio Requests: {bookings.length} reservations managed
        </Table.Footer>
      </Table>
    </motion.div>
  );
}