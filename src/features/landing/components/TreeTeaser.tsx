import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ROUTES } from "@/constants/routes";
import { TreePreviewCard } from "./TreePreviewCard";

/** The family tree, given a section of its own rather than a corner of the hero. */
export function TreeTeaser() {
  return (
    <section className="section-y">
      <Container className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <SectionTitle title="The Family Tree" />
          <p className="text-body-lg text-muted mt-6 max-w-md">
            Every generation, from the founders to the newest members, and who
            handed over to whom.
          </p>
          <div className="mt-8">
            <ButtonLink href={ROUTES.FAMILY_TREE} variant="outline">
              See the whole tree
            </ButtonLink>
          </div>
        </div>
        <TreePreviewCard className="mx-auto w-full max-w-sm" />
      </Container>
    </section>
  );
}
