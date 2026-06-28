"use client";

import { authClient } from "@/lib/auth-client";
import {
  Building2,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme, resolvedTheme } = useTheme();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const pathName = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathName.includes("dashboard")) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Successfully Logged out");
  };

  // Compute uniform dynamic dashboard path matching user roles
  const dashboardPath = `/dashboard/${user?.role || "user"}`;

  return (
    <div className="font-body">
      <nav className="sticky top-0 left-0 right-0 z-100 w-full border-b border-border/20 bg-background/70 backdrop-blur-lg text-foreground transition-colors duration-200">
        <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-1 text-foreground hover:bg-card rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/">
              <div className="flex items-center gap-3">
                <Image
                  src="https://res.cloudinary.com/drvj2pqs7/image/upload/v1782473343/SmartNest_Final_Logo_xc47mk.png"
                  alt="SmartNest Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
                <p className="font-heading font-bold text-2xl tracking-tight">
                  Smart<span className="text-secondary">Nest</span>
                </p>
              </div>
            </Link>

          </div>

          {/* Center: Desktop Navigation Links (Increased text size for professional layout) */}
          <ul className="hidden items-center gap-8 md:flex">
            <li>
              <Link
                href="/"
                className="text-[15px] font-medium hover:text-secondary transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/properties"
                className="text-[15px] font-medium hover:text-secondary transition-colors"
              >
                All Properties
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  href={dashboardPath}
                  className="text-[15px] font-medium text-primary dark:text-secondary hover:text-secondary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Right: Theme Toggle & Authentication / Profile Menu Container */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-card transition-colors focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {mounted && resolvedTheme === "dark" ? (
                <Sun size={20} className="text-champagne" />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* Combined Auth Layout Wrapper */}
            <div className="flex items-center gap-4">
              {!user ? (
                <>
                  <Link
                    href="/signin"
                    className="hidden md:block text-[15px] font-medium hover:text-secondary transition-colors"
                  >
                    Login
                  </Link>
                  <Link href="/signup" className="hidden md:block">
                    <button className="bg-midnight-emerald text-white dark:bg-secondary dark:text-background px-6 py-2.5 rounded-full font-label-md text-label-md hover:opacity-90 transition-all scale-100 active:scale-95 shadow-sm cursor-pointer">
                      Get Started
                    </button>
                  </Link>
                </>
              ) : (
                // Safe relative positioning context container for layout anchor alignment
                <div className="relative flex items-center gap-3 h-16">
                  {/* Avatar Trigger Button */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center rounded-full border border-border/40 focus:outline-none transition-transform active:scale-95 cursor-pointer"
                    aria-label="User menu"
                  >
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User profile picture"}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {/* Desktop Only Quick-Logout Button */}
                  <button
                    onClick={handleSignOut}
                    title="Log Out"
                    className="hidden md:flex p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut size={18} />
                  </button>

                  {/* Professional Realigned Dropdown Menu Panel */}
                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsDropdownOpen(false)}
                      />

                      <div className="absolute right-0 top-[85%] w-56 origin-top-right rounded-xl border border-border/30 bg-surface p-2 shadow-2xl z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3 py-2 border-b border-border/20 mb-1">
                          <p className="text-xs text-muted font-medium">
                            Signed in as
                          </p>
                          <p className="text-sm font-semibold truncate">
                            {user?.email}
                          </p>
                          <p className="text-sm font-semibold truncate mt-2">
                            {user?.role}
                          </p>
                        </div>

                        <Link
                          href={dashboardPath}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-card transition-colors w-full text-left"
                        >
                          <LayoutDashboard size={16} />
                          <span>Dashboard</span>
                        </Link>

                        <button
                          onClick={() => {
                            handleSignOut();
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-danger hover:bg-danger/10 transition-colors w-full text-left font-medium mt-1 cursor-pointer"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Dropdown Overlay */}
        {isMenuOpen && (
          <div className="border-t border-border/10 bg-background md:hidden animate-in fade-in duration-200">
            <ul className="flex flex-col gap-1 p-4">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium hover:bg-card transition-colors text-[15px]"
                >
                  <Home size={18} /> Home
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium hover:bg-card transition-colors text-[15px]"
                >
                  <Building2 size={18} /> All Properties
                </Link>
              </li>
              {user && (
                <li>
                  <Link
                    href={dashboardPath}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium hover:bg-card transition-colors text-[15px] text-primary dark:text-secondary"
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                </li>
              )}

              <li className="my-2 border-t border-border/10" />

              {!user ? (
                <div className="flex flex-col gap-2 pt-2">
                  <li>
                    <Link
                      href="/signin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center py-2.5 font-medium rounded-lg hover:bg-card transition-colors text-[15px]"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full bg-midnight-emerald text-white dark:bg-secondary dark:text-background px-6 py-2.5 rounded-full font-label-md text-label-md hover:opacity-90 transition-all scale-100 active:scale-95 shadow-sm">
                        Get Started
                      </button>
                    </Link>
                  </li>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <li>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-danger hover:bg-danger/10 transition-colors text-left text-[15px]"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </li>
                </div>
              )}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
