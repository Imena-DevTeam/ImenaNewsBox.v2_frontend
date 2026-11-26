import { Quote } from "@/components/ui/Quote";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cake, GraduationCap, Network, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { ROUTES } from "@/constants/routes";
import { getSubfamilyBySlug } from "@/features/families/data";
import { promotionLabel } from "@/features/members/wire";
import { loadPerson } from "@/app/(member)/_lib/people";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const person = await loadPerson((await params).id);
  return { title: person?.fullName ?? "Family member" };
}

/** Day and month only: the backend never sends another member the year. */
function birthday(date: { month: number; day: number }): string {
  return new Date(Date.UTC(2000, date.month - 1, date.day)).toLocaleDateString(
    "en-US",
    { day: "numeric", month: "long", timeZone: "UTC" },
  );
}

/**
 * One relative: their branch, their birthday, their promotion, what they
 * wrote about themselves, and the ways on from here. What search, the
 * birthdays and the tree can point at.
 *
 * It is `GET /users/{id}`, the shape every member may see of every other:
 * no email address, no role and no account status. The face is their
 * portrait when they have one, their initials if not. Somebody deactivated
 * is not found, like somebody who never existed.
 */
export default async function PersonPage({ params }: Params) {
  const person = await loadPerson((await params).id);
  if (!person) notFound();

  const branch = getSubfamilyBySlug(person.branch);
  const facts = [
    {
      icon: Users,
      label: "Branch",
      value: branch ? (
        <Link
          href={`${ROUTES.FAMILIES}/${branch.slug}`}
          className="text-brand hover:underline"
        >
          {branch.name} family
        </Link>
      ) : (
        person.branch
      ),
    },
    {
      icon: Cake,
      label: "Birthday",
      value: person.birthday ? birthday(person.birthday) : "Not added yet",
    },
    {
      icon: GraduationCap,
      label: "Promotion",
      value: person.promotion
        ? promotionLabel(person.promotion.name)
        : "Not added yet",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 pb-24">
      <PageHeader title="Family" as="p" />

      <section className="border-member-border bg-surface shadow-member flex flex-col items-center gap-6 rounded-lg border p-6 text-center sm:flex-row sm:p-10 sm:text-left">
        <PersonAvatar
          name={person.fullName}
          photo={person.photo}
          sizes="7rem"
          className="text-h2 size-28"
        />
        <div className="min-w-0">
          <h1 className="text-h1-m md:text-h1 text-member-ink">
            {person.fullName}
          </h1>
          {person.bio ? (
            <p className="text-body text-text mt-3 text-pretty whitespace-pre-line">
              {person.bio}
            </p>
          ) : null}
          {branch ? (
            <Quote
              meaning={branch.mottoMeaning}
              cite={`The ${branch.name} motto`}
              className="mt-4"
            >
              {branch.motto}
            </Quote>
          ) : null}
        </div>
      </section>

      <dl className="grid gap-4 sm:grid-cols-3">
        {facts.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="border-member-border bg-surface flex items-center gap-3 rounded-md border p-4"
          >
            <span className="bg-member-tint text-brand grid size-10 shrink-0 place-items-center rounded-md">
              <Icon aria-hidden className="size-5" />
            </span>
            <div className="min-w-0">
              <dt className="text-caption text-muted">{label}</dt>
              <dd className="text-body-sm text-member-ink font-semibold">
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href={ROUTES.TREE} variant="outline">
          <Network aria-hidden className="size-4" />
          See the family tree
        </ButtonLink>
        <ButtonLink href={ROUTES.BIRTHDAYS} variant="outline">
          <Cake aria-hidden className="size-4" />
          Family birthdays
        </ButtonLink>
      </div>
    </div>
  );
}
