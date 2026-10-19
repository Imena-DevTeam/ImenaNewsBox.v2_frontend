import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { FOOTER_NAV } from "@/constants/nav";
import { ROUTES } from "@/constants/routes";

export function Footer() {
  return (
    /* The footer is a card inset in the page, not a full-bleed band: it keeps
       the page margin on three sides and is rounded on all four corners. */
    <footer className="mt-auto px-4 pb-4 md:px-6 md:pb-6">
      <div className="max-w-page text-surface relative isolate mx-auto overflow-hidden rounded-lg">
        {/* The wash from the Figma footer export. */}
        <Image
          src="/images/footer-bg.png"
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="-z-10 object-cover"
        />

        <div className="px-6 py-9 md:px-12 md:py-11">
          <h2 className="text-display-light-m md:text-display-light max-w-sm">
            Ready to start syncing your data?
          </h2>

          <Link
            href={ROUTES.OUR_STORY}
            className="bg-surface text-text h-control-md text-body-sm mt-7 inline-flex items-center justify-center rounded-sm px-7"
          >
            Contact us
          </Link>

          <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <p className="text-ui">Newsletter</p>
              <p className="text-surface/80 text-body-sm mt-4 max-w-72">
                We&rsquo;d love to share our love for product with you in our
                monthly newsletter.
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
                  className="border-surface/25 bg-surface/10 text-surface placeholder:text-surface/70 focus:border-surface h-control-md text-body-sm w-56 rounded-sm border px-4 outline-none"
                />
                <button
                  type="submit"
                  className="bg-surface/20 hover:bg-surface/30 h-control-md text-body-sm rounded-sm px-6 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* The three columns sit together on the right, as in the design. */}
            <div className="flex flex-wrap gap-10 sm:justify-end sm:gap-0 md:[&>*:not(:last-child)]:w-44">
              {FOOTER_NAV.map((group) => (
                <nav key={group.heading} aria-label={group.heading}>
                  <p className="text-ui">{group.heading}</p>
                  <ul className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="text-surface/85 hover:text-surface text-body-sm"
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

          <div className="mt-6 flex justify-end gap-3">
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

          <p className="text-surface/80 text-body-sm mt-8 text-center">
            &copy; {new Date().getFullYear()} IMENA Family.
          </p>
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
