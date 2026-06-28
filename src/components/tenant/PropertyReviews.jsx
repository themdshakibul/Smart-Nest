import { postReviews } from "@/lib/actions/review";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function PropertyReviews({
  propertyId,
  existingReviews = [],
  currentUser,
}) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState(existingReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      router.push("/signin");
      return;
    }
    if (currentUser.role !== "tenant") {
      router.push("/unauthorized");
      return;
    }
    if (!currentUser) {
      toast.error("Please log in to leave a review.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please add a detailed comment.");
      return;
    }

    setIsSubmitting(true);
    const UpdatedReview = {
      propertyId,
      tenantId: currentUser.id,
      tenantName: currentUser.name,
      tenantEmail: currentUser.email,
      tenantImage: currentUser.image,
      rating,
      comment,
    };
    // console.log(review);
    try {
      const data = await postReviews(UpdatedReview);

      if (!data.insertedId) throw new Error(data.error || "Submission failed");

      toast.success("Thank you! Your feedback has been published.");
      const newReview = {
        ...UpdatedReview,
        _id: data.insertedId,
        createdAt: new Date(),
      };

      setReviews((prev) => [newReview, ...prev]);

      setComment("");
      setRating(0);
      setShowForm(false);
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 border-t border-border/30 pt-12 mt-12">
      {/* SECTION HEADER BLOCK */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/10">
        <div className="space-y-1">
          <h2 className="font-heading text-2xl sm:text-3xl text-primary font-medium tracking-wide flex items-center gap-2">
            <MessageSquare className="text-secondary" size={24} /> Guest
            Experiences
          </h2>
          <p className="font-body text-xs sm:text-sm text-muted">
            Read experiential metrics, stay ratings, and historical timelines.
          </p>
        </div>
      </div>

      {/* DROPDOWN INTERACTIVE INPUT DRAWER PANEL */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0 }}
          className="overflow-hidden"
        >
          <div className="bg-surface-container-low border border-border/30 rounded-2xl p-5 sm:p-6 mb-8 space-y-4">
            <h3 className="font-heading text-lg font-bold text-primary">
              Share Your Historical Term Experience
            </h3>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Rating Matrix Selection */}
              <div className="space-y-1.5">
                <label className="font-body text-[10px] font-bold text-primary uppercase tracking-wider block">
                  Overall Stay Score
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="cursor-pointer p-0.5 transition-transform active:scale-95 text-xl"
                    >
                      <Star
                        size={20}
                        className={`${
                          star <= (hoverRating || rating)
                            ? "fill-secondary text-secondary"
                            : "text-outline-variant/60"
                        } transition-colors duration-150`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Area Input */}
              <div className="space-y-1.5">
                <label className="font-body text-[10px] font-bold text-primary uppercase tracking-wider block">
                  Your Narrative Summary
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe specific details regarding design features, neighborhood logistics, or stay terms..."
                  className="w-full rounded-xl border border-border/40 bg-surface-container-lowest font-body text-sm p-3 focus:outline-hidden focus:ring-1 focus:ring-[#043927] focus:border-[#043927] transition-all resize-none placeholder:text-muted/50 text-primary"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#043927] hover:bg-[#03291c] disabled:bg-muted text-white font-body font-semibold text-xs tracking-wide rounded-xl px-6 h-10 shadow-xs transition-all cursor-pointer"
                >
                  {isSubmitting ? "Publishing..." : "Submit Experience Record"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* REVIEWS HISTORICAL LIST TIMELINE */}
      <div className="w-full max-w-3xl">
        <div className="space-y-6">
          {reviews.map((rev, index) => (
            <div
              key={rev._id || rev.id || index}
              className="pb-6 border-b border-border/15 last:border-0 last:pb-0 space-y-2.5"
            >
              {/* Meta Meta Information Data Strip */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-surface-container rounded-full flex items-center justify-center text-primary font-heading font-bold text-xs uppercase shadow-inner">
                    <Image height={100} width={100} src={rev.tenantImage} alt={rev.tenantName}/>
                  </div>

                  <div>
                    <h4 className="font-body font-bold text-sm text-primary leading-tight">
                      {rev.tenantName}
                    </h4>
                    <p className="font-body text-[10px] text-muted tracking-wide">
                      {rev.tenantEmail}
                    </p>
                  </div>
                </div>

                <span className="font-body text-[11px] text-muted">
                  {new Date(rev.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Micro Star Metrics Row */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    className={`${
                      star <= rev.rating
                        ? "fill-secondary text-secondary"
                        : "text-outline-variant/30"
                    }`}
                  />
                ))}
              </div>

              {/* Description Clean Wrap Node */}
              <p className="font-body text-xs sm:text-sm text-muted leading-relaxed whitespace-pre-wrap pl-0.5">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
