import type { Metadata } from "next";
import "./globals.css";
import BoTechChat from "./components/BoTechChat";
import Footer from "./components/Footer";
import Nav from "./components/Nav";

export const metadata: Metadata = {
  title: "Rich Off Tech — Cleared Tech. No Shortcuts.",
  description: "The community Bo built for cleared and aspiring tech professionals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen antialiased">
        <Nav />
        {children}
        <Footer />
        <BoTechChat />
      </body>
    </html>
  );
}
