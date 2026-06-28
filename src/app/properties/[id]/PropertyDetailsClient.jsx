"use client";

import PropertyReviews from "@/components/tenant/PropertyReviews";
import { addToFavorite } from "@/lib/actions/AddToFavorite";
import { useSession } from "@/lib/auth-client";
import {
  Button,
  Card,
  Input,
  Label,
  Modal,
  Surface,
  TextField,
} from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bath,
  BedDouble,
  CalendarDays,
  Car,
  CheckCircle2,
  ChefHat,
  Cpu,
  FileText,
  Gem,
  Heart,
  Layout,
  MapPin,
  Phone,
  Shield,
  Square,
  Star,
  User,
  Waves,
  Wifi,
  Wine,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const amenityIconMap = {
  wifi: <Wifi size={20} className="text-secondary" />,
  parking: <Car size={20} className="text-secondary" />,
  security: <Shield size={20} className="text-secondary" />,
  "smart home": <Cpu size={20} className="text-secondary" />,
  balcony: <Layout size={20} className="text-secondary" />,
  "premium finishes": <Gem size={20} className="text-secondary" />,
  "infinity pool": <Waves size={20} className="text-secondary" />,
  "private chef": <ChefHat size={20} className="text-secondary" />,
  "wine cellar": <Wine size={20} className="text-secondary" />,
};

// Framer Motion Variants for Staggered Lists
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function PropertyDetailsClient({
  property,
  isFavorited = false,
  initialFavoriteId = null,
}) {
  const { data: session, status } = useSession();
  const user = session?.user;

  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(isFavorited);
  const [favoriteId, setFavoriteId] = useState(initialFavoriteId);
  useEffect(() => {
    setIsFavorite(isFavorited);
    setFavoriteId(initialFavoriteId);
  }, [isFavorited, initialFavoriteId]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Field Tracking States
  const [moveInDate, setMoveInDate] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [tenantFullName, setTenantFullName] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleBooking = async () => {
    if (!user) {
      router.push(`/signin?redirect=/properties/${property._id}`)
      return;
    }
    if (user.role !== "tenant") {
      router.push("/unauthorized");
      return;
    }
    setIsModalOpen(true);
  };

  const handleFavorite = async () => {
    if (!user) {
      router.push(`/signin?redirect=/properties/${property._id}`)
      return;
    }
    if (user.role !== "tenant") {
      router.push("/unauthorized");
      return;
    }

    if (isFavorite) return;

    const favoritePropertyInfo = {
      tenantId: user.id,
      tenantName: user.name,
      tenantEmail: user.email,
      propertyId: property._id,
      propertyTitle: property.title,
      propertyLocation: property.location,
      propertyImage: property.images,
      propertyRentPrice: property.rentPrice,
      propertyRentType: property.rentType,
      ownerEmail: property.userEmail,
      ownerId: property.userId,
      ownerName: property.userName,
    };

    const result = await addToFavorite(favoritePropertyInfo);

    if (result?.insertedId) {
      setIsFavorite(true);
      toast.success("Saved to your private dashboard favorites!", {
        icon: "❤️",
      });
    } else if (result?.msg === "Already Exists!") {
      setIsFavorite(true);
      toast("Already saved to your collection!", { icon: "❤️" });
    } else {
      toast.error("Failed to update selection collection profile.");
    }
  };

  const baseAmenities = property.amenities || [];
  const specializedAmenities = property.customAmenities
    ? property.customAmenities.split(",").map((item) => item.trim())
    : [];
  const mergedAmenities = Array.from(
    new Set([...baseAmenities, ...specializedAmenities]),
  );

  return (
    <div className="w-full min-h-screen bg-background pb-16">
      {/* 1. HERO BRAND COVER LAYER */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] bg-surface-container overflow-hidden">
        {property.images?.[0] ? (
          <motion.div
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            <Image
              src={property.images[0]}
              alt={property.title}
              priority
              fill
              sizes="100vw"
              className="object-cover w-full h-full"
            />
          </motion.div>
        ) : (
          <div className="w-full h-full bg-primary/20 flex items-center justify-center font-body text-muted">
            Image Unavailable
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full pb-6 sm:pb-8 md:pb-12 text-white z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-2"
            >
              <span className="bg-secondary/90 backdrop-blur-sm text-white font-body text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm">
                Luxury Exclusive
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white font-body text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm">
                {property.propertyType || "Estate"}
              </span>
            </motion.div>

            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-wide leading-tight"
              >
                {property.title}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 text-white/90 text-xs sm:text-sm md:text-base font-body"
              >
                <MapPin size={16} className="text-secondary shrink-0" />
                <span className="line-clamp-1">{property.location}</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CORE INTERACTION BLOCK MATRIX */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* LEFT COMPARTMENT */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12 order-2 lg:order-1">
          {/* Metadata Badges Container Ribbon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 py-6 border-b border-border/30"
          >
            <div className="space-y-1">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted font-body">
                Price Per Month
              </p>
              <p className="font-heading text-lg sm:text-xl md:text-2xl text-primary font-bold">
                ${Number(property.rentPrice || 0).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted font-body">
                Bedrooms
              </p>
              <div className="flex items-center gap-2 font-heading text-lg sm:text-xl md:text-2xl text-primary font-bold">
                <BedDouble size={20} className="text-secondary/80 shrink-0" />
                <span>{property.bedrooms}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted font-body">
                Bathrooms
              </p>
              <div className="flex items-center gap-2 font-heading text-lg sm:text-xl md:text-2xl text-primary font-bold">
                <Bath size={20} className="text-secondary/80 shrink-0" />
                <span>{property.bathrooms}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted font-body">
                Living Area
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2 font-heading text-lg sm:text-xl md:text-2xl text-primary font-bold">
                <Square size={18} className="text-secondary/80 shrink-0" />
                <span className="whitespace-nowrap">
                  {Number(property.size || 0).toLocaleString()} Sqft
                </span>
              </div>
            </div>
          </motion.div>

          {/* Core Descriptive Text Frame */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl text-primary font-medium tracking-wide">
              Architectural Narrative
            </h2>
            <p className="font-body text-muted text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </motion.div>

          {/* Grid Layout Loop */}
          <div className="space-y-6 pt-4">
            <h2 className="font-heading text-xl sm:text-2xl text-primary font-medium tracking-wide">
              Curated Amenities
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
            >
              {property.amenities.map((amenity, index) => {
                const lookupKey = amenity.toLowerCase().trim();
                const mappedIcon = amenityIconMap[lookupKey] || (
                  <CheckCircle2 size={20} className="text-secondary" />
                );

                return (
                  <motion.div
                    variants={itemVariants}
                    key={index}
                    className="flex flex-col justify-center items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-surface-container-low border border-border/20 rounded-xl hover:shadow-md transition-all duration-300"
                  >
                    <div className="p-2 sm:p-2.5 bg-surface-container-lowest rounded-xl shadow-xs border border-border/10">
                      {mappedIcon}
                    </div>
                    <span className="font-body text-xs md:text-sm text-primary font-semibold tracking-wide line-clamp-2">
                      {amenity}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* reviews */}
          <PropertyReviews propertyId={property._id} currentUser={user} />
        </div>

        {/* RIGHT COLUMN: BOOKING CONTROLLER CONTAINER STICKY FRAME */}
        <div className="relative order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.2,
            }}
            className="lg:sticky lg:top-24"
          >
            <Card className="bg-surface-container-lowest border border-border/40 p-4 sm:p-6 rounded-2xl shadow-xl space-y-4 sm:space-y-6">
              <div className="flex items-end justify-between border-b border-border/30 pb-4">
                <div>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-primary">
                    ${Number(property.rentPrice || 0).toLocaleString()}
                  </span>
                  <span className="text-muted text-xs font-body font-medium">
                    &nbsp;/ {property.rentType === "Monthly" ? "month" : "year"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm font-body font-semibold text-primary bg-surface-container px-2.5 py-1 rounded-md">
                  <Star size={14} className="fill-secondary text-secondary" />
                  <span>4.9</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Trigger Booking Form via State Control */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBooking}
                  className="w-full bg-[#043927] hover:bg-[#03291c] text-white font-body font-semibold transition-all duration-300 rounded-xl h-[48px] sm:h-[52px] flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md cursor-pointer group"
                >
                  <span>Book Property</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </motion.button>

                {/* Add to Favorites Toggle Handler */}
                <motion.button
                  whileTap={{ scale: isFavorite ? 1 : 0.98 }}
                  onClick={handleFavorite}
                  disabled={isFavorite}
                  className={`w-full border font-body font-semibold transition-all duration-300 rounded-xl h-[44px] sm:h-[48px] flex items-center justify-center gap-2 text-xs sm:text-sm ${
                    isFavorite
                      ? "bg-red-50 border-red-200 text-red-600 shadow-inner cursor-not-allowed opacity-80"
                      : "bg-transparent border-border hover:bg-surface-container-low text-primary cursor-pointer"
                  }`}
                >
                  <Heart
                    size={16}
                    className={
                      isFavorite ? "fill-red-500 text-red-500" : "text-muted"
                    }
                  />
                  <span>
                    {isFavorite ? "Saved in Collection" : "Add to Favorite"}
                  </span>
                </motion.button>
              </div>

              <p className="text-center font-body text-[10px] sm:text-[11px] text-muted tracking-wide leading-normal">
                Secure premium verification via verified tenant portal profiles.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* 3. HEROUI MODAL SCHEDULER SYSTEM DIALOG */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Backdrop>
              <Modal.Container
                placement="center"
                className="p-4 sm:p-6 max-w-lg w-full mx-auto"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.4 }}
                >
                  <Modal.Dialog className="w-full rounded-2xl overflow-hidden border border-border/60 bg-background shadow-2xl">
                    <Modal.CloseTrigger className="cursor-pointer" />

                    <Modal.Header className="bg-surface-container-low p-5 sm:p-6 border-b border-border/20">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="p-2.5 bg-[#043927]/10 text-[#043927] rounded-xl shrink-0">
                          <CalendarDays className="size-5" />
                        </div>
                        <div>
                          <Modal.Heading className="text-lg sm:text-xl font-heading font-bold text-primary">
                            Complete Property Booking
                          </Modal.Heading>
                          <p className="text-[11px] sm:text-xs leading-relaxed text-muted font-body mt-0.5">
                            Review schedule windows and verification data
                            entries below.
                          </p>
                        </div>
                      </div>
                    </Modal.Header>

                    <Modal.Body className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                      <Surface variant="default">
                        <form
                          id="booking-modal-form"
                          className="flex flex-col gap-4 sm:gap-5"
                        >
                          {/* User Profile Info Context Field */}
                          <TextField
                            className="w-full"
                            name="tenantFullName"
                            isRequired
                            variant="secondary"
                          >
                            <Label className="font-body text-[11px] font-bold text-primary uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                              <User size={13} className="text-muted" /> User
                              Info / Full Name
                            </Label>
                            <Input
                              name="tenantFullName"
                              placeholder="Enter your legal full name"
                              className="rounded-xl font-body text-sm h-11"
                              value={tenantFullName}
                              onChange={(e) =>
                                setTenantFullName(e.target.value)
                              }
                            />
                          </TextField>

                          {/* Move-in Date Picker Node */}
                          <TextField
                            className="w-full"
                            name="moveInDate"
                            isRequired
                            variant="secondary"
                          >
                            <Label className="font-body text-[11px] font-bold text-primary uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                              <CalendarDays size={13} className="text-muted" />{" "}
                              Requested Move-in Date
                            </Label>
                            <Input
                              type="date"
                              className="rounded-xl font-body text-sm cursor-pointer h-11"
                              value={moveInDate}
                              onChange={(e) => setMoveInDate(e.target.value)}
                            />
                          </TextField>

                          {/* Verified Contact Number Entry Area */}
                          <TextField
                            className="w-full"
                            name="contactNumber"
                            isRequired
                            variant="secondary"
                          >
                            <Label className="font-body text-[11px] font-bold text-primary uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                              <Phone size={13} className="text-muted" /> Contact
                              Number
                            </Label>
                            <Input
                              type="tel"
                              placeholder="Enter Your Mobile Number"
                              className="rounded-xl font-body text-sm h-11"
                              value={contactNumber}
                              onChange={(e) => setContactNumber(e.target.value)}
                            />
                          </TextField>

                          {/* Additional Notes Layout Area */}
                          <TextField
                            className="w-full"
                            name="additionalNotes"
                            variant="secondary"
                          >
                            <Label className="font-body text-[11px] font-bold text-primary uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                              <FileText size={13} className="text-muted" />{" "}
                              Additional Notes
                            </Label>
                            <Input
                              placeholder="Any special requests or structural terms..."
                              className="rounded-xl font-body text-sm h-11"
                              value={additionalNotes}
                              onChange={(e) =>
                                setAdditionalNotes(e.target.value)
                              }
                            />
                          </TextField>
                        </form>
                      </Surface>
                    </Modal.Body>

                    <Modal.Footer className="bg-surface-container-low p-4 px-5 sm:px-6 border-t border-border/20 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
                      <Button
                        onClick={() => setIsModalOpen(false)}
                        variant="secondary"
                        className="w-full sm:w-auto rounded-xl font-body font-medium text-xs border border-border px-6 h-11 sm:h-10 cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <form
                        action={"/api/checkout_session"}
                        method="POST"
                        className="w-full sm:w-auto"
                      >
                        {/* property information */}
                        <input
                          type="hidden"
                          name="title"
                          value={property.title}
                          readOnly
                        />
                        <input
                          type="hidden"
                          name="location"
                          value={property.location}
                          readOnly
                        />
                        <input
                          type="hidden"
                          name="price"
                          value={property.rentPrice}
                          readOnly
                        />
                        <input
                          type="hidden"
                          name="image"
                          value={property.images}
                          readOnly
                        />
                        <input
                          type="hidden"
                          name="rentType"
                          value={property.rentType}
                          readOnly
                        />
                        <input
                          type="hidden"
                          name="propertyId"
                          value={property._id}
                          readOnly
                        />

                        {/* modal information */}
                        <input
                          type="hidden"
                          name="tenantFullName"
                          value={tenantFullName}
                          readOnly
                        />
                        <input
                          type="hidden"
                          name="moveInDate"
                          value={moveInDate}
                          readOnly
                        />
                        <input
                          type="hidden"
                          name="contactNumber"
                          value={contactNumber}
                          readOnly
                        />
                        <input
                          type="hidden"
                          name="additionalNotes"
                          value={additionalNotes}
                          readOnly
                        />
                        {/* Owner info */}
                        <input
                          type="hidden"
                          name="ownerId"
                          value={property.userId}
                          readOnly
                        />
                        <input
                          type="hidden"
                          name="ownerName"
                          value={property.userName}
                          readOnly
                        />
                        <input
                          type="hidden"
                          name="ownerEmail"
                          value={property.userEmail}
                          readOnly
                        />

                        <Button
                          type="submit"
                          className="w-full sm:w-auto bg-[#043927] text-white hover:bg-[#03291c] rounded-xl font-body font-semibold text-xs px-6 h-11 sm:h-10 cursor-pointer shadow-sm"
                        >
                          Confirm & Proceed to Payment
                        </Button>
                      </form>
                    </Modal.Footer>
                  </Modal.Dialog>
                </motion.div>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
