import type { ReactNode } from "react";
import { Playfair_Display, Poppins } from "next/font/google";
import { MemberSidebar } from "@/components/layout/MemberSidebar";
import { MemberFooter } from "@/components/layout/MemberFooter";

/* The member frames are set in their own faces. Loading them here rather
   than in the root layout keeps them off every other page, the same way
   the auth layout keeps Bricolage, Instrument and Jost off the public
   site. The tokens that read these variables live in globals.css. */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export default function MemberLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${poppins.variable} ${playfair.variable} font-member-sans bg-surface text-text flex min-h-dvh flex-col`}
    >
      {/* The rail and the page sit in a page-width row; the footer bar runs
          the full width beneath them, as the design draws it. */}
      <div className="max-w-page mx-auto flex w-full min-w-0 flex-1 flex-col gap-6 px-4 pt-6 md:flex-row md:gap-14 md:px-6 md:pt-9">
        {/* The first thing a keyboard or screen-reader user reaches on these
            frames, so nobody walks the seven rail links before the page
            they asked for. Hidden until it takes focus. */}
        <a
          href="#member-content"
          className="bg-brand text-surface rounded-field sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-5 focus:py-3"
        >
          Skip to the page content
        </a>

        <MemberSidebar />

        <main id="member-content" className="min-w-0 flex-1">
          {children}
        </main>
      </div>

      <MemberFooter />
    </div>
  );
}
