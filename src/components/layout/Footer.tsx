import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Mail } from "lucide-react";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { FOOTER_NAV } from "@/constants/nav";
import { CONTACT_EMAIL_HREF, INSTAGRAM_URL } from "@/constants/site";
import { CurrentYear } from "@/components/ui/CurrentYear";

export function Footer() {
  return (
    <footer className="mt-auto px-4 pb-4 md:px-6 md:pb-6">
      <div className="max-w-page text-surface relative isolate mx-auto overflow-hidden rounded-lg">
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
            <h2 className="text-surface text-h1-m sm:text-h1 lg:text-section max-w-lg leading-tight font-light tracking-tight">
              Ready to add your chapter?
            </h2>
            <div className="mt-6 sm:mt-7">
              <ButtonLink href={CONTACT_EMAIL_HREF} variant="light">
                Contact us
              </ButtonLink>
            </div>
          </div>

          {/* Middle Section: Newsletter and Navigation Columns */}
          <div className="mt-12 grid grid-cols-1 items-start gap-10 sm:mt-16 lg:grid-cols-[minmax(0,1.2fr)_auto]">
            <div>
              <p className="text-surface text-body-sm font-semibold tracking-wide">
                Newsletter
              </p>
              <p className="text-surface/70 text-caption sm:text-body-sm mt-2 max-w-xs leading-relaxed">
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
                  <p className="text-surface text-body-sm font-semibold tracking-wide">
                    {group.heading}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="text-surface/70 hover:text-surface text-caption sm:text-body-sm block transition-colors"
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
                        className="bg-surface/15 text-surface hover:bg-surface/25 flex size-7 items-center justify-center rounded-full transition-colors"
                      >
                        <Mail className="size-3.5" />
                      </a>
                      <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="IMENA family on Instagram"
                        className="bg-surface/15 text-surface hover:bg-surface/25 flex size-7 items-center justify-center rounded-full transition-colors"
                      >
                        <InstagramIcon className="size-3.5" />
                      </a>
                    </div>
                  )}
                </nav>
              ))}
            </div>
          </div>

          {/* Bottom Section: Centered Copyright */}
          <div className="mt-12 text-center sm:mt-14">
            <p className="text-surface/50 text-caption">
              &copy; <CurrentYear /> IMENA Family.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** lucide-react no longer ships brand marks, so the glyph lives here. */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
