import { payment } from "@/lib/actions/payment";
import { stripe } from "@/lib/stripe";
import {
  ArrowRight,
  Building,
  CheckCircle2,
  Mail,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const { status, metadata, customer_details } = session;
  const customerEmail = customer_details?.email;
  const paymentIntent =
    typeof session.payment_intent === "string"
      ? await stripe.paymentIntents.retrieve(session.payment_intent)
      : session.payment_intent;

  const transactionId = paymentIntent.id;
  const chargeId = paymentIntent.latest_charge;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    // Process the internal DB action
    await payment({
      ...metadata,
      sessionId: session_id,
      transactionId,
      chargeId,
    });

    // Formatting the price from metadata safely
    const formattedPrice = metadata?.price
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Number(metadata.price))
      : "$0.00";

    return (
      <section className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-background font-body">
        <div className="w-full max-w-2xl bg-card rounded-2xl shadow-xl border border-border/30 overflow-hidden backdrop-blur-md transition-all duration-300">
          {/* Top Decorative Accent Banner */}
          <div className="h-2 bg-gradient-to-r from-primary via-secondary to-champagne" />

          <div className="p-8 md:p-12 flex flex-col items-center text-center">
            {/* Success Icon Animation Wrapper */}
            <div className="mb-6 p-4 rounded-full bg-secondary/10 text-secondary animate-bounce-short">
              <CheckCircle2 className="w-16 h-16 stroke-[1.5]" />
            </div>

            {/* Typography with your EB Garamond heading */}
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground tracking-wide mb-3">
              Booking Confirmed!
            </h1>

            <p className="text-muted text-base max-w-md mb-8 leading-relaxed">
              Your reservation at{" "}
              <span className="font-semibold text-foreground">
                {metadata?.title || "your selected property"}
              </span>{" "}
              is officially secured.
            </p>

            {/* Booking Details Card */}
            <div className="w-full bg-background/60 rounded-xl border border-border/20 p-6 text-left space-y-4 mb-8">
              <div className="flex items-center gap-3 border-b border-border/10 pb-3">
                <Receipt className="w-5 h-5 text-secondary" />
                <h3 className="font-heading text-lg font-medium text-foreground">
                  Reservation Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted block text-xs uppercase tracking-wider">
                    Property Name
                  </span>
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Building className="w-4 h-4 text-primary/70" />
                    <span className="truncate">{metadata?.title}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted block text-xs uppercase tracking-wider">
                    Amount Paid
                  </span>
                  <div className="text-secondary font-semibold text-base">
                    {formattedPrice}
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <span className="text-muted block text-xs uppercase tracking-wider">
                    Confirmation Sent To
                  </span>
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Mail className="w-4 h-4 text-primary/70" />
                    <span>{customerEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification / Alert Area */}
            <div className="flex items-start gap-3 bg-primary/5 text-primary text-sm p-4 rounded-xl border border-primary/10 text-left w-full mb-8">
              <div className="p-1 bg-primary text-on-primary rounded-full mt-0.5">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <p className="text-muted leading-relaxed text-xs">
                A formal digital receipt and check-in instructions have been
                forwarded to{" "}
                <span className="text-foreground font-medium">
                  {customerEmail}
                </span>
                . Need immediate assistance? Reach us at{" "}
                <a
                  href="mailto:support@smartnest.com"
                  className="text-secondary underline hover:text-champagne transition-colors"
                >
                  support@smartnest.com
                </a>
                .
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Link
                href="/dashboard/tenant/my-bookings"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-on-primary hover:bg-primary-fixed transition-all shadow-md font-medium text-sm group"
              >
                View My Bookings
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-border text-foreground hover:bg-surface-container transition-all font-medium text-sm"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
