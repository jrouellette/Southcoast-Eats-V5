import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Southcoast Eats | Find your next favorite",
  description:
    "Discover local restaurants across the South Coast. Explore places, browse photos, and save spots for later.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
