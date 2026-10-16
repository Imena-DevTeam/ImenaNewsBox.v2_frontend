import type { Metadata } from "next";
import { Nunito_Sans, Roboto } from "next/font/google";
import "@/styles/globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito-sans",
  display: "swap",
});

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
    <html lang="en" className={`${roboto.variable} ${nunitoSans.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
