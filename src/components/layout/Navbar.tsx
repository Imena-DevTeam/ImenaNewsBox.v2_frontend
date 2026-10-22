"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { LoginMenu } from "@/components/layout/LoginMenu";
import { NavLink } from "@/components/layout/NavLink";
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
      <div
        className={cn(
          "rounded-pill bg-text transition-base mx-auto max-w-4xl px-6 py-3 md:px-8",
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

          <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
            {PUBLIC_NAV.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>

          <LoginMenu className="hidden md:block" />

          <button
            type="button"
            className="text-surface md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open ? (
          <nav
            aria-label="Mobile"
            className="border-surface/15 flex flex-col items-start gap-4 border-t pt-4 pb-2 md:hidden"
          >
            {PUBLIC_NAV.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
            <LoginMenu align="start" />
          </nav>
        ) : null}
      </div>
    </Container>
  );
}
