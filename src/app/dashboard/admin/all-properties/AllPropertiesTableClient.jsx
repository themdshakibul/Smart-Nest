"use client";

import { deleteProperty, updateProperty } from "@/lib/actions/properties";
import { rejectionReason } from "@/lib/actions/rejections";

import { TrashBin } from "@gravity-ui/icons";
import {
  Button,
  Input,
  Label,
  Modal,
  Pagination,
  Surface,
  Table,
  TextField,
} from "@heroui/react";
import { Check, Loader2, PenIcon, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PROPERTY_TYPES = ["Apartment", "Villa", "Penthouse", "Mansion"];
const RENT_TYPES = ["Monthly", "Weekly", "Daily"];

export default function AllPropertiesTableClient({ initialProperties }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const allProperties = initialProperties?.data;
  const currentPage = initialProperties?.page || 1;
  const totalPages = initialProperties?.totalPage || 1;
  const totalCount = initialProperties?.totalData || 0;

  const [properties, setProperties] = useState(allProperties);

  useEffect(() => {
    setProperties(allProperties);
  }, [allProperties]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    propertyType: "Apartment",
    rentType: "Monthly",
    rentPrice: "",
    bedrooms: "",
    bathrooms: "",
  });

  const sanitizeValue = (val, fallback) => {
    if (!val || typeof val !== "string" || val.includes("react-aria")) {
      return fallback;
    }
    return val;
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const updateSearchParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleApprove = async (propertyId) => {
    const toastId = toast.loading("Approving listing...");
    try {
      const result = await updateProperty(propertyId, {
        status: "approved",
        rejectionFeedback: null,
      });

      if (result && result.matchedCount > 0) {
        setProperties((prev) =>
          prev.map((item) =>
            item._id === propertyId
              ? { ...item, status: "approved", rejectionFeedback: null }
              : item,
          ),
        );
        toast.success("Listing verified and published!", { id: toastId });
        router.refresh();
      } else {
        throw new Error("Update rejected by driver layer.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve property status.", { id: toastId });
    }
  };

  const handleRejectClick = (property) => {
    setSelectedProperty(property);
    setRejectionFeedback(property.rejectionFeedback || "");
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionFeedback.trim()) {
      toast.error("Please supply explicit feedback comments for the owner.");
      return;
    }

    setActionLoading(true);
    const toastId = toast.loading("Recording restriction parameters...");

    try {
      // 1. Submit the detailed audit log parameters to your Express endpoint cluster
      await rejectionReason({
        propertyId: selectedProperty._id,
        propertyTitle: selectedProperty.title,
        ownerEmail: selectedProperty.userEmail,
        reason: rejectionFeedback.trim(),
      });

      // 2. Adjust the main tracking state values on the actual property node
      const result = await updateProperty(selectedProperty._id, {
        status: "rejected",
        rejectionFeedback: rejectionFeedback.trim(),
      });

      if (result && result.matchedCount > 0) {
        setProperties((prev) =>
          prev.map((item) =>
            item._id === selectedProperty._id
              ? {
                  ...item,
                  status: "rejected",
                  rejectionFeedback: rejectionFeedback.trim(),
                }
              : item,
          ),
        );
        toast.success("Property submission rejected.", { id: toastId });
        setIsRejectModalOpen(false);
        router.refresh();
      } else {
        throw new Error("State sync anomaly occurred.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply restriction states.", { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (property) => {
    setSelectedProperty(property);
    setFormData({
      title: property.title || "",
      location: property.location || "",
      propertyType: sanitizeValue(property.propertyType, "Apartment"),
      rentType: sanitizeValue(property.rentType, "Monthly"),
      bedrooms: property.bedrooms?.toString() || "0",
      bathrooms: property.bathrooms?.toString() || "0",
      rentPrice: property.rentPrice?.toString() || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const toastId = toast.loading("Saving changes...");

    const updatedPayload = {
      title: formData.title.trim(),
      location: formData.location.trim(),
      propertyType: formData.propertyType,
      rentType: formData.rentType,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      rentPrice: Number(formData.rentPrice) || 0,
    };

    try {
      const result = await updateProperty(selectedProperty._id, updatedPayload);
      console.log(result);

      if (result && result.matchedCount > 0) {
        setProperties((prev) =>
          prev.map((item) =>
            item._id === selectedProperty._id
              ? { ...item, ...updatedPayload }
              : item,
          ),
        );
        toast.success("Listing modified successfully!", { id: toastId });
        setIsEditModalOpen(false);
        router.refresh();
      } else {
        throw new Error("No updates adjusted.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save adjustments.", { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (propertyId, propertyTitle) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-surface shadow-lg rounded-xl pointer-events-auto flex flex-col p-4 border border-border/60`}
        >
          <div className="flex-1">
            <p className="font-body text-sm font-semibold text-primary">
              Evict Database Record?
            </p>
            <p className="font-body text-xs text-muted mt-1">
              Are you sure you want to completely erase{" "}
              <span className="font-semibold text-foreground">
                "{propertyTitle}"
              </span>
              ? This entry clears completely.
            </p>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 font-body text-xs font-medium text-muted hover:bg-surface-container-high rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await executeDelete(propertyId, propertyTitle);
              }}
              className="px-3 py-1.5 font-body text-xs font-medium bg-danger text-white rounded-md hover:bg-danger/90 transition-colors cursor-pointer"
            >
              Confirm Wipe
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  const executeDelete = async (propertyId, propertyTitle) => {
    const toastId = toast.loading("Removing collection nodes...");
    try {
      const response = await deleteProperty(propertyId);
      if (!response || response.deletedCount !== 1)
        throw new Error("Deletion rejected.");

      setProperties((prev) => prev.filter((item) => item._id !== propertyId));
      toast.success(`${propertyTitle} wiped from cluster successfully!`, {
        id: toastId,
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to remove entry asset.`, { id: toastId });
    }
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-100/80 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50";
      case "rejected":
        return "bg-rose-100/80 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50";
      case "pending":
      default:
        return "bg-amber-100/80 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface rounded-3xl shadow-sm border border-border/40 overflow-hidden">
        <Table className="w-full text-left border-collapse">
          <Table.ScrollContainer>
            <Table.Content aria-label="System properties control panel table">
              <Table.Header className="bg-surface-container-low border-b border-border/60">
                <Table.Column
                  isRowHeader
                  className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4"
                >
                  Property
                </Table.Column>
                <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  Owner Identity
                </Table.Column>
                <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  Type & Specs
                </Table.Column>
                <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  Rent Vector
                </Table.Column>
                <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                  Status & Flags
                </Table.Column>
                <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4 text-right">
                  Moderation Actions
                </Table.Column>
              </Table.Header>

              <Table.Body
                items={properties}
                emptyContent="No active property nodes in database."
              >
                {(item) => (
                  <Table.Row
                    key={item._id}
                    className="border-b border-border/30 hover:bg-surface-container-lowest transition-colors duration-150"
                  >
                    <Table.Cell className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-md overflow-hidden bg-card flex-shrink-0 border border-border/40 relative">
                          <Image
                            src={
                              item.images?.[0] ||
                              "https://placehold.co/600x400?text=Property"
                            }
                            alt={item.title || "Property Asset"}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-body text-sm font-semibold text-primary">
                            {item.title || "Untitled Masterpiece"}
                          </div>
                          <div className="font-body text-xs text-muted font-light mt-0.5">
                            {item.location || "No Location Specified"}
                          </div>
                        </div>
                      </div>
                    </Table.Cell>

                    <Table.Cell className="p-4 font-body text-xs text-muted">
                      <div className="font-medium text-foreground">
                        {item.userName || "Unknown Owner"}
                      </div>
                      <div className="text-muted/80 mt-0.5">
                        {item.userEmail || "N/A"}
                      </div>
                    </Table.Cell>

                    <Table.Cell className="p-4">
                      <div className="font-body text-sm font-medium text-foreground">
                        {sanitizeValue(item.propertyType, "Apartment")}
                      </div>
                      <div className="font-body text-xs text-muted mt-0.5">
                        {item.bedrooms || 0} BHK / {item.bathrooms || 0} Bath /{" "}
                        {item.size || 0} sqft
                      </div>
                    </Table.Cell>

                    <Table.Cell className="p-4">
                      <div className="font-body text-sm font-semibold text-primary">
                        ${Number(item.rentPrice || 0).toLocaleString()}
                      </div>
                      <div className="font-body text-xs text-muted font-light">
                        per{" "}
                        {sanitizeValue(item.rentType, "Monthly").toLowerCase()}
                      </div>
                    </Table.Cell>

                    <Table.Cell className="p-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`inline-block px-2.5 py-1 text-[10px] font-semibold rounded-full tracking-wide uppercase ${getStatusStyles(item.status)}`}
                        >
                          {item.status || "Pending"}
                        </span>
                      </div>
                    </Table.Cell>

                    <Table.Cell className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status !== "approved" && (
                          <button
                            onClick={() => handleApprove(item._id)}
                            title="Approve & Publish"
                            className="p-1.5 rounded-lg border cursor-pointer transition-all duration-150 border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-300"
                          >
                            <Check size={15} className="stroke-[2.5]" />
                          </button>
                        )}
                        {item.status !== "rejected" && (
                          <button
                            onClick={() => handleRejectClick(item)}
                            title="Reject Listing"
                            className="p-1.5 rounded-lg border cursor-pointer transition-all duration-150 border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-900/40 dark:hover:text-amber-300"
                          >
                            <X size={15} className="stroke-[2.5]" />
                          </button>
                        )}
                        <div className="w-[1px] h-4 bg-border/40 mx-0.5" />
                        <button
                          onClick={() => handleEditClick(item)}
                          title="Modify Entry Specifications"
                          className="p-1.5 rounded-lg border cursor-pointer transition-all duration-150 border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-900/40 dark:hover:text-blue-300"
                        >
                          <PenIcon width={14} height={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.title)}
                          title="Purge Document Completely"
                          className="p-1.5 rounded-lg border cursor-pointer transition-all duration-150 border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/40 dark:hover:text-rose-300"
                        >
                          <TrashBin width={14} height={14} />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
          <Table.Footer className="p-4 bg-surface-container-lowest border-t border-border/40 text-xs font-body text-muted">
            Showing {properties.length} of {totalCount} Global Ledger Artifacts
          </Table.Footer>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination className="flex flex-col sm:flex-row items-center gap-4 bg-card/20 p-4 rounded-xl border border-border/40">
            <Pagination.Summary className="text-xs text-muted font-body">
              Page {currentPage} of {totalPages}
            </Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  disabled={currentPage === 1}
                  onClick={() =>
                    currentPage > 1 &&
                    updateSearchParam("page", currentPage - 1)
                  }
                  className={`flex items-center gap-1 text-sm font-body ${currentPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                >
                  <Pagination.PreviousIcon />
                  <span>Previous</span>
                </Pagination.Previous>
              </Pagination.Item>

              {pages.map((pageNum) => (
                <Pagination.Item key={pageNum}>
                  <Pagination.Link
                    isActive={currentPage === pageNum}
                    onClick={() => updateSearchParam("page", pageNum)}
                    className={`cursor-pointer font-body text-sm relative transition-colors ${currentPage === pageNum ? "bg-secondary backdrop-blur-sm text-white" : ""}`}
                  >
                    {pageNum}
                  </Pagination.Link>
                </Pagination.Item>
              ))}

              <Pagination.Item>
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    currentPage < totalPages &&
                    updateSearchParam("page", currentPage + 1)
                  }
                  className={`flex items-center gap-1 text-sm font-body ${currentPage === totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                >
                  <span>Next</span>
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}

      {/* Rejection Modal */}
      <Modal isOpen={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <Modal.Backdrop>
          <Modal.Container placement="auto">
            <Modal.Dialog className="sm:max-w-md">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading className="text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <X size={20} /> Record Rejection Protocol
                </Modal.Heading>
                <p className="mt-1.5 text-xs text-muted leading-relaxed">
                  Specify details regarding layout or rule violations. Owners
                  see this error message context cleanly within their panel.
                </p>
              </Modal.Header>

              <Modal.Body className="p-5">
                <Surface variant="default">
                  <form
                    onSubmit={handleRejectSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-semibold text-foreground">
                        Rejection Reason & Feedback
                      </Label>
                      <textarea
                        value={rejectionFeedback}
                        onChange={(e) => setRejectionFeedback(e.target.value)}
                        placeholder="e.g. Image resolution poor..."
                        className="w-full bg-surface-container-low border border-border/60 rounded-xl p-3 min-h-[100px] focus:outline-none focus:border-rose-500 text-sm text-foreground resize-none font-body"
                        required
                      />
                    </div>

                    <Modal.Footer className="px-0 pb-0 pt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsRejectModalOpen(false)}
                      >
                        Dismiss
                      </Button>
                      <Button
                        type="submit"
                        disabled={actionLoading}
                        className="bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 min-w-[120px]"
                      >
                        {actionLoading ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          "Apply Restriction"
                        )}
                      </Button>
                    </Modal.Footer>
                  </form>
                </Surface>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <Modal.Backdrop>
          <Modal.Container placement="auto">
            <Modal.Dialog className="sm:max-w-lg">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Edit Global Entry Specifications</Modal.Heading>
                <p className="mt-1.5 text-xs text-muted">
                  Admin level adjustments over layout configurations bypass
                  submission queues directly.
                </p>
              </Modal.Header>

              <Modal.Body className="p-6">
                <Surface variant="default">
                  <form
                    onSubmit={handleUpdateSubmit}
                    className="flex flex-col gap-4"
                  >
                    <TextField
                      className="w-full"
                      name="title"
                      variant="secondary"
                    >
                      <Label>Property Title</Label>
                      <Input
                        placeholder="e.g. Dhaka Villa Residence"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                      />
                    </TextField>

                    <TextField
                      className="w-full"
                      name="location"
                      variant="secondary"
                    >
                      <Label>Location Address</Label>
                      <Input
                        placeholder="e.g. Dhaka, Bangladesh"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        required
                      />
                    </TextField>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-medium text-foreground">
                          Property Type
                        </Label>
                        <select
                          value={formData.propertyType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              propertyType: e.target.value,
                            })
                          }
                          className="h-10 w-full rounded-lg border border-border/60 bg-surface-container-low px-3 text-sm text-foreground shadow-sm outline-none focus:border-primary transition-colors cursor-pointer"
                          required
                        >
                          {PROPERTY_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-medium text-foreground">
                          Rent Cycle
                        </Label>
                        <select
                          value={formData.rentType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              rentType: e.target.value,
                            })
                          }
                          className="h-10 w-full rounded-lg border border-border/60 bg-surface-container-low px-3 text-sm text-foreground shadow-sm outline-none focus:border-primary transition-colors cursor-pointer"
                          required
                        >
                          {RENT_TYPES.map((rate) => (
                            <option key={rate} value={rate}>
                              {rate}
                            </option>
                          ))}
                        </select>
                      </div>

                      <TextField
                        className="w-full"
                        name="rentPrice"
                        type="number"
                        variant="secondary"
                      >
                        <Label>Rent Price ($)</Label>
                        <Input
                          placeholder="8500"
                          value={formData.rentPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              rentPrice: e.target.value,
                            })
                          }
                          required
                        />
                      </TextField>

                      <span className="hidden sm:block" />

                      <TextField
                        className="w-full"
                        name="bedrooms"
                        type="number"
                        variant="secondary"
                      >
                        <Label>Bedrooms</Label>
                        <Input
                          placeholder="0"
                          value={formData.bedrooms}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bedrooms: e.target.value,
                            })
                          }
                          required
                        />
                      </TextField>

                      <TextField
                        className="w-full"
                        name="bathrooms"
                        type="number"
                        variant="secondary"
                      >
                        <Label>Bathrooms</Label>
                        <Input
                          placeholder="0"
                          value={formData.bathrooms}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bathrooms: e.target.value,
                            })
                          }
                          required
                        />
                      </TextField>
                    </div>

                    <Modal.Footer className="px-0 pb-0 pt-4">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsEditModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={actionLoading}
                        className="min-w-[100px]"
                      >
                        {actionLoading ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </Modal.Footer>
                  </form>
                </Surface>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
