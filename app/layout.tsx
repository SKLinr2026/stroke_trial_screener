import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stroke Trial Screener",
  description:
    "Bedside eligibility screener for active acute ischemic stroke trials (WE-TRUST, STEP Domain A). No PHI stored.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
