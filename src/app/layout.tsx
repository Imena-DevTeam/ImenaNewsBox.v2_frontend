import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Jost } from "next/font/google";
import "@/styles/globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-instrument",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jost",
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
    <html
      lang="en"
      className={`${bricolage.variable} ${instrument.variable} ${jost.variable}`}
    >
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
