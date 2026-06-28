


"use client";

import { deleteProperty, updateProperty } from "@/lib/actions/properties";
import { TrashBin } from "@gravity-ui/icons";
import {
  Button,
  Input,
  Label,
  Modal,
  Surface,
  Table,
  TextField,
} from "@heroui/react";
import { Loader2, PenIcon, Eye, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const PROPERTY_TYPES = ["Apartment", "Villa", "Penthouse", "Mansion"];
const RENT_TYPES = ["Monthly", "Weekly", "Daily"];

export default function PropertiesTableClient({ initialProperties }) {
  const router = useRouter();
  const [properties, setProperties] = useState(initialProperties);

  // --- MODAL & FORM STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [saving, setSaving] = useState(false);

  // --- REJECTION MODAL STATE ---
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackPropertyTitle, setFeedbackPropertyTitle] = useState("");

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
    setIsModalOpen(true);
  };

  // --- OPEN REJECTION FEEDBACK MODAL ---
  const handleViewFeedbackClick = (property) => {
    setFeedbackText(property.rejectionFeedback || "No specific feedback reason was supplied.");
    setFeedbackPropertyTitle(property.title || "Selected Property");
    setIsFeedbackModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
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

      if (result && result.matchedCount > 0) {
        setProperties((prev) =>
          prev.map((item) =>
            item._id === selectedProperty._id
              ? { ...item, ...updatedPayload }
              : item
          )
        );
        toast.success("Listing updated successfully!", { id: toastId });
        setIsModalOpen(false);
        router.refresh();
      } else {
        throw new Error("No documents were modified");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to save changes.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (propertyId, propertyTitle) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-surface shadow-lg rounded-xl pointer-events-auto flex flex-col p-4 border border-border/60`}
        >
          <div className="flex-1">
            <p className="font-body text-sm font-semibold text-primary">
              Delete Property?
            </p>
            <p className="font-body text-xs text-muted mt-1">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                "{propertyTitle}"
              </span>
              ? This action cannot be undone.
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
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const executeDelete = async (propertyId, propertyTitle) => {
    const toastId = toast.loading("Deleting property...");
    try {
      const response = await deleteProperty(propertyId);
      if (!response || response.deletedCount !== 1)
        throw new Error("Failed to delete");
      
      setProperties((prev) => prev.filter((item) => item._id !== propertyId));
      toast.success(`${propertyTitle} removed successfully!`, { id: toastId });
      router.refresh();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(`Failed to remove ${propertyTitle}. Please try again.`, {
        id: toastId,
      });
    }
  };

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

  return (
    <div className="bg-surface rounded-3xl shadow-sm border border-border/40 overflow-hidden">
      <Table className="w-full text-left border-collapse">
        <Table.ScrollContainer>
          <Table.Content aria-label="Properties management table">
            <Table.Header className="bg-surface-container-low border-b border-border/60">
              <Table.Column
                isRowHeader
                className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4"
              >
                Property
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Location
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Type & Specs
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Rent
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4">
                Status
              </Table.Column>
              <Table.Column className="font-body text-xs font-semibold uppercase tracking-wider text-muted p-4 text-right">
                Actions
              </Table.Column>
            </Table.Header>

            <Table.Body>
              {properties.length === 0 ? (
                <Table.Row>
                  <Table.Cell
                    colSpan={6}
                    className="text-center font-body text-muted py-12"
                  >
                    No properties found.
                  </Table.Cell>
                </Table.Row>
              ) : (
                properties.map((item) => (
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
                            alt={item.title || "Property"}
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
                            #{item._id?.slice(-6).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </Table.Cell>

                    <Table.Cell className="p-4 font-body text-sm text-muted">
                      {item.location || "N/A"}
                    </Table.Cell>

                    <Table.Cell className="p-4">
                      <div className="font-body text-sm font-medium text-foreground">
                        {sanitizeValue(item.propertyType, "Apartment")}
                      </div>
                      <div className="font-body text-xs text-muted mt-0.5">
                        {item.bedrooms || 0} Bed, {item.bathrooms || 0} Bath
                      </div>
                    </Table.Cell>

                    <Table.Cell className="p-4">
                      <div className="font-body text-sm font-semibold text-primary">
                        ${Number(item.rentPrice).toLocaleString()}
                      </div>
                      <div className="font-body text-xs text-muted font-light">
                        {
                          {
                            daily: "per day",
                            weekly: "per week",
                            monthly: "per month",
                          }[sanitizeValue(item.rentType, "monthly").toLowerCase()] || "per month"
                        }
                      </div>
                    </Table.Cell>

                    {/* STATUS COLUMN WITH VIEW REJECTION FEEDBACK IMPLEMENTED */}
                    <Table.Cell className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full tracking-wide uppercase ${getStatusStyles(
                            item.status
                          )}`}
                        >
                          {item.status || "Pending"}
                        </span>
                        
                        {/* Render view action safely if explicitly rejected */}
                        {item.status?.toLowerCase() === "rejected" && (
                          <button
                            type="button"
                            onClick={() => handleViewFeedbackClick(item)}
                            title="View Rejection Feedback"
                            className="p-1 text-[#c5221f] hover:bg-[#fce8e6] rounded transition-colors cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                      </div>
                    </Table.Cell>

                    <Table.Cell className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEditClick(item)}
                          title="Edit Property"
                          className="p-1.5 text-muted hover:text-secondary rounded-md hover:bg-surface-container-high transition-colors cursor-pointer"
                        >
                          <PenIcon width={18} height={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.title)}
                          title="Delete Property"
                          className="p-1.5 text-muted hover:text-danger rounded-md hover:bg-danger/10 transition-colors cursor-pointer"
                        >
                          <TrashBin width={18} height={18} />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        <Table.Footer className="p-4 bg-surface-container-lowest border-t border-border/40 text-xs font-body text-muted">
          Showing {properties.length} of {properties.length} masterpieces
        </Table.Footer>
      </Table>

      {/* --- HEROUI EDIT MODAL SYSTEM --- */}
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Backdrop>
          <Modal.Container placement="auto">
            <Modal.Dialog className="sm:max-w-lg bg-background">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Edit Listing Specifications</Modal.Heading>
                <p className="mt-1.5 text-sm leading-5 text-muted">
                  Modify information values for your architecture listing below.
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
                        placeholder="e.g. Modern Apartment"
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
                        placeholder="e.g. California, USA"
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
                          placeholder="Rate Cost Value"
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
                        <Label>Bedrooms Count</Label>
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
                        <Label>Bathrooms Count</Label>
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
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="min-w-[100px]"
                      >
                        {saving ? (
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

      {/* --- HEROUI REJECTION FEEDBACK MODAL SYSTEM --- */}
      <Modal isOpen={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
        <Modal.Backdrop>
          <Modal.Container placement="auto">
            <Modal.Dialog className="sm:max-w-md">
              <Modal.CloseTrigger />
              <Modal.Header>
                <div className="flex items-center gap-2 text-danger">
                  <AlertTriangle size={20} />
                  <Modal.Heading>Rejection Feedback</Modal.Heading>
                </div>
                <p className="mt-1 text-xs font-body text-muted">
                  Review details on why your listing configuration was unapproved.
                </p>
              </Modal.Header>

              <Modal.Body className="p-5 font-body">
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">
                    Property Title
                  </span>
                  <div className="text-sm font-semibold text-primary bg-surface-container-low px-3 py-2 rounded-lg border border-border/40">
                    {feedbackPropertyTitle}
                  </div>
                  
                  <span className="text-xs font-bold uppercase tracking-wider text-muted mt-2">
                    Reason Provided
                  </span>
                  <div className="text-sm leading-relaxed p-4 rounded-xl border border-danger/20 bg-danger/5 text-danger font-medium whitespace-pre-wrap">
                    "{feedbackText}"
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer className="pt-2">
                <Button
                  type="button"
                  color="danger"
                  variant="flat"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="font-semibold text-sm w-full sm:w-auto"
                >
                  Close Window
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}