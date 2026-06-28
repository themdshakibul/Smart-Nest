"use client";

import { updateProperty } from "@/lib/actions/properties"; // ✅ OK only if this file has "use server" at top
import {
  Button,
  Checkbox,
  Description,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
} from "@heroui/react";
import {
  CheckCircle,
  ChevronDown,
  CloudUpload,
  DollarSign,
  FileText,
  Home,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// ✅ Receives both user and property as props from the Server Component (page.jsx)
// ❌ Removed: getPropertyByPropertyId import (was server-only)
// ❌ Removed: useParams (propertyId now comes from property._id via props)

export default function EditPropertyForm({ user, property }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [errors, setErrors] = useState({});

  // Base Form Fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    propertyType: "",
    rentPrice: "",
    rentType: "Monthly",
    bedrooms: "",
    bathrooms: "",
    size: "",
    customAmenities: "",
  });

  // Safe Array State for Amenities Multi-Selection
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // ✅ Populate form from the property prop (passed from Server Component)
  // ❌ Removed: useEffect that called getPropertyByPropertyId (was a server-only fetch)
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        location: property.location || "",
        propertyType: property.propertyType || "",
        rentPrice: property.rentPrice || "",
        rentType: property.rentType || "Monthly",
        bedrooms: property.bedrooms || "",
        bathrooms: property.bathrooms || "",
        size: property.size || "",
        customAmenities: property.customAmenities || "",
      });
      setSelectedAmenities(property.amenities || []);
      setUploadedImages(property.images || []);
    }
  }, [property]);

  const toggleAmenity = (id) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImages(true);
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }

    const formDataPayload = new FormData();
    formDataPayload.append("file", file);
    formDataPayload.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET,
    );

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formDataPayload,
        },
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error?.message || "Upload structural anomaly encountered.",
        );

      if (data.secure_url) {
        setUploadedImages([data.secure_url]);
        toast.success("Image updated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image asset loading transaction rejected.");
    } finally {
      setUploadingImages(false);
    }
  };

  // PUT Submission Handler
  // ✅ Uses property._id from prop instead of useParams()
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const newErrors = {};
    if (!formData.title) newErrors.title = "Property title is required";
    if (!formData.description)
      newErrors.description = "Property description is required";
    if (!formData.location)
      newErrors.location = "Property location is required";
    if (!formData.propertyType)
      newErrors.propertyType = "Please select a property type";
    if (!formData.rentPrice) newErrors.rentPrice = "Rent price is required";
    if (!formData.bedrooms)
      newErrors.bedrooms = "Number of bedrooms is required";
    if (!formData.bathrooms)
      newErrors.bathrooms = "Number of bathrooms is required";
    if (!formData.size) newErrors.size = "Property size is required";
    if (uploadedImages.length === 0)
      newErrors.images = "Please upload a property asset image";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill out all fields to save changes.");
      return;
    }

    setLoading(true);

    const updatedPayload = {
      ...formData,
      amenities: selectedAmenities,
      images: uploadedImages,
    };

    try {
      // ✅ Uses property._id from props — no need for useParams()
      const result = await updateProperty(property._id, updatedPayload);

      if (result.modifiedCount === 0 && result.matchedCount === 0) {
        throw new Error("No database document layout changes adjusted.");
      }

      toast.success("Masterpiece Listing Configuration Saved!");
      router.push("/dashboard/owner/my-properties");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to finalize structural edits.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body min-h-screen bg-background text-foreground py-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Structural Title Area */}
      <div className="mb-10">
        <h1 className="font-heading font-bold text-4xl text-foreground tracking-tight mb-2">
          Edit Architectural Masterpiece
        </h1>
        <p className="text-muted text-sm max-w-2xl">
          Modify and adjust the layout configurations and specifications of your
          active real estate asset.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: Input Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
          {/* Section 1: Basic Specifications */}
          <div className="bg-surface border border-border/20 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-primary font-semibold border-b border-border/10 pb-3">
              <FileText size={18} />
              <h3>Basic Information</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold text-foreground">
                Property Title
              </Label>
              <Input
                name="title"
                placeholder="e.g. Azure Cliffside Villa"
                required
                variant="bordered"
                className="w-full px-4 py-3 bg-card border border-border/30 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                value={formData.title}
                onChange={handleInputChange}
                aria-label="Property Title"
              />
              {errors.title && (
                <span className="text-xs text-danger font-medium px-1">
                  {errors.title}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-semibold text-foreground">
                  Property Type
                </Label>
                <Select
                  value={formData.propertyType}
                  onSelectionChange={(key) =>
                    setFormData((p) => ({ ...p, propertyType: key }))
                  }
                >
                  <Select.Trigger className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border/30 rounded-xl text-sm min-h-[48px] text-left text-foreground">
                    <Select.Value
                      placeholder={formData.propertyType || "Select Type"}
                    />
                    <ChevronDown size={16} className="text-muted" />
                  </Select.Trigger>
                  <Select.Popover className="bg-surface border border-border/30 rounded-xl shadow-xl mt-1">
                    <ListBox className="p-1">
                      {["Villa", "Apartment", "Penthouse", "Mansion"].map(
                        (type) => (
                          <ListBox.Item
                            key={type}
                            className="px-3 py-2 text-sm text-foreground rounded-lg hover:bg-card cursor-pointer"
                          >
                            {type}
                          </ListBox.Item>
                        ),
                      )}
                    </ListBox>
                  </Select.Popover>
                </Select>
                {errors.propertyType && (
                  <span className="text-xs text-danger font-medium px-1">
                    {errors.propertyType}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold text-foreground">
                Description
              </Label>
              <TextArea
                aria-label="Property Description"
                placeholder="Describe the architectural soul of the property..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                className="w-full bg-card border border-border/30 rounded-xl p-4 min-h-[120px] focus:outline-none focus:border-primary text-sm text-foreground resize-none"
              />
              {errors.description && (
                <span className="text-xs text-danger font-medium px-1">
                  {errors.description}
                </span>
              )}
            </div>
          </div>

          {/* Section 2: Pricing & Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border/20 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold border-b border-border/10 pb-2">
                <DollarSign size={18} />
                <h3>Pricing & Availability</h3>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-semibold text-foreground">
                  Rent Price ($)
                </Label>
                <Input
                  type="number"
                  name="rentPrice"
                  placeholder="2000"
                  required
                  variant="bordered"
                  className="w-full px-4 py-3 bg-card border border-border/30 rounded-xl text-sm text-foreground focus:outline-none"
                  value={formData.rentPrice}
                  onChange={handleInputChange}
                  aria-label="Rent Price"
                />
                {errors.rentPrice && (
                  <span className="text-xs text-danger font-medium px-1">
                    {errors.rentPrice}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-semibold text-foreground">
                  Rent Type
                </Label>
                <Select
                  value={formData.rentType}
                  onSelectionChange={(key) =>
                    setFormData((p) => ({ ...p, rentType: key }))
                  }
                >
                  <Select.Trigger className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border/30 rounded-xl text-sm min-h-[48px] text-left text-foreground">
                    <Select.Value
                      placeholder={formData.rentType || "Monthly"}
                    />
                    <ChevronDown size={16} className="text-muted" />
                  </Select.Trigger>
                  <Select.Popover className="bg-surface border border-border/30 rounded-xl shadow-xl mt-1">
                    <ListBox className="p-1">
                      {["Monthly", "Weekly", "Daily"].map((rate) => (
                        <ListBox.Item
                          key={rate}
                          className="px-3 py-2 text-sm text-foreground rounded-lg hover:bg-card cursor-pointer"
                        >
                          {rate}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </div>

            <div className="bg-surface border border-border/20 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold border-b border-border/10 pb-2">
                <Home size={18} />
                <h3>Property Specs</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-semibold text-foreground">
                    Bedrooms
                  </Label>
                  <Input
                    type="number"
                    name="bedrooms"
                    placeholder="2"
                    required
                    className="w-full px-4 py-3 bg-card border border-border/30 rounded-xl text-sm text-foreground"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-semibold text-foreground">
                    Bathrooms
                  </Label>
                  <Input
                    type="number"
                    step="0.5"
                    name="bathrooms"
                    placeholder="2"
                    required
                    className="w-full px-4 py-3 bg-card border border-border/30 rounded-xl text-sm text-foreground"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-semibold text-foreground">
                  Size (sqft)
                </Label>
                <Input
                  type="number"
                  name="size"
                  placeholder="2500"
                  required
                  className="w-full px-4 py-3 bg-card border border-border/30 rounded-xl text-sm text-foreground"
                  value={formData.size}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="bg-surface border border-border/20 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary font-semibold border-b border-border/10 pb-3">
              <MapPin size={18} />
              <h3>Location</h3>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold text-foreground">
                Full Address
              </Label>
              <Input
                name="location"
                placeholder="Start typing the address..."
                required
                className="w-full px-4 py-3 bg-card border border-border/30 rounded-xl text-sm text-foreground"
                value={formData.location}
                onChange={handleInputChange}
              />
              {errors.location && (
                <span className="text-xs text-danger font-medium px-1">
                  {errors.location}
                </span>
              )}
            </div>
          </div>

          {/* Section 4: Media Gallery */}
          <div className="bg-surface border border-border/20 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary font-semibold border-b border-border/10 pb-3">
              <ImageIcon size={18} />
              <h3>Media Gallery</h3>
            </div>

            <div className="border-2 border-dashed border-border/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-card/40 transition hover:bg-card/70 relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer disabled:pointer-events-none z-10"
                disabled={uploadingImages}
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <CloudUpload size={40} className="text-muted mb-3" />
                <p className="text-sm font-semibold text-foreground">
                  Upload new replacement listing image asset
                </p>
                <p className="text-xs text-muted mt-1 mb-4">
                  Recommended: 4:3 aspect ratio
                </p>
                <Button
                  size="sm"
                  variant="flat"
                  className="bg-surface border border-border/30 font-medium text-foreground"
                  tabIndex={-1}
                >
                  {uploadingImages ? "Uploading..." : "Browse File"}
                </Button>
              </div>
            </div>

            {errors.images && (
              <span className="text-xs text-danger font-medium px-1">
                {errors.images}
              </span>
            )}

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                {uploadedImages.map((url, index) => (
                  <div
                    key={index}
                    className="aspect-square relative rounded-xl overflow-hidden border border-border/30"
                  >
                    <Image
                      src={url}
                      height={100}
                      width={100}
                      alt="Asset Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Amenities */}
          <div className="bg-surface border border-border/20 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-primary font-semibold border-b border-border/10 pb-3">
              <Sparkles size={18} />
              <h3>Luxury Amenities & Features</h3>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: "smartHome",
                    label: "Smart Home Systems",
                    desc: "Integrated automated lighting, climate, and app control units.",
                  },
                  {
                    id: "infinityPool",
                    label: "Private Infinity Pool",
                    desc: "Glass-walled premium heated infinity pool with skyline orientation.",
                  },
                  {
                    id: "wineCellar",
                    label: "Sommelier Wine Cellar",
                    desc: "Climate and humidity display protection vault for fine vintages.",
                  },
                  {
                    id: "concierge",
                    label: "24/7 Elite Concierge",
                    desc: "On-demand luxury hospitality, guest reception, and booking service.",
                  },
                ].map((amenity) => (
                  <div
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`p-4 border rounded-xl bg-card/30 transition-all cursor-pointer flex items-start gap-3 select-none ${
                      selectedAmenities.includes(amenity.id)
                        ? "border-primary bg-primary/5"
                        : "border-border/20"
                    }`}
                  >
                    <Checkbox
                      isSelected={selectedAmenities.includes(amenity.id)}
                      aria-label={amenity.label}
                    />
                    <div className="flex flex-col -mt-0.5">
                      <span className="text-sm font-semibold text-foreground">
                        {amenity.label}
                      </span>
                      <Description className="text-xs text-muted mt-0.5">
                        {amenity.desc}
                      </Description>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-2">
              <Label className="text-sm font-semibold text-foreground">
                Custom Extra Features
              </Label>
              <TextArea
                placeholder="Unique highlights..."
                value={formData.customAmenities}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    customAmenities: e.target.value,
                  }))
                }
                className="w-full bg-card border border-border/30 rounded-xl p-4 min-h-[90px] text-sm text-foreground resize-none"
              />
            </div>
          </div>

          {/* Small Screen Layout Submission Trigger */}
          <div className="lg:hidden">
            <Button
              type="submit"
              disabled={loading || uploadingImages}
              className="w-full bg-primary text-white py-6 rounded-full font-bold text-base shadow-md"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save Specifications"
              )}
            </Button>
          </div>
        </form>

        {/* RIGHT COLUMN: Info Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <div className="bg-surface border border-border/20 rounded-3xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user?.image && (
                <Image
                  src={user.image}
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  {user?.name || "Owner Profile"}
                </h4>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-card text-muted rounded-md border border-border/20">
                  {user?.role || "Owner"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border/20 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/10 pb-3">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Editor Profile State
              </span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1">
                Active Edit Mode
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Modifying active assets impacts live marketplace representations
              instantaneously upon saving adjustments.
            </p>
          </div>

          {/* Large Screen Trigger */}
          <div className="hidden lg:block">
            <Button
              type="button"
              disabled={loading || uploadingImages}
              onClick={() => handleSubmit()}
              className="w-full bg-primary text-white py-6 rounded-2xl font-bold text-base shadow-md hover:opacity-95 transition cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  <span>Saving Specifications...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} />
                  <span>Save Specifications</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

