

import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/shared/Navbar";

export const metadata = {
  title: "SmartNest",
  description: "Streamline your property management with SmartNest. Discover smart rental listings, manage tenants, track payments, and optimize your real estate investments effortlessly.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ADD suppressHydrationWarning HERE TOO */}
      <body suppressHydrationWarning> 
        <Providers>
          <Navbar/>
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
