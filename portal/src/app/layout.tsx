import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Decklar Customer Intelligence Portal",
  description: "AI-powered customer management for Decklar IoT supply chain visibility",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-900 text-white">
        {children}
      </body>
    </html>
  );
}
