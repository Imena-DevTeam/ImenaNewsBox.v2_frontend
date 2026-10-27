"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { Container } from "@/components/layout/Container";
import { LoginMenu } from "@/components/layout/LoginMenu";
import { NavLink } from "@/components/layout/NavLink";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { DURATION, EASE_OUT_SOFT } from "@/components/motion/tokens";
import { PUBLIC_NAV } from "@/constants/nav";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);

  /* The bar stays with you down the page — Our Story is long enough that a
     header in the flow leaves you with no navigation for most of the scroll.
     It tightens and takes a shadow once you are past the top. */
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Container
      as="header"
      className={cn(
        "transition-base sticky top-0 z-50 pb-2",
        scrolled ? "pt-3" : "pt-6",
      )}
    >
      <ScrollProgress />

      {/* Drops in from above on first load, before the hero begins. Motion
          moves this wrapper; the bar inside keeps its own CSS transitions for
          the radius and shadow, so the two never fight over a property. */}
      <m.div
        data-motion
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DURATION.cinematic, ease: EASE_OUT_SOFT }}
      >
        <div
          className={cn(
            "bg-text transition-base mx-auto max-w-4xl px-6 py-3 md:px-8",
            /* A pill while it is one line; a rounded panel while the mobile
             menu is open, so its corners never cut into the logo. */
            open ? "rounded-lg" : "rounded-pill",
            scrolled && "shadow-main",
          )}
        >
          <div className="flex items-center justify-between gap-6">
            <Link
              href={ROUTES.HOME}
              className="text-ui text-surface tracking-widest"
            >
              IMENA FAMILY
            </Link>

            <nav
              aria-label="Main"
              className="hidden items-center gap-9 md:flex"
            >
              {PUBLIC_NAV.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </nav>

            <LoginMenu className="hidden md:block" />

            <button
              type="button"
              className="text-surface relative size-5 md:hidden"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {/* The two icons turn through each other rather than swapping. */}
              <AnimatePresence initial={false}>
                <m.span
                  key={open ? "close" : "open"}
                  className="absolute inset-0"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: DURATION.base, ease: EASE_OUT_SOFT }}
                >
                  {open ? (
                    <X className="size-5" />
                  ) : (
                    <Menu className="size-5" />
                  )}
                </m.span>
              </AnimatePresence>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {open ? (
              /* Unfolds to its own height. It clips only while moving, so the
               Login menu can hang outside it once it is open. */
              <m.nav
                key="mobile"
                aria-label="Mobile"
                className="md:hidden"
                initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  transitionEnd: { overflow: "visible" },
                }}
                exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                transition={{
                  duration: DURATION.base + 0.1,
                  ease: EASE_OUT_SOFT,
                }}
                /* Close once a link is followed; the bar stays mounted across
                 pages, so it would otherwise still be open on arrival. */
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest("a"))
                    setOpen(false);
                }}
              >
                <m.div
                  className="border-surface/15 flex flex-col items-start gap-4 border-t pt-4 pb-2"
                  initial="hidden"
                  animate="shown"
                  variants={{
                    shown: {
                      transition: {
                        staggerChildren: 0.06,
                        delayChildren: 0.08,
                      },
                    },
                  }}
                >
                  {PUBLIC_NAV.map((item) => (
                    <m.div
                      key={item.href}
                      variants={{
                        hidden: { opacity: 0, x: -16 },
                        shown: { opacity: 1, x: 0 },
                      }}
                    >
                      <NavLink {...item} />
                    </m.div>
                  ))}
                  <m.div
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      shown: { opacity: 1, x: 0 },
                    }}
                  >
                    <LoginMenu align="start" />
                  </m.div>
                </m.div>
              </m.nav>
            ) : null}
          </AnimatePresence>
        </div>
      </m.div>
    </Container>
  );
}
