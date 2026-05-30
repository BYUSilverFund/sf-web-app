// Import necessary types and components from Next.js and Google Fonts
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
// @ts-expect-error: CSS import type declarations are handled by Next.js
import "./globals.css";
import Footer from "../components/Footer";
import Navbar from "@/components/Navbar";
import AmplifyInit from "@/components/AmplifyInit";

// Configure the Inter font with specific settings
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Configure the Roboto Mono font with specific settings
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

// Define metadata for the application
export const metadata: Metadata = {
  title: "BYU Silver Fund",
  description: "BYU's Premier Student-Run Investment Fund",
  keywords: [
    "BYU",
    "Silver Fund",
    "Student Investment Fund",
    "Finance",
    "Investing",
    "Student-Run Fund",
    "Brigham Young University",
  ],
  authors: [{ name: "BYU Silver Fund", url: "https://silverfund.byu.edu" }],
  creator: "BYU Silver Fund",
  openGraph: {
    title: "BYU Silver Fund",
    description: "BYU's Premier Student-Run Investment Fund",
    url: "https://silverfund.byu.edu",
    siteName: "BYU Silver Fund",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BYU Silver Fund",
    description: "BYU's Premier Student-Run Investment Fund",
  },
  icons: {
    icon: "/sf-logo-white.png",
  },
};

// Define the root layout component for the application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-gray-50`}
      >
        <div className="flex min-h-screen flex-col">
          <AmplifyInit />
          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
