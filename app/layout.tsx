import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

// Real typefaces, self-hosted by next/font — no layout shift, no external request.
// The site was running on Arial, which was quietly undoing every other design
// decision on the page.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Tighter grotesk for display sizes. Headings are the main visual device now
// that gradients aren't, so they get their own face.
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});
import BoTechChat from "./components/BoTechChat";
import Footer from "./components/Footer";
import Nav from "./components/Nav";

export const metadata: Metadata = {
  title: "Rich Off Tech — Cleared Tech. No Shortcuts.",
  description: "The community Bo built for cleared and aspiring tech professionals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body className="bg-rot-bg text-rot-fg min-h-screen antialiased">
        <Nav />
        {children}
        <Footer />
        <BoTechChat />
      </body>
    </html>
  );
}
