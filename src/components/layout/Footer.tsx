import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { FOOTER_NAV } from "@/constants/nav";
import { CONTACT_EMAIL_HREF } from "@/constants/site";

export function Footer() {
  return (
    <footer className="mt-auto px-4 pb-4 md:px-6 md:pb-6">
      <div className="max-w-page text-surface relative isolate mx-auto overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]">
        {/* The wash from the Figma footer export */}
        <Image
          src="/images/footer-bg.webp"
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="-z-10 object-cover"
        />

        <div className="px-7 py-10 sm:px-12 sm:py-12 lg:px-16 lg:py-14">
          {/* Top Section: Heading and Contact Button */}
          <div>
            <h2 className="max-w-lg text-3xl leading-tight font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to add your chapter?
            </h2>
            <div className="mt-6 sm:mt-7">
              <a
                href={CONTACT_EMAIL_HREF}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-stone-900 shadow-sm transition-colors hover:bg-white/90"
              >
                Contact us
              </a>
            </div>
          </div>

          {/* Middle Section: Newsletter and Navigation Columns */}
          <div className="mt-12 grid grid-cols-1 items-start gap-10 sm:mt-16 lg:grid-cols-[minmax(0,1.2fr)_auto]">
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">
                Newsletter
              </p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/70 sm:text-sm">
                A short letter each month: birthdays, handovers, and new
                photographs in the family archive.
              </p>
              <NewsletterForm />
            </div>

            {/* Navigation Columns */}
            <div className="flex flex-wrap gap-10 sm:justify-end sm:gap-14 lg:gap-16">
              {FOOTER_NAV.map((group, groupIdx) => (
                <nav
                  key={group.heading}
                  aria-label={group.heading}
                  className="min-w-24"
                >
                  <p className="text-sm font-semibold tracking-wide text-white">
                    {group.heading}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="block text-xs text-white/70 transition-colors hover:text-white sm:text-sm"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Social icons positioned under the 3rd column, matching Figma design */}
                  {groupIdx === FOOTER_NAV.length - 1 && (
                    <div className="mt-5 flex items-center gap-2">
                      <a
                        href={CONTACT_EMAIL_HREF}
                        aria-label="Email the IMENA family"
                        className="flex size-7 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                      >
                        <Mail className="size-3.5" />
                      </a>
                      <a
                        href="https://www.linkedin.com"
                        aria-label="IMENA family on LinkedIn"
                        className="flex size-7 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                      >
                        <LinkedInIcon className="size-3.5" />
                      </a>
                    </div>
                  )}
                </nav>
              ))}
            </div>
          </div>

          {/* Bottom Section: Centered Copyright */}
          <div className="mt-12 text-center sm:mt-14">
            <p className="text-xs text-white/50">
              &copy; {new Date().getFullYear()} IMENA Family.
            </p>
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
