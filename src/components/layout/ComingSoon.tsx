import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ROUTES } from "@/constants/routes";

/**
 * A placeholder for a route that is linked from the pages already built but
 * has not been implemented yet.
 *
 * It exists so that no call to action on the site leads to a 404: a page that
 * says plainly it is coming is better than a dead end, and it keeps the header
 * and footer around so people can carry on.
 */
export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="page-enter">
      <section className="section-y">
        <Container className="py-16 text-center md:py-24">
          <p className="text-caption text-heading tracking-widest uppercase">
            Coming soon
          </p>

          <h1 className="text-h1-m md:text-h1 mt-5">{title}</h1>

          <p className="text-body-lg text-muted mx-auto mt-6 max-w-xl">
            {description}
          </p>

          <Link
            href={ROUTES.HOME}
            className="text-ui text-primary transition-base mt-10 inline-flex items-center gap-3 hover:gap-4"
          >
            <ArrowLeft className="size-5" />
            Back to the home page
          </Link>
        </Container>
      </section>
    </div>
  );
}
