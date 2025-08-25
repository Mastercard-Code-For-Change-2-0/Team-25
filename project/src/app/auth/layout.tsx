import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css"; // Tailwind CSS styles

// Google Fonts Setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO metadata
export const metadata: Metadata = {
  title: "DonorConnect App",
  description: "Connecting donors with students in need of educational funding.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* Navbar */}
        <Navbar />

        {/* Main Content with spacing for fixed Navbar */}
        <main className="flex-grow pt-20">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
