"use client";

import { authClient } from "@/lib/auth-client";
import { ArrowRight, Image as ImageIcon, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [role, setRole] = useState("tenant");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        image: data.image || null,
        role: "tenant",
      });
      toast.success("Successfully Signed up");
      router.push(redirectTo);
    } catch (err) {
      setError(err?.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setRole("tenant");
      await authClient.signIn.social({
        provider: "google",
      });
      toast.success("Successfully Signed up");
      router.push(redirectTo);
    } catch (err) {
      setError(err?.message || "Google registration failed.");
    }
  };

  return (
    <div className="font-body min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background transition-colors duration-200">
      <div className="w-full max-w-lg bg-surface border border-border/20 rounded-3xl p-8 shadow-xl">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <h1 className="font-heading font-bold text-4xl text-foreground tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-muted text-sm">
            Join SmartNest to manage, search, and book properties seamlessly.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-medium">
            {error}
          </div>
        )}

        {/* Google Quick Signup Action */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 font-semibold rounded-xl bg-secondary/60 hover:bg-secondary border border-border/30 transition-all duration-200 text-sm active:scale-[0.99] shadow-sm"
          >
            <FcGoogle
              size={18}
              className="text-secondary dark:text-champagne"
            />
            <span>Sign up with Google</span>
          </button>

          {/* Minimalist Visual Divider Layout */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-border/20"></div>
            <span className="flex-shrink mx-4 text-xs text-muted uppercase tracking-wider font-bold">
              Or register via credentials
            </span>
            <div className="flex-grow border-t border-border/20"></div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Input Fields Group */}
          <div className="space-y-4">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                  <User size={18} />
                </span>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Enter Your Name"
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border/30 rounded-xl text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>

            {/* Image Link Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                Avatar Image URL
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                  <ImageIcon size={18} />
                </span>
                <input
                  name="image"
                  type="url"
                  placeholder="Add Your Image URL"
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border/30 rounded-xl text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                  <Mail size={18} />
                </span>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Enter Your Email"
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border/30 rounded-xl text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
                  <Lock size={18} />
                </span>
                <input
                  required
                  name="password"
                  type="password"
                  minLength={8}
                  placeholder="Enter Your Password"
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border/30 rounded-xl text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Submit/Register Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-midnight-emerald text-white dark:bg-secondary dark:text-background py-3.5 px-6 rounded-full font-label-md text-label-md font-bold hover:opacity-95 transition-all scale-100 active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-md flex items-center justify-center gap-2"
          >
            {loading ? "Creating Account..." : "Get Started"}
            {!loading && <ArrowRight size={16} />}
          </button>

          {/* Alternative Auth Navigation */}
          <p className="text-center text-sm text-muted mt-4">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-secondary font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
