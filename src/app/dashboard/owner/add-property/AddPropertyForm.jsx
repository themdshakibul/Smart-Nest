"use client";

import { createProperty } from "@/lib/actions/properties";
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
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddPropertyForm({ user }) {
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
    rentType: "Monthly", // fallback initial state matching default visual selector
    bedrooms: "",
    bathrooms: "",
    size: "",
    customAmenities: "",
  });

  // Safe Array State for Amenities Multi-Selection
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const toggleAmenity = (id) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Uniform Change Handler for basic fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImages(true);
    clearFieldError("images");

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

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            `Upload failed with status: ${response.status}`,
        );
      }

      if (data.secure_url) {
        setUploadedImages([data.secure_url]);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Invalid response structure from Cloudinary");
      }
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Image upload failed. Try another format.",
      );
    } finally {
      setUploadingImages(false);
    }
  };

  // Form Submission Handler
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

    if (uploadedImages.length === 0) {
      newErrors.images = "Please upload a property asset image";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill out all fields to publish your listing.");
      return;
    }

    setLoading(true);

    const fullPayload = {
      ...formData,
      amenities: selectedAmenities,
      images: uploadedImages,
      status: "Pending",
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      userPlan: user?.plan,
    };

    try {
      const newPost = await createProperty(fullPayload);
      console.log(newPost);

      if (newPost?.insertedId) {
        toast.success("Masterpiece Listing Published!");
        router.push("/dashboard/owner/my-properties");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to finalize listing entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body min-h-screen bg-background text-foreground py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="font-heading font-bold text-4xl text-foreground tracking-tight mb-2">
          List Your Masterpiece
        </h1>
        <p className="text-muted text-sm max-w-2xl">
          Curate an experience for your prospective tenants. Provide exquisite
          details to match the calibre of your property.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COMPONENT COLUMN */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
          {/* Section 1: Basic Specifications */}
          <div className="bg-surface border border-border/20 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-secondary font-semibold border-b border-border/10 pb-3">
              <FileText size={18} />
              <h3>Basic Information</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold text-foreground">
                Property Title
              </Label>
              <Input
                name="title"
                placeholder="Enter Your Property Title"
                variant="bordered"
                className="w-full text-sm"
                value={formData.title}
                onChange={handleInputChange}
                aria-label="Property Title"
              />
              {errors.title && (
                <span className="text-xs text-danger mt-0.5 px-1">
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
                  name="propertyType"
                  selectedKey={formData.propertyType}
                  onSelectionChange={(key) => {
                    setFormData((prev) => ({ ...prev, propertyType: key }));
                    clearFieldError("propertyType");
                  }}
                >
                  <Select.Trigger className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border/30 rounded-xl text-sm min-h-[48px] text-left">
                    <Select.Value />
                    <ChevronDown size={16} className="text-muted" />
                  </Select.Trigger>
                  <Select.Popover className="bg-surface border border-border/30 rounded-xl shadow-xl mt-1">
                    <ListBox className="p-1">
                      <ListBox.Item
                        id="Villa"
                        textValue="Villa"
                        className="px-3 py-2 text-sm rounded-lg hover:bg-card cursor-pointer"
                      >
                        Villa
                      </ListBox.Item>
                      <ListBox.Item
                        id="Apartment"
                        textValue="Apartment"
                        className="px-3 py-2 text-sm rounded-lg hover:bg-card cursor-pointer"
                      >
                        Apartment
                      </ListBox.Item>
                      <ListBox.Item
                        id="Penthouse"
                        textValue="Penthouse"
                        className="px-3 py-2 text-sm rounded-lg hover:bg-card cursor-pointer"
                      >
                        Penthouse
                      </ListBox.Item>
                      <ListBox.Item
                        id="Mansion"
                        textValue="Mansion"
                        className="px-3 py-2 text-sm rounded-lg hover:bg-card cursor-pointer"
                      >
                        Mansion
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
                {errors.propertyType && (
                  <span className="text-xs text-danger mt-0.5 px-1">
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
                onChange={(e) => {
                  setFormData((p) => ({ ...p, description: e.target.value }));
                  clearFieldError("description");
                }}
                className="w-full bg-card border border-border/30 rounded-xl p-4 min-h-[120px] focus:outline-none focus:border-secondary text-sm resize-none"
              />
              {errors.description && (
                <span className="text-xs text-danger mt-0.5 px-1">
                  {errors.description}
                </span>
              )}
            </div>
          </div>

          {/* Section 2: Financial Matrix + Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border/20 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-secondary font-semibold border-b border-border/10 pb-2">
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
                  variant="bordered"
                  className="w-full bg-card border-border/30 rounded-xl min-h-[48px]"
                  value={formData.rentPrice}
                  onChange={handleInputChange}
                  aria-label="2000"
                />
                {errors.rentPrice && (
                  <span className="text-xs text-danger mt-0.5 px-1">
                    {errors.rentPrice}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-semibold text-foreground">
                  Rent Type
                </Label>
                <Select
                  name="rentType"
                  selectedKey={formData.rentType}
                  onSelectionChange={(key) =>
                    setFormData((prev) => ({ ...prev, rentType: key }))
                  }
                >
                  <Select.Trigger className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border/30 rounded-xl text-sm min-h-[48px] text-left">
                    <Select.Value />
                    <ChevronDown size={16} className="text-muted" />
                  </Select.Trigger>
                  <Select.Popover className="bg-surface border border-border/30 rounded-xl shadow-xl mt-1">
                    <ListBox className="p-1">
                      <ListBox.Item
                        id="Monthly"
                        textValue="Monthly"
                        className="px-3 py-2 text-sm rounded-lg hover:bg-card cursor-pointer"
                      >
                        Monthly
                      </ListBox.Item>
                      <ListBox.Item
                        id="Weekly"
                        textValue="Weekly"
                        className="px-3 py-2 text-sm rounded-lg hover:bg-card cursor-pointer"
                      >
                        Weekly
                      </ListBox.Item>
                      <ListBox.Item
                        id="Daily"
                        textValue="Daily"
                        className="px-3 py-2 text-sm rounded-lg hover:bg-card cursor-pointer"
                      >
                        Daily
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </div>

            <div className="bg-surface border border-border/20 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-secondary font-semibold border-b border-border/10 pb-2">
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
                    placeholder="0"
                    variant="bordered"
                    className="w-full bg-card border-border/30 rounded-xl min-h-[48px]"
                    aria-label="0"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                  />
                  {errors.bedrooms && (
                    <span className="text-xs text-danger mt-0.5 px-1">
                      {errors.bedrooms}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-semibold text-foreground">
                    Bathrooms
                  </Label>
                  <Input
                    type="number"
                    step="1"
                    name="bathrooms"
                    placeholder="0"
                    variant="bordered"
                    className="w-full bg-card border-border/30 rounded-xl min-h-[48px]"
                    aria-label="0"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                  />
                  {errors.bathrooms && (
                    <span className="text-xs text-danger mt-0.5 px-1">
                      {errors.bathrooms}
                    </span>
                  )}
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
                  variant="bordered"
                  className="w-full bg-white border-border/30 rounded-xl min-h-[48px]"
                  aria-label="2500"
                  value={formData.size}
                  onChange={handleInputChange}
                />
                {errors.size && (
                  <span className="text-xs text-danger mt-0.5 px-1">
                    {errors.size}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Location Card */}
          <div className="bg-surface border border-border/20 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-secondary font-semibold border-b border-border/10 pb-3">
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
                variant="bordered"
                className="w-full bg-white border-border/30 rounded-xl min-h-[48px]"
                aria-label="Start typing the address..."
                value={formData.location}
                onChange={handleInputChange}
              />
              {errors.location && (
                <span className="text-xs text-danger mt-0.5 px-1">
                  {errors.location}
                </span>
              )}
            </div>
          </div>

          {/* Section 4: Cloudinary Media Gallery */}
          <div className="bg-surface border border-border/20 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-secondary font-semibold border-b border-border/10 pb-3">
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
                aria-label="Upload property asset image"
              />

              <div className="flex flex-col items-center justify-center pointer-events-none">
                <CloudUpload size={40} className="text-muted mb-3" />
                <p className="text-sm font-semibold text-foreground">
                  Drag and drop a high-res property image
                </p>
                <p className="text-xs text-muted mt-1 mb-4">
                  Recommended: 4:3 aspect ratio, minimum 1920x1080px
                </p>

                <Button
                  size="sm"
                  variant="flat"
                  className="bg-surface border border-border/30 font-medium"
                  tabIndex={-1}
                >
                  {uploadingImages ? "Uploading..." : "Browse File"}
                </Button>
              </div>
            </div>
            {errors.images && (
              <span className="text-xs text-danger mt-0.5 block px-1">
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
                      alt="Uploaded Item Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Extras & Amenities */}
          <div className="bg-surface border border-border/20 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-secondary font-semibold border-b border-border/10 pb-3">
              <Sparkles size={18} />
              <h3>Luxury Amenities & Features</h3>
            </div>

            <div className="flex flex-col gap-4">
              <Label className="text-sm font-semibold text-foreground">
                Select one or more highlights for this property listing
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amenity 1 */}
                <div
                  onClick={() => toggleAmenity("smartHome")}
                  className={`p-4 border rounded-xl bg-card/30 transition-all cursor-pointer flex items-start gap-3 select-none ${
                    selectedAmenities.includes("smartHome")
                      ? "border-secondary bg-secondary/5"
                      : "border-border/20"
                  }`}
                >
                  <Checkbox
                    isSelected={selectedAmenities.includes("smartHome")}
                    aria-label="Smart Home Systems"
                  />
                  <div className="flex flex-col -mt-0.5">
                    <span className="text-sm font-semibold text-foreground">
                      Smart Home Systems
                    </span>
                    <Description className="text-xs text-muted mt-0.5">
                      Integrated automated lighting, climate, and app control
                      units.
                    </Description>
                  </div>
                </div>

                {/* Amenity 2 */}
                <div
                  onClick={() => toggleAmenity("infinityPool")}
                  className={`p-4 border rounded-xl bg-card/30 transition-all cursor-pointer flex items-start gap-3 select-none ${
                    selectedAmenities.includes("infinityPool")
                      ? "border-secondary bg-secondary/5"
                      : "border-border/20"
                  }`}
                >
                  <Checkbox
                    isSelected={selectedAmenities.includes("infinityPool")}
                    aria-label="Private Infinity Pool"
                  />
                  <div className="flex flex-col -mt-0.5">
                    <span className="text-sm font-semibold text-foreground">
                      Private Infinity Pool
                    </span>
                    <Description className="text-xs text-muted mt-0.5">
                      Glass-walled premium heated infinity pool with skyline
                      orientation.
                    </Description>
                  </div>
                </div>
                {/* Amenity 3 */}
                <div
                  onClick={() => toggleAmenity("wineCellar")}
                  className={`p-4 border rounded-xl bg-card/30 transition-all cursor-pointer flex items-start gap-3 select-none ${
                    selectedAmenities.includes("wineCellar")
                      ? "border-secondary bg-secondary/5"
                      : "border-border/20"
                  }`}
                >
                  <Checkbox
                    isSelected={selectedAmenities.includes("wineCellar")}
                    aria-label="Sommelier Wine Cellar"
                  />
                  <div className="flex flex-col -mt-0.5">
                    <span className="text-sm font-semibold text-foreground">
                      Sommelier Wine Cellar
                    </span>
                    <Description className="text-xs text-muted mt-0.5">
                      Climate and humidity display protection vault for fine
                      vintages.
                    </Description>
                  </div>
                </div>

                {/* Amenity 4 */}
                <div
                  onClick={() => toggleAmenity("concierge")}
                  className={`p-4 border rounded-xl bg-card/30 transition-all cursor-pointer flex items-start gap-3 select-none ${
                    selectedAmenities.includes("concierge")
                      ? "border-secondary bg-secondary/5"
                      : "border-border/20"
                  }`}
                >
                  <Checkbox
                    isSelected={selectedAmenities.includes("concierge")}
                    aria-label="24/7 Elite Concierge"
                  />
                  <div className="flex flex-col -mt-0.5">
                    <span className="text-sm font-semibold text-foreground">
                      24/7 Elite Concierge
                    </span>
                    <Description className="text-xs text-muted mt-0.5">
                      On-demand luxury hospitality, guest reception, and booking
                      service.
                    </Description>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-2">
              <Label className="text-sm font-semibold text-foreground">
                Custom Extra Features
              </Label>
              <TextArea
                aria-label="Custom Highlights"
                placeholder="Any unique highlights not mentioned above (e.g., Helipad access, Private Spa)..."
                value={formData.customAmenities}
                onChange={(e) => {
                  setFormData((p) => ({
                    ...p,
                    customAmenities: e.target.value,
                  }));
                }}
                className="w-full bg-white border border-border/30 rounded-xl p-4 min-h-[90px] focus:outline-none focus:border-secondary text-sm resize-none"
              />
              <Description className="text-xs text-muted px-1">
                Characters: {formData.customAmenities.length}
              </Description>
            </div>
          </div>

          {/* Small Screen Layout Submission Trigger */}
          <div className="lg:hidden">
            <Button
              type="submit"
              disabled={loading || uploadingImages}
              className="w-full bg-midnight-emerald text-white dark:bg-secondary dark:text-background py-6 rounded-full font-bold text-base shadow-md"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Publish Listing"
              )}
            </Button>
          </div>
        </form>

        {/* RIGHT COLUMN COMPONENT */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <div className="bg-surface border border-border/20 rounded-3xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user?.image && (
                <Image
                  src={user.image}
                  alt={user.name || "User Avatar"}
                  width={80}
                  height={80}
                  className="rounded-full border border-border/30"
                />
              )}
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  {user?.name || "Owner Profile"}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-card text-muted rounded-md border border-border/20">
                    {user?.role || "Owner"}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted font-semibold uppercase tracking-wider">
                Email
              </p>
              <p className="text-xs font-medium text-foreground/80 max-w-[120px] truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="bg-surface border border-border/20 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/10 pb-3">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Submission Status
              </span>
              <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                ● Pending
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Complete all required fields marked with an asterisk to enable
              listing publication.
            </p>
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-muted font-medium">Current Plan:</span>
              <span className="font-bold text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded">
                {user?.plan?.replace("_", " ") || "OWNER FREE"}
              </span>
            </div>
          </div>

          {/* Large Screen Trigger Action Button Block */}
          <div className="hidden lg:block">
            <Button
              type="button"
              disabled={loading || uploadingImages}
              onClick={() => handleSubmit()}
              className="w-full bg-midnight-emerald text-white dark:bg-secondary dark:text-background py-6 rounded-2xl font-bold text-base shadow-md hover:opacity-95 transition active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Publish Listing"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
