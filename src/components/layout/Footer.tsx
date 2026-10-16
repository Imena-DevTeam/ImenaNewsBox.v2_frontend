import Link from "next/link";
import { Mail } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { FOOTER_NAV } from "@/constants/nav";
import { ROUTES } from "@/constants/routes";

export function Footer() {
  return (
    <footer className="bg-primary text-surface relative isolate mt-auto overflow-hidden">
      {/* The soft mesh wash from the design. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_18%_10%,color-mix(in_oklab,var(--color-surface)_55%,transparent),transparent_60%),radial-gradient(55%_60%_at_75%_85%,color-mix(in_oklab,var(--color-text)_70%,transparent),transparent_65%)]"
      />

      <div className="max-w-page mx-auto w-full px-4 py-16 md:px-8 md:py-20">
        <h2 className="text-h2-m md:text-h2 max-w-md">
          Ready to start preserving your family story?
        </h2>

        <ButtonLink href={ROUTES.SIGNUP} variant="light" className="mt-8">
          Contact us
        </ButtonLink>

        <div className="mt-16 grid gap-12 md:grid-cols-[minmax(0,22rem)_1fr]">
          <div>
            <p className="text-ui">Newsletter</p>
            <p className="text-body-sm text-surface/80 mt-3">
              We would love to share family news with you in our monthly
              newsletter.
            </p>

            <form className="mt-5 flex flex-wrap gap-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                className="h-control-md border-surface/30 bg-surface/10 text-body text-surface placeholder:text-surface/70 focus:border-surface min-w-0 flex-1 rounded-sm border px-4 outline-none"
              />
              <button
                type="submit"
                className="h-control-md bg-surface/20 text-ui text-surface hover:bg-surface/30 rounded-sm px-6 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {FOOTER_NAV.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <p className="text-ui">{group.heading}</p>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-body-sm text-surface/80 hover:text-surface"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex items-center justify-between gap-4">
          <p className="text-caption text-surface/70">
            © {new Date().getFullYear()} IMENA Family
          </p>

          <div className="flex gap-3">
            <a
              href="mailto:hello@imenafamily.rw"
              aria-label="Email the IMENA family"
              className="bg-surface/15 hover:bg-surface/25 flex size-9 items-center justify-center rounded-sm"
            >
              <Mail className="size-4" />
            </a>
            <a
              href="https://www.linkedin.com"
              aria-label="IMENA family on LinkedIn"
              className="bg-surface/15 hover:bg-surface/25 flex size-9 items-center justify-center rounded-sm"
            >
              <LinkedInIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** lucide-react no longer ships brand marks, so the glyph lives here. */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.77-2.07c4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21h-4V9Z" />
    </svg>
  );
}
