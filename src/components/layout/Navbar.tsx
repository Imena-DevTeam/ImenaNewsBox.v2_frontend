"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { NavLink } from "@/components/layout/NavLink";
import { ButtonLink } from "@/components/ui/Button";
import { PUBLIC_NAV } from "@/constants/nav";
import { ROUTES } from "@/constants/routes";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <Container as="header" className="pt-6">
      <div className="rounded-pill bg-text px-6 py-3 md:px-8">
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

          <ButtonLink
            href={ROUTES.LOGIN}
            variant="light"
            size="sm"
            className="hidden md:inline-flex"
          >
            Login
          </ButtonLink>

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
            <ButtonLink href={ROUTES.LOGIN} variant="light" size="sm">
              Login
            </ButtonLink>
          </nav>
        ) : null}
      </div>
    </Container>
  );
}
