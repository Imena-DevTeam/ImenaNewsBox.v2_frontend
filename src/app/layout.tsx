import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "IMENA Family Times",
    template: "%s · IMENA Family Times",
  },
  description:
    "A private family platform preserving the history, stories and relationships of the IMENA family.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
