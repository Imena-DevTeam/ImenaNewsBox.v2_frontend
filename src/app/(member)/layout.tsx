import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { Playfair_Display, Poppins } from "next/font/google";
import { MemberSidebar } from "@/components/layout/MemberSidebar";
import { SignedInProvider } from "@/components/layout/SignedIn";
import { MemberFooter } from "@/components/layout/MemberFooter";
import { getSessionRole, SESSION_COOKIE } from "@/lib/session";

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

export default async function MemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  /* The rail needs to know whether to offer the admin door, and the header
     needs to know whose name to show. Read here, in the one server component
     every member page already passes through, so no page has to think about
     it. */
  const store = await cookies();
  const role = await getSessionRole(store.get(SESSION_COOKIE)?.value);

  return (
    <div
      className={`${poppins.variable} ${playfair.variable} font-member-sans bg-surface text-text flex min-h-dvh flex-col`}
    >
      {/* The dock is fixed, so the page keeps its own column: room on the
          left for the desktop dock, room at the foot for the mobile one. */}
      <a
        href="#member-content"
        className="bg-brand text-surface rounded-field sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-5 focus:py-3"
      >
        Skip to the page content
      </a>

      <SignedInProvider role={role}>
        <MemberSidebar role={role} />

        <main
          id="member-content"
          className="max-w-page mx-auto w-full min-w-0 flex-1 px-4 pt-6 md:pt-9 md:pr-8 md:pl-30"
        >
          {children}
        </main>

        <MemberFooter />
      </SignedInProvider>
    </div>
  );
}
