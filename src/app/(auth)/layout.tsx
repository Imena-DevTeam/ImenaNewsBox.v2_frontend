import type { ReactNode } from "react";
import { Bricolage_Grotesque, Instrument_Sans, Jost } from "next/font/google";

/* The auth frames use their own faces. Loading them here rather than in the
   root layout keeps them off every other page. */
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

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${bricolage.variable} ${instrument.variable} ${jost.variable} font-auth-body bg-surface`}
    >
      {children}
    </div>
  );
}
