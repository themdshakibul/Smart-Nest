"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

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
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }
      toast.success("Successfully Logged in");
      router.push(redirectTo);
    } catch (err) {
      setError(err?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      await authClient.signIn.social({
        provider: "google",
      });
      toast.success("Successfully Logged in");
      router.push(redirectTo);
    } catch (err) {
      setError(err?.message || "Google authentication failed.");
    }
  };

  return (
    <div className="font-body min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background transition-colors duration-200">
      <div className="w-full max-w-lg bg-surface border border-border/20 rounded-3xl p-8 shadow-xl">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <h1 className="font-heading font-bold text-4xl text-foreground tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-muted text-sm">
            Sign in to your SmartNest account panel seamlessly.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-medium">
            {error}
          </div>
        )}

        {/* Google Quick Signin Action */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 font-semibold rounded-xl bg-secondary/60 hover:bg-secondary border border-border/30 transition-all duration-200 text-sm active:scale-[0.99] shadow-sm"
          >
            <FcGoogle size={18} />
            <span>Sign in with Google</span>
          </button>

          {/* Minimalist Visual Divider Layout */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-border/20"></div>
            <span className="flex-shrink mx-4 text-xs text-muted uppercase tracking-wider font-bold">
              Or login via credentials
            </span>
            <div className="flex-grow border-t border-border/20"></div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Input Fields Group */}
          <div className="space-y-4">
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

          {/* Submit/Login Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-midnight-emerald text-white dark:bg-secondary dark:text-background py-3.5 px-6 rounded-full font-label-md text-label-md font-bold hover:opacity-95 transition-all scale-100 active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-md flex items-center justify-center gap-2"
          >
            {loading ? "Signing In..." : "Log In"}
            {!loading && <ArrowRight size={16} />}
          </button>

          {/* Alternative Auth Navigation */}
          <p className="text-center text-sm text-muted mt-4">
            Don't have an account yet?{" "}
            <Link
              href={`/signup?redirect=${redirectTo}`}
              className="text-secondary font-semibold hover:underline"
            >
              Create one here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
